require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const fetch = require("node-fetch");
const { INDUSTRY_BENCHMARKS } = require("./industry_benchmarks");
const ATS_KEYWORDS = require("./ats_keywords");
const { query } = require("./web-scrape");
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors());
app.use(express.json());

const MAX_LIMITS = {
  skills: 25,
  experience: 25,
  achievements: 25,
  education: 25,
  ats_compatibility: 100,
  diversity_inclusion: 100,
  industry_benchmark: 100,
};
function scaleScores(rawScores) {
  let scaledScores = {};
  let totalScore = 0;

  Object.keys(rawScores).forEach((key) => {
    let raw = rawScores[key];
    let maxLimit = MAX_LIMITS[key];
    let scaled = Math.round((raw / 100) * maxLimit);
    if (!["ats_compatibility", "industry_benchmark"].includes(key)) {
      scaledScores[key] = scaled;
      totalScore += scaled;
    } else {
      scaledScores[key] = raw;
    }
  });
  return { scaledScores, totalScore };
}
async function searchJobs(queryOptions) {
  try {
    const response = await query(queryOptions);
    return response;
  } catch (error) {
    console.error("Error searching jobs:", error);
    return [];
  }
}

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = await pdf(req.file.buffer);
    const text = data.text.trim();

    if (!text) {
      return res.status(400).json({ error: "Unable to extract text from PDF" });
    }
    const createAnalysisPrompt = (text, industryBenchmarks, atsKeywords) => {
      const benchmarksStr = JSON.stringify(industryBenchmarks, null, 2);
      const keywordsStr = JSON.stringify(atsKeywords, null, 2);
      return `
As a senior career coach and resume analyst with 20 years of experience in talent acquisition and career development, analyze the following resume. Follow these **STRICT** instructions without deviation. **DO NOT** include any text outside the JSON format.

### **Scoring Rules:**
- **Evaluate all categories out of 100.**
- Compare against industry benchmarks for the candidate's level.
- Analyze ATS keyword matches against industry standards.
- Evaluate against diversity and inclusion guidelines.

### **Reference Data:**
## Industry Benchmarks:
(Raw text for AI, do not interpret as code)
${benchmarksStr}

## ATS Keywords by Industry:
(Raw text for AI, do not interpret as code)
${keywordsStr}

### **Expected JSON Output Format (STRICT)**:
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
    "industry": "<detected industry>",
    "experience_level": "<junior/mid/senior>",
    "benchmark_comparison": {
      "average_score": <industry average score>,
      "percentile_ranking": <percentile>,
      "key_differentiators_present": ["<differentiator1>", "<differentiator2>"],
      "key_differentiators_missing": ["<differentiator1>", "<differentiator2>"],
      "industry_skills_present": ["<skill1>", "<skill2>"],
      "industry_skills_missing": ["<skill1>", "<skill2>"]
    }
  },
  "ats_analysis": {
    "keyword_match_score": <0-100>,
    "keywords_found": ["<keyword1>", "<keyword2>"],
    "missing_critical_keywords": ["<keyword1>", "<keyword2>"],
    "keyword_frequency": {
      "<keyword1>": <count>,
      "<keyword2>": <count>
    }
  },
  "roles": [
    {
      "title": "<role title>",
      "match_percentage": <0-100>,
      "key_qualifications": ["<qual1>", "<qual2>", "<qual3>"]
    }
  ],
  "skills_analysis": {
    "strong_skills": ["<skill1>", "<skill2>", "<skill3>"],
    "missing_skills": ["<skill1>", "<skill2>", "<skill3>"],
    "improvement_areas": ["<area1>", "<area2>", "<area3>"]
  },
  "detailed_feedback": {
    "strengths": ["<strength1>", "<strength2>", "<strength3>"],
    "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
    "improvement_tips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>", "<tip5>"]
  },
  "location": "<location extracted from resume>",
  "experience_level": "<experience level extracted or inferred from resume>",
  "salary_insights": {
    "estimated_salary_range": {
      "low": <salary_low>,
      "high": <salary_high>,
      "currency": "<currency>"
    },
    "salary_factors": ["<factor1>", "<factor2>", "<factor3>"]
  }
}

### **Resume Content for Analysis:**
${text}

### **Final Instructions:**
- **Your response MUST be ONLY valid JSON without any extra text, comments, or explanations.**
- **Ensure ALL score breakdowns are between 0-100.**
- **Provide unbiased and fair analysis based on industry benchmarks.**
- **Extract the candidate location from the resume.**
- **Detect missing critical skills & keywords.**
- **Generate personalized recommendations.**
`;
    };

    // Usage example:
    const prompt = createAnalysisPrompt(
      text,
      INDUSTRY_BENCHMARKS,
      ATS_KEYWORDS
    );
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "command-r-plus",
        prompt: prompt,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("API Error:", errorMessage);
      throw new Error(`API request failed: ${errorMessage}`);
    }
    const completion = await response.json();
    console.log("Raw AI Response:", completion);
    const responseContent = completion?.generations?.[0]?.text || "";
    if (!responseContent) {
      throw new Error("Empty or invalid response content");
    }

    let analysis;
    try {
      analysis = JSON.parse(responseContent);
      console.log("Parsed AI Response:", analysis);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.log("Raw response:", responseContent);
      res.status(500).json({
        error: "Failed to parse AI response",
        details: error.message,
      });
      return;
    }
    if (!analysis.score?.breakdown) {
      throw new Error("Missing score breakdown in the response");
    }
    const { scaledScores, totalScore } = scaleScores(analysis.score.breakdown);
    analysis.score.breakdown = scaledScores;
    analysis.score.total = totalScore;
    const jobQuery = {
      keyword: analysis.skills_analysis.strong_skills.join(", "),
      location: analysis.location,
      experienceLevel: analysis.experience_level,
      limit: 5,
      page: "0",
    };
    if (
      analysis.location != null ||
      analysis.location != "Unspecified" ||
      analysis.skills_analysis.strong_skills
    ) {
      const jobSearchResults = await searchJobs(jobQuery);
      analysis.job_search_results = jobSearchResults;
    }
    res.json(analysis);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Analysis failed",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
