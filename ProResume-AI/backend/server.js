require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const OpenAI = require("openai");
const { INDUSTRY_BENCHMARKS } = require("./industry_benchmarks");
const ATS_KEYWORDS = require("./ats_keywords");
const { query } = require("./web-scrape");

const app = express();

// --- IMPROVED CONFIGURATION ---
// 1. Security: Limit file size to 5MB and force PDF type
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF is allowed."), false);
    }
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || undefined,
  apiKey: process.env.LLM_API_KEY,
});

const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o";

// --- HELPER FUNCTIONS ---
function calculateWeightedScores(breakdown = {}) {
  const weights = {
    skills: 25,
    experience: 25,
    achievements: 25,
    education: 25,
  };

  let scaledScores = {};
  let totalScore = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const raw = breakdown[key] || 0;
    const scaled = Math.round((raw / 100) * weight);
    scaledScores[key] = scaled;
    totalScore += scaled;
  }

  scaledScores.ats_compatibility = breakdown.ats_compatibility || 0;
  scaledScores.industry_benchmark = breakdown.industry_benchmark || 0;

  return { scaledScores, totalScore };
}

// 2. Robustness: Clean markdown formatting from AI responses
function cleanJson(text) {
  if (!text) return "";
  // Remove ```json and ``` fences if present
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
}

// --- PROMPTS ---
const SYSTEM_PROMPT = `
You are a senior career coach and resume analyst.
Your goal is to analyze resumes against industry benchmarks and ATS standards.

### **Scoring Rules:**
- **Evaluate all categories out of 100.**
- Compare against industry benchmarks for the candidate's level.
- Analyze ATS keyword matches against industry standards.

### **Expected JSON Output Format (STRICT)**:
You must output ONLY valid JSON.
{
  "score": {
    "total": <0-100>,
    "breakdown": {
      "skills": <0-100>,
      "experience": <0-100>,
      "achievements": <0-100>,
      "education": <0-100>,
      "ats_compatibility": <0-100>,
      "industry_benchmark": <0-100>
    }
  },
  "industry_analysis": {
    "industry": "<string>",
    "experience_level": "<junior/mid/senior>",
    "benchmark_comparison": {
      "average_score": <number>,
      "percentile_ranking": <number>,
      "key_differentiators_present": ["<string>"],
      "key_differentiators_missing": ["<string>"],
      "industry_skills_present": ["<string>"],
      "industry_skills_missing": ["<string>"]
    }
  },
  "ats_analysis": {
    "keyword_match_score": <number>,
    "keywords_found": ["<string>"],
    "missing_critical_keywords": ["<string>"],
    "keyword_frequency": { "<keyword>": <number> }
  },
  "roles": [
    {
      "title": "<string>",
      "match_percentage": <number>,
      "key_qualifications": ["<string>"]
    }
  ],
  "skills_analysis": {
    "strong_skills": ["<string>"],
    "missing_skills": ["<string>"],
    "improvement_areas": ["<string>"]
  },
  "detailed_feedback": {
    "strengths": ["<string>"],
    "weaknesses": ["<string>"],
    "improvement_tips": ["<string>"]
  },
  "location": "<string>",
  "experience_level": "<string>",
  "salary_insights": {
    "estimated_salary_range": {
      "low": <number>,
      "high": <number>,
      "currency": "<string>"
    },
    "salary_factors": ["<string>"]
  }
}`;

// --- ROUTES ---

// 3. Robustness: Wrapper to handle Multer errors gracefully
const uploadMiddleware = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g. file too large)
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred or file type check failed
      return res.status(400).json({ error: err.message });
    }
    // Everything went fine
    next();
  });
};

app.post("/analyze", uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. PDF Parsing
    const data = await pdf(req.file.buffer);
    const text = data.text.trim();
    if (!text)
      return res
        .status(400)
        .json({
          error:
            "Unable to extract text from PDF. The file might be scanned or empty.",
        });

    // 2. Prepare Context
    const userPrompt = `
      Analyze this resume based on the following context:
      ## Reference Data
      Industry Benchmarks: ${JSON.stringify(INDUSTRY_BENCHMARKS)}
      ATS Keywords: ${JSON.stringify(ATS_KEYWORDS)}
      ## Resume Content
      ${text}
    `;

    // 3. AI Analysis
    const completion = await client.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    let responseContent = completion.choices[0].message.content;
    if (!responseContent) throw new Error("Empty response from AI Provider");

    // Clean potential markdown before parsing
    responseContent = cleanJson(responseContent);

    let analysis;
    try {
      analysis = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw content:", responseContent);
      return res
        .status(500)
        .json({
          error:
            "Failed to parse AI response. The model output was not valid JSON.",
        });
    }

    // 4. Score Calculation
    if (analysis.score) {
      const { scaledScores, totalScore } = calculateWeightedScores(
        analysis.score.breakdown,
      );
      analysis.score.breakdown = scaledScores;
      analysis.score.total = totalScore;
    } else {
      analysis.score = { total: 0, breakdown: {} };
    }

    // 5. Smart Job Search Integration
    const hasLocation =
      analysis.location &&
      !["unspecified", "unknown", "n/a", "none"].includes(
        analysis.location.toLowerCase(),
      );

    if (hasLocation || analysis.skills_analysis?.strong_skills) {
      // Logic Improvement: Use the detected Job Title + Top Skill for better results
      // E.g. "Software Engineer Java" is better than "Java, Python, C++"
      const roleTitle = analysis.roles?.[0]?.title || "";
      const topSkill = analysis.skills_analysis?.strong_skills?.[0] || "";

      let searchKeyword;
      if (roleTitle && topSkill) {
        searchKeyword = `${roleTitle} ${topSkill}`;
      } else {
        searchKeyword =
          analysis.skills_analysis?.strong_skills?.slice(0, 3).join(" ") ||
          "General";
      }

      const jobQuery = {
        keyword: searchKeyword,
        location: hasLocation ? analysis.location : "",
        experienceLevel: analysis.experience_level || "Entry Level",
        limit: 5,
        page: "0",
      };

      console.log(
        `Searching jobs for: "${jobQuery.keyword}" in "${jobQuery.location}"`,
      );

      analysis.job_search_results = await query(jobQuery).catch((err) => {
        console.error("Job search failed (non-fatal):", err.message);
        return [];
      });
    }

    res.json(analysis);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
