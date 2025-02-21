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
  <div className=" w-screen p-4 sm:p-6  relative overflow-hidden flex items-center justify-center min-h-screen">
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
          <div className="bg-black backdrop-blur-lg p-6 sm:p-8 rounded-2xl border-2 border-dashed border-purple-300/50 hover:border-purple-300 transition-all group">
            <div className="flex flex-col text-purple-300 items-center gap-4">
              <Upload className="w-16 h-16 text-green-400 group-hover:text-purple-400 transition-colors" />
              <div className="text-center">
                <p className="text-xl font-medium">Drop your resume here</p>
                <p>or click to browse (PDF only)</p>
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
  <div className="min-h-screen w-screen p-4 sm:p-6 absolute inset-0 flex backdrop-blur-3xl items-center justify-center z-50 bg-black/80">
    <div className="w-full max-w-7xl">
      <div className="flex flex-col items-center justify-center gap-8 text-white">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-purple-300/20 border-t-purple-300 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-purple-300" />
        </div>
        <div className="text-lg sm:text-xl text-purple-200">
          Analyzing your resume... <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; RuntimeTerrors 🥷
        </div>
      </div>
    </div>
  </div>
);

const Jobs = ({ jobs = [] }) => {
  if (!jobs?.length) return null;
  const displayJobs = jobs;
  return (
    <div className="p-6 sm:p-8 w-full mt-8">
      <div className="bg-black w-full lg:max-w-screen-xl rounded-2xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-purple-400" />
            Matching Job Opportunities
          </h2>
        </div>

        <div className="overflow-x-auto w-full">
          <div className="flex gap-4 min-w-max pb-4">
            {displayJobs.map((job, idx) => (
              <div
                key={idx}
                className="w-full sm:w-80 bg-gradient-to-b from-purple-900/20 to-black p-4 sm:p-6 rounded-xl border border-purple-300/20 hover:border-purple-300/40 transition-all group"
              >
                <div className="flex flex-col h-full">
                  {job.companyLogo && (
                    <div className="mb-4">
                      <img
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-purple-200 group-hover:text-purple-100 transition-colors mb-2 line-clamp-2">
                    {job.position}
                  </h3>

                  <div className="flex items-center gap-2 text-purple-300 mb-4">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{job.company}</span>
                  </div>

                  <div className="space-y-2 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-purple-300/80">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-300/80">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{job.agoTime}</span>
                    </div>
                  </div>

                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 sm:py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg transition-all font-medium"
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
  const fileUp = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      if (!response.ok) throw new Error("Failed to analyze resume");

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);
  useCanvasCursor();
  return (
    <>
      <canvas className="pointer-events-none fixed z-50 inset-0" id="canvas" />
      <div className={`relative ${loading ? "backdrop-blur-lg" : ""}`}>
        <Waves
          className="h-screen w-screen"
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
        <Hero funcUpload={fileUp} loading={loading} />
        {loading && <Loader />}
        <div
          ref={resultsRef}
          id="results-container"
          className="bg-[#8A00C4] backdrop-blur-lg rounded-2xl p-4 sm:p-8 text-white"
        >
          {error && (
            <div className="min-h-screen w-screen flex items-center justify-center p-4 sm:p-6 ">
              <div className="w-full max-w-7xl">
                <div className="bg-red-500 backdrop-blur-lg text-red-200 p-4 sm:p-8 rounded-2xl border border-red-300/20">
                  <AlertTriangle className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Analysis Failed
                  </h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
          {results && !loading && (
            <div ref={resultsRef} className="w-full">
              {/* Resume Score Section */}
              <div className="bg-black rounded-2xl p-4 sm:p-8 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Resume Score Analysis
                </h2>
                <div className="text-4xl sm:text-5xl font-bold text-purple-300">
                  {results?.score?.total}{" "}
                  <span className="text-lg sm:text-xl">/ 100</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                  {results?.score?.breakdown &&
                    Object.entries(results.score.breakdown).map(
                      ([key, value]) => {
                        if (
                          key == "ats_compatibility" ||
                          key == "industry_benchmark"
                        ) {
                          return;
                        }
                        const maxScores = {
                          skills: 25,
                          experience: 25,
                          achievements: 25,
                          education: 25,
                        };

                        const maxScore = maxScores[key];

                        return (
                          <div
                            key={key}
                            className="bg-black p-3 sm:p-4 rounded-xl border border-purple-300/20"
                          >
                            <h3 className="text-lg font-semibold capitalize">
                              {key}
                            </h3>
                            <div className="text-xl font-bold">
                              {value}{" "}
                              <span className="text-sm">/ {maxScore}</span>
                            </div>
                            <div className="w-full bg-neutral-800 h-2 rounded-lg overflow-hidden">
                              <div
                                className="h-full bg-purple-400 rounded-lg"
                                style={{
                                  width: `${(value / maxScore) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
              {/* Industry Benchmarks Section */}
              <div className="bg-black rounded-2xl p-4 sm:p-8 text-white mt-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Industry Benchmarks
                </h2>
                <div className="text-4xl sm:text-5xl font-bold text-purple-300 ">
                  {results?.score?.breakdown.industry_benchmark}{" "}
                  <span className="text-lg sm:text-xl">/ 100</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 mb-8">
                  <div className="w-full bg-neutral-800 h-2 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-purple-400 rounded-lg"
                      style={{
                        width: `${
                          (results?.score?.breakdown.industry_benchmark / 100) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-300/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-300">Industry</span>
                        <span className="capitalize font-medium text-purple-200">
                          {results?.industry_analysis?.industry}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">
                          Experience Level
                        </span>
                        <span className="capitalize font-medium text-purple-200">
                          {results?.industry_analysis?.experience_level}
                        </span>
                      </div>
                    </div>

                    <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-300/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-300">
                          Average Industry Score
                        </span>
                        <span className="font-medium text-purple-200">
                          {
                            results?.industry_analysis?.benchmark_comparison
                              ?.average_score
                          }
                        </span>
                      </div>
                      {/* <div className="flex justify-between items-center">
                        <span className="text-purple-300">Your Percentile</span>
                        <span className="font-medium text-purple-200">
                          {
                            results?.industry_analysis?.benchmark_comparison
                              ?.percentile_ranking
                          }
                          th
                        </span>
                      </div> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg text-green-400 font-semibold mb-2">
                        Present Industry Skills
                      </h3>
                      <div className="space-y-2">
                        {results?.industry_analysis?.benchmark_comparison?.industry_skills_present.map(
                          (skill, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-purple-300"
                            >
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{skill}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg text-red-400 font-semibold mb-2">
                        Missing Industry Skills
                      </h3>
                      <div className="space-y-2">
                        {results?.industry_analysis?.benchmark_comparison?.industry_skills_missing.map(
                          (skill, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-purple-300"
                            >
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{skill}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATS Analysis Section */}
              <div className="bg-black rounded-2xl p-4 sm:p-8 text-white mt-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  ATS Analysis
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-300/20">
                      <h3 className="text-xl font-semibold mb-4">
                        Keyword Match Score
                      </h3>
                      <div className="relative pt-4">
                        <div className="text-4xl font-bold text-purple-300 mb-2">
                          {results?.ats_analysis?.keyword_match_score}%
                        </div>
                        <div className="w-full bg-neutral-800 h-3 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-lg"
                            style={{
                              width: `${results?.ats_analysis?.keyword_match_score}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-300/20">
                      <h3 className="text-xl font-semibold mb-4">
                        Keyword Frequency
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(
                          results?.ats_analysis?.keyword_frequency || {}
                        ).map(([keyword, frequency]) => (
                          <div
                            key={keyword}
                            className="flex justify-between items-center"
                          >
                            <span className="text-purple-300">{keyword}</span>
                            <span className="font-medium text-purple-200">
                              {frequency}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg text-green-400 font-semibold mb-2">
                        Keywords Found
                      </h3>
                      <div className="space-y-2">
                        {results?.ats_analysis?.keywords_found.map(
                          (keyword, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-purple-300"
                            >
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{keyword}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg text-red-400 font-semibold mb-2">
                        Missing Keywords
                      </h3>
                      <div className="space-y-2">
                        {results?.ats_analysis?.missing_critical_keywords.map(
                          (keyword, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-purple-300"
                            >
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{keyword}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Insights Section */}
              <div className="bg-black rounded-2xl p-4 sm:p-8 text-white mt-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Salary Insights
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-300/20">
                    <h3 className="text-xl font-semibold mb-4">
                      Estimated Salary Range
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">Low</span>
                        <span className="font-medium text-purple-200">
                          {
                            results?.salary_insights?.estimated_salary_range
                              ?.currency
                          }{" "}
                          {results?.salary_insights?.estimated_salary_range?.low?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">High</span>
                        <span className="font-medium text-purple-200">
                          {
                            results?.salary_insights?.estimated_salary_range
                              ?.currency
                          }{" "}
                          {results?.salary_insights?.estimated_salary_range?.high?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-300/20">
                    <h3 className="text-xl font-semibold mb-4">
                      Salary Factors
                    </h3>
                    <div className="space-y-2">
                      {results?.salary_insights?.salary_factors.map(
                        (factor, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-purple-300"
                          >
                            <Star className="w-5 h-5 text-purple-400" />
                            <span>{factor}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Recommended Roles*/}
              {results?.roles?.length > 0 && (
                <div className="bg-black rounded-2xl p-4 sm:p-8 text-white mt-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Recommended Roles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {results.roles.map((role, idx) => (
                      <div
                        key={idx}
                        className="bg-black p-4 sm:p-6 rounded-xl border border-purple-300/20"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-purple-200">
                            {role?.title ?? "Unknown Role"}
                          </h3>
                          <div className="px-2 sm:px-3 py-1 bg-purple-400/20 text-purple-200 rounded-full text-sm">
                            {role?.match_percentage ?? 0}% Match
                          </div>
                        </div>
                        <div className="space-y-2">
                          {role?.key_qualifications?.map((qual, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-purple-300"
                            >
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{qual}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              <div className="bg-black rounded-2xl p-4 sm:p-8 text-white mt-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Skills Analysis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg text-green-400 font-semibold mb-2">
                      Strong Skills
                    </h3>
                    <div className="space-y-2 text-purple-300">
                      {results?.skills_analysis?.strong_skills?.length ? (
                        results.skills_analysis.strong_skills.map(
                          (skill, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{skill}</span>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-purple-400" />
                          <span>None</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-red-400 font-semibold mb-2">
                      Missing Skills
                    </h3>
                    <div className="space-y-2 text-purple-300">
                      {results?.skills_analysis?.missing_skills?.length ? (
                        results.skills_analysis.missing_skills.map(
                          (skill, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{skill}</span>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-purple-400" />
                          <span>None</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-yellow-400 font-semibold mb-2">
                      Improvement Areas
                    </h3>
                    <div className="space-y-2 text-purple-300">
                      {results?.skills_analysis?.improvement_areas?.length ? (
                        results.skills_analysis.improvement_areas.map(
                          (area, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-purple-400" />
                              <span>{area}</span>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-purple-400" />
                          <span>None</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Feedback*/}
              <div className="bg-black rounded-2xl p-4 sm:p-8 text-purple-300 mt-8">
                <h2 className="text-2xl sm:text-3xl text-white font-bold mb-4">
                  Detailed Feedback
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col min-h-full">
                    <h3 className="text-lg text-green-400 font-semibold mb-2">
                      Strengths
                    </h3>
                    <ul className="space-y-2 list-disc text-purple-300 flex-grow">
                      {results?.detailed_feedback?.strengths?.length ? (
                        results.detailed_feedback.strengths.map(
                          (strength, i) => (
                            <li key={i} className="text-lg">
                              {strength}
                            </li>
                          )
                        )
                      ) : (
                        <li className="text-lg">None</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col min-h-full">
                    <h3 className="text-lg text-red-400 font-semibold mb-2">
                      Weaknesses
                    </h3>
                    <ul className="space-y-2 list-disc text-purple-300 flex-grow">
                      {results?.detailed_feedback?.weaknesses?.length ? (
                        results.detailed_feedback.weaknesses.map(
                          (weakness, i) => (
                            <li key={i} className="text-lg">
                              {weakness}
                            </li>
                          )
                        )
                      ) : (
                        <li className="text-lg">None</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col min-h-full">
                    <h3 className="text-lg text-yellow-400 font-semibold mb-2">
                      Improvement Tips
                    </h3>
                    <ul className="space-y-2 list-disc text-purple-300 flex-grow">
                      {results?.detailed_feedback?.improvement_tips?.length ? (
                        results.detailed_feedback.improvement_tips.map(
                          (tip, i) => (
                            <li key={i} className="text-lg">
                              {tip}
                            </li>
                          )
                        )
                      ) : (
                        <li className="text-lg">None</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Job Section */}
              {results?.job_search_results?.length > 0 && (
                <div className="bg-black p-4 sm:p-6 rounded-xl border border-purple-300/20 mt-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Job Listings
                  </h2>
                  <Jobs jobs={results.job_search_results} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
