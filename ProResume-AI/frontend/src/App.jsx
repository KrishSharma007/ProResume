import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sparkles,
  Star,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Clock,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";

// Assuming these components exist in your project structure
import Waves from "./blocks/Backgrounds/Waves/Waves";
import useCanvasCursor from "./blocks/canvasCursor";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/analyze";

const AnimBg = () => (
  <div className="fixed inset-0 -z-10 bg-black opacity-50">
    <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-[40rem] w-[40rem] animate-pulse rounded-full bg-purple-500 opacity-20 blur-3xl" />
      <div className="absolute h-[35rem] w-[35rem] animate-pulse rounded-full bg-indigo-500 opacity-20 blur-3xl" />
    </div>
  </div>
);

const ScrollP = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
    };
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const Hero = ({ funcUpload, loading }) => (
  <div className="w-screen p-4 sm:p-6 relative overflow-hidden flex items-center justify-center min-h-screen">
    <div className="w-full max-w-7xl">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            ProResume AI
          </h1>
          <p className="text-lg sm:text-xl text-purple-100">
            Transform your career with AI insights
          </p>
        </div>
        <label className="block w-full max-w-xl mx-auto cursor-pointer">
          <div className="bg-black/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border-2 border-dashed border-purple-300/50 hover:border-purple-300 transition-all group">
            <div className="flex flex-col text-purple-300 items-center gap-4">
              <Upload className="w-16 h-16 text-green-400 group-hover:text-purple-400 transition-colors" />
              <div className="text-center">
                <p className="text-xl font-medium">Drop your resume here</p>
                <p className="text-sm opacity-80 mt-1">
                  or click to browse (PDF only, Max 5MB)
                </p>
              </div>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={funcUpload}
              className="hidden"
              disabled={loading}
            />
          </div>
        </label>
        {!loading && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-purple-300" />
          </div>
        )}
      </div>
    </div>
  </div>
);
Hero.propTypes = {
  funcUpload: PropTypes.func,
  loading: PropTypes.bool,
};

const Loader = () => (
  <div className="fixed inset-0 min-h-screen w-screen p-4 sm:p-6 flex backdrop-blur-3xl items-center justify-center z-[60] bg-black/80">
    <div className="w-full max-w-7xl">
      <div className="flex flex-col items-center justify-center gap-8 text-white">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-purple-300/20 border-t-purple-300 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-purple-300" />
        </div>
        <div className="text-lg sm:text-xl text-purple-200 text-center">
          Analyzing your resume... <br />
          <span className="text-sm text-purple-400 mt-2 block">
            Made with ❤️ by -Krish 🥷
          </span>
        </div>
      </div>
    </div>
  </div>
);

const Jobs = ({ jobs = [] }) => {
  if (!jobs?.length) return null;

  return (
    <div className="w-full mt-8">
      <div className="bg-black/40 backdrop-blur-sm w-full rounded-2xl text-white border border-purple-300/10 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-purple-400" />
            Matching Job Opportunities
          </h2>
        </div>

        <div className="overflow-x-auto w-full pb-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
          <div className="flex gap-4 min-w-max">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="w-[280px] sm:w-80 bg-gradient-to-b from-purple-900/20 to-black p-4 sm:p-6 rounded-xl border border-purple-300/20 hover:border-purple-300/40 transition-all group flex flex-col"
              >
                <div className="flex flex-col h-full">
                  {job?.companyLogo && (
                    <div className="mb-4">
                      <img
                        src={job.companyLogo}
                        alt={`${job.company || "Company"} logo`}
                        className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-purple-200 group-hover:text-purple-100 transition-colors mb-2 line-clamp-2">
                    {job?.position || "Position Unavailable"}
                  </h3>

                  <div className="flex items-center gap-2 text-purple-300 mb-4">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">
                      {job?.company || "Unknown Company"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-purple-300/80">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {job?.location || "Remote / Unspecified"}
                      </span>
                    </div>
                    {job?.agoTime && (
                      <div className="flex items-center gap-2 text-purple-300/80">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{job.agoTime}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={job?.jobUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 w-full px-4 py-2 sm:py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg transition-all font-medium"
                  >
                    View Position
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
Jobs.propTypes = {
  jobs: PropTypes.array,
};

export default function ResumeAnalyzer() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  // Custom hook for cursor (keep as requested)
  useCanvasCursor();

  const fileUp = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Frontend validation to match backend
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results && resultsRef.current) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [results]);

  return (
    <>
      <canvas className="pointer-events-none fixed z-50 inset-0" id="canvas" />
      <div
        className={`relative min-h-screen overflow-x-hidden ${loading ? "backdrop-blur-sm" : ""}`}
      >
        <Waves
          className="fixed inset-0 h-screen w-screen -z-20"
          lineColor="#8A00C4"
          backgroundColor="rgba(0, 0, 0, 0.9)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.001}
          maxCursorMove={200}
          xGap={12}
          yGap={36}
        />

        <AnimBg />
        <ScrollP />

        {/* Main Content */}
        <div className="relative z-10">
          <Hero funcUpload={fileUp} loading={loading} />

          {loading && <Loader />}

          <div
            ref={resultsRef}
            id="results-container"
            className="container mx-auto px-4 sm:px-6 pb-20"
          >
            {error && (
              <div className="w-full max-w-4xl mx-auto mb-12">
                <div className="bg-red-500/10 backdrop-blur-lg text-red-200 p-6 rounded-2xl border border-red-500/20 flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 flex-shrink-0 text-red-400" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Analysis Failed
                    </h3>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && !loading && (
              <div className="bg-[#8A00C4]/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl">
                {/* Resume Score Section */}
                <div className="bg-black/40 rounded-2xl p-6 sm:p-8 text-white border border-purple-300/10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Resume Score Analysis
                  </h2>
                  <div className="flex items-baseline gap-4 mb-8">
                    <div className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100">
                      {results?.score?.total || 0}
                    </div>
                    <span className="text-xl text-purple-300/60">/ 100</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {results?.score?.breakdown &&
                      Object.entries(results.score.breakdown).map(
                        ([key, value]) => {
                          // Filter out non-weighted or internal keys
                          if (
                            [
                              "ats_compatibility",
                              "industry_benchmark",
                            ].includes(key)
                          )
                            return null;

                          // Safety: Define expected max scores.
                          const maxScores = {
                            skills: 25,
                            experience: 25,
                            achievements: 25,
                            education: 25,
                          };
                          const maxScore = maxScores[key];

                          // Skip if key is unknown/hallucinated by AI
                          if (!maxScore) return null;

                          return (
                            <div
                              key={key}
                              className="bg-black/40 p-5 rounded-xl border border-purple-300/10 hover:border-purple-300/30 transition-colors"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold capitalize text-purple-200">
                                  {key}
                                </h3>
                                <span className="text-sm text-purple-300/60 font-mono">
                                  {value}/{maxScore}
                                </span>
                              </div>
                              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${Math.min((value / maxScore) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        },
                      )}
                  </div>
                </div>

                {/* Industry Benchmarks Section */}
                <div className="bg-black/40 rounded-2xl p-6 sm:p-8 text-white mt-6 border border-purple-300/10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Company Benchmarks
                  </h2>
                  <div className="mb-8">
                    <div className="text-4xl sm:text-5xl font-bold text-purple-300 mb-4">
                      {results?.score?.breakdown?.industry_benchmark || 0}
                      <span className="text-xl text-purple-300/60 ml-2">
                        / 100
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden max-w-2xl">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000"
                        style={{
                          width: `${results?.score?.breakdown?.industry_benchmark || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-300/10">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-purple-300">Industry</span>
                          <span className="capitalize font-medium text-purple-100">
                            {results?.industry_analysis?.industry || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">
                            Experience Level
                          </span>
                          <span className="capitalize font-medium text-purple-100">
                            {results?.industry_analysis?.experience_level ||
                              "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-300/10">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">
                            Avg. Industry Score
                          </span>
                          <span className="font-medium text-purple-100">
                            {results?.industry_analysis?.benchmark_comparison
                              ?.average_score || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                        <h3 className="text-lg text-green-400 font-semibold mb-3">
                          Industry Skills You Have
                        </h3>
                        <div className="space-y-2">
                          {results?.industry_analysis?.benchmark_comparison?.industry_skills_present?.map(
                            (skill, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-purple-200/80 text-sm"
                              >
                                <Star className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>{skill}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                        <h3 className="text-lg text-red-400 font-semibold mb-3">
                          Missing Skills
                        </h3>
                        <div className="space-y-2">
                          {results?.industry_analysis?.benchmark_comparison?.industry_skills_missing?.map(
                            (skill, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-purple-200/80 text-sm"
                              >
                                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <span>{skill}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ATS Analysis Section */}
                <div className="bg-black/40 rounded-2xl p-6 sm:p-8 text-white mt-6 border border-purple-300/10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    ATS Analysis
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-300/10">
                        <h3 className="text-xl font-semibold mb-4 text-purple-200">
                          Keyword Match
                        </h3>
                        <div className="relative pt-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-purple-300 text-sm">
                              Score
                            </span>
                            <span className="text-xl font-bold text-purple-100">
                              {results?.ats_analysis?.keyword_match_score || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                              style={{
                                width: `${results?.ats_analysis?.keyword_match_score || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-300/10">
                        <h3 className="text-lg font-semibold mb-4 text-purple-200">
                          Keyword Frequency
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(
                            results?.ats_analysis?.keyword_frequency || {},
                          ).map(([keyword, frequency]) => (
                            <span
                              key={keyword}
                              className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-sm"
                            >
                              {keyword}{" "}
                              <span className="opacity-60 ml-1">
                                x{frequency}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                        <h3 className="text-lg text-green-400 font-semibold mb-3">
                          Matched
                        </h3>
                        <div className="space-y-2">
                          {results?.ats_analysis?.keywords_found?.map(
                            (keyword, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-purple-200/80 text-sm"
                              >
                                <Star className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>{keyword}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                        <h3 className="text-lg text-red-400 font-semibold mb-3">
                          Missing
                        </h3>
                        <div className="space-y-2">
                          {results?.ats_analysis?.missing_critical_keywords?.map(
                            (keyword, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-purple-200/80 text-sm"
                              >
                                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <span>{keyword}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Insights Section */}
                {results?.salary_insights && (
                  <div className="bg-black/40 rounded-2xl p-6 sm:p-8 text-white mt-6 border border-purple-300/10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                      Salary Insights
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-300/10">
                        <h3 className="text-xl font-semibold mb-4 text-purple-200">
                          Estimated Range
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-purple-300">Low End</span>
                            <span className="font-bold text-purple-100 text-lg">
                              {
                                results?.salary_insights?.estimated_salary_range
                                  ?.currency
                              }{" "}
                              {results?.salary_insights?.estimated_salary_range?.low?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-purple-300">High End</span>
                            <span className="font-bold text-purple-100 text-lg">
                              {
                                results?.salary_insights?.estimated_salary_range
                                  ?.currency
                              }{" "}
                              {results?.salary_insights?.estimated_salary_range?.high?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-300/10">
                        <h3 className="text-xl font-semibold mb-4 text-purple-200">
                          Key Factors
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {results?.salary_insights?.salary_factors?.map(
                            (factor, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-200 text-sm border border-purple-500/20"
                              >
                                {factor}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommended Roles */}
                {results?.roles?.length > 0 && (
                  <div className="bg-black/40 rounded-2xl p-6 sm:p-8 text-white mt-6 border border-purple-300/10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                      Recommended Roles
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {results.roles.map((role, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-purple-900/20 to-black p-5 rounded-xl border border-purple-300/20 hover:border-purple-300/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4 gap-2">
                            <h3 className="text-lg font-bold text-purple-100 leading-tight">
                              {role?.title || "Role"}
                            </h3>
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold whitespace-nowrap">
                              {role?.match_percentage || 0}%
                            </span>
                          </div>
                          <div className="space-y-1">
                            {role?.key_qualifications
                              ?.slice(0, 3)
                              .map((qual, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-purple-300/80 text-sm"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                  <span className="truncate">{qual}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Analysis */}
                <div className="bg-black/40 rounded-2xl p-6 sm:p-8 text-white mt-6 border border-purple-300/10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Skills Breakdown
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Strong Skills */}
                    <div>
                      <h3 className="text-lg text-green-400 font-semibold mb-4 border-b border-green-500/20 pb-2">
                        Strong Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results?.skills_analysis?.strong_skills?.length ? (
                          results.skills_analysis.strong_skills.map(
                            (skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-green-500/10 text-green-300 rounded-full text-sm border border-green-500/20"
                              >
                                {skill}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-gray-500 text-sm italic">
                            None detected
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Missing Skills */}
                    <div>
                      <h3 className="text-lg text-red-400 font-semibold mb-4 border-b border-red-500/20 pb-2">
                        Missing Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results?.skills_analysis?.missing_skills?.length ? (
                          results.skills_analysis.missing_skills.map(
                            (skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-red-500/10 text-red-300 rounded-full text-sm border border-red-500/20"
                              >
                                {skill}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-gray-500 text-sm italic">
                            None detected
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Improvement Areas */}
                    <div>
                      <h3 className="text-lg text-yellow-400 font-semibold mb-4 border-b border-yellow-500/20 pb-2">
                        To Improve
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results?.skills_analysis?.improvement_areas?.length ? (
                          results.skills_analysis.improvement_areas.map(
                            (area, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-yellow-500/10 text-yellow-300 rounded-full text-sm border border-yellow-500/20"
                              >
                                {area}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-gray-500 text-sm italic">
                            None detected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="bg-black/40 rounded-2xl p-6 sm:p-8 mt-6 border border-purple-300/10">
                  <h2 className="text-2xl sm:text-3xl text-white font-bold mb-6">
                    Detailed Feedback
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Strengths",
                        data: results?.detailed_feedback?.strengths,
                        color: "green",
                      },
                      {
                        title: "Weaknesses",
                        data: results?.detailed_feedback?.weaknesses,
                        color: "red",
                      },
                      {
                        title: "Action Plan",
                        data: results?.detailed_feedback?.improvement_tips,
                        color: "yellow",
                      },
                    ].map((section, idx) => (
                      <div
                        key={idx}
                        className={`bg-${section.color}-500/5 p-5 rounded-xl border border-${section.color}-500/10 h-full`}
                      >
                        <h3
                          className={`text-lg text-${section.color}-400 font-semibold mb-3`}
                        >
                          {section.title}
                        </h3>
                        <ul className="space-y-3">
                          {section.data?.length ? (
                            section.data.map((item, i) => (
                              <li
                                key={i}
                                className="text-purple-200/90 text-sm leading-relaxed flex items-start gap-2"
                              >
                                <span
                                  className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${section.color}-500 flex-shrink-0`}
                                />
                                {item}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 text-sm italic">
                              No specific feedback
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Listings */}
                {results?.job_search_results?.length > 0 && (
                  <Jobs jobs={results.job_search_results} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
