import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  BookOpen,
  Scale,
  MessageSquareCode,
  Globe,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { LinguisticInsights } from "../../types";

interface TranslationInsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  insights: LinguisticInsights | null;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  tone: string;
  onRetry: () => void;
}

export default function TranslationInsightsDrawer({
  isOpen,
  onClose,
  isLoading,
  error,
  insights,
  originalText,
  translatedText,
  sourceLang,
  targetLang,
  tone,
  onRetry,
}: TranslationInsightsDrawerProps) {
  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            id="insights-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            id="insights-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 max-w-lg w-full bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-gray-800/85 z-55 shadow-2xl flex flex-col h-full focus:outline-none"
          >
            {/* Header Area */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-55/75 dark:bg-indigo-950/40 text-indigo-505 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-sans font-bold text-gray-900 dark:text-white">
                    Linguistic & Cultural Breakdown
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    Explore the linguistic logic behind your translation
                  </p>
                </div>
              </div>
              <button
                id="insights-drawer-close"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-650 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin select-text">
              {/* Context Summary Meta Capsule */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-805/40 bg-gray-50/30 dark:bg-slate-950/20">
                <div className="flex items-center justify-between mb-3 text-[11px] font-sans text-gray-400 dark:text-gray-500">
                  <span className="font-semibold uppercase tracking-wider">Translation Context</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100/10">
                    Tone: {tone || "Standard"}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-405 dark:text-gray-400 uppercase tracking-widest text-[9px] block">
                      {sourceLang} Original
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 mt-0.5 line-clamp-2 leading-relaxed">
                      "{originalText}"
                    </p>
                  </div>
                  <div className="border-t border-gray-100/40 dark:border-gray-805/10 pt-2">
                    <span className="font-semibold text-indigo-505 dark:text-indigo-400 uppercase tracking-widest text-[9px] block">
                      {targetLang} Outcome
                    </span>
                    <p className="text-gray-900 dark:text-white font-semibold mt-0.5 line-clamp-2 leading-relaxed">
                      "{translatedText}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Loader, Error, or Main insights */}
              {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-50 dark:border-indigo-950"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 dark:border-t-indigo-400 animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-sans font-semibold text-gray-700 dark:text-gray-200">
                      Analyzing Language Structures...
                    </p>
                    <p className="text-xs text-gray-405 dark:text-gray-500 max-w-xs">
                      Gemini model is scanning comparative syntax patterns, cultural nuances, and idiomatic replacements.
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="py-10 text-center border border-dashed border-rose-105 dark:border-rose-955/40 bg-rose-50/5 dark:bg-rose-955/5 rounded-xl p-6">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-250">
                    Failed to fetch Insights
                  </p>
                  <p className="text-xs text-gray-405 dark:text-gray-500 mt-1 mb-4 leading-relaxed">
                    {error}
                  </p>
                  <button
                    id="retry-insights-btn"
                    onClick={onRetry}
                    className="text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow transition-colors cursor-pointer"
                  >
                    Retry Analysis
                  </button>
                </div>
              ) : insights ? (
                <div className="space-y-6">
                  {/* Category 1: Grammar differences */}
                  <div>
                    <h3 className="text-xs font-sans font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Scale className="w-4 h-4 text-indigo-500" />
                      Comparative Grammar Difference
                    </h3>
                    {insights.grammarDifferences.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No major syntax transformations detected.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {insights.grammarDifferences.map((g, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-slate-950/40 border border-gray-105 dark:border-gray-800"
                          >
                            <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                              {g.rule}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-350 mt-2 leading-relaxed">
                              {g.explanation}
                            </p>
                            {g.example && (
                              <div className="bg-white dark:bg-slate-900 border border-gray-50 dark:border-gray-850 p-2.5 rounded-lg mt-2 font-mono text-[11px] text-gray-505 dark:text-gray-450 leading-loose">
                                {g.example}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category 2: Idioms and wordplay */}
                  <div>
                    <h3 className="text-xs font-sans font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-pink-500" />
                      Idioms & Key Phrasings ({insights.idioms.length})
                    </h3>
                    {insights.idioms.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No idiomatic wordplay highlighted.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {insights.idioms.map((idm, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-slate-900 shadow-sm"
                          >
                            <div className="font-bold text-sm text-gray-850 dark:text-white">
                              {idm.phrase}
                            </div>
                            <div className="text-xs font-sans text-rose-500/85 mt-1 font-semibold">
                              💡 Meaning: {idm.meaning}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                              {idm.context}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category 3: Alternative phrasing registers */}
                  <div>
                    <h3 className="text-xs font-sans font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <MessageSquareCode className="w-4 h-4 text-emerald-505" />
                      Alternative Registers & Ways To Say
                    </h3>
                    <div className="space-y-3">
                      {insights.alternativePhrases.map((alt, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-emerald-50/5 dark:bg-emerald-955/5 border border-emerald-100/10 dark:border-emerald-900/10"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 selection:bg-emerald-500 select-all">
                              {alt.phrase}
                            </span>
                            <span className="text-[9px] font-sans font-bold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100/10 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded">
                              {alt.register}
                            </span>
                          </div>
                          <p className="text-xs text-gray-505 dark:text-gray-450 leading-relaxed">
                            {alt.whyUseIt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 4: Cultural insights nugget */}
                  <div>
                    <h3 className="text-xs font-sans font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-purple-505" />
                      Cultural Etiquette Context
                    </h3>
                    {insights.culturalNuances.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-purple-55/10 dark:bg-purple-955/15 border border-purple-100/10 dark:border-purple-900/10 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full -mr-4 -mt-4" />
                        <h4 className="text-xs font-sans font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                          🎭 {c.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-350 mt-1.5 leading-relaxed">
                          {c.fact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400 select-none">
                  <HelpCircle className="w-10 h-10 text-gray-250 mx-auto mb-2" />
                  <p className="text-sm">No insights dataset loaded.</p>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50 text-[10px] sm:text-xs font-sans text-gray-405 text-center flex items-center justify-center gap-1 leading-normal">
              <span>💡 Deep linguistic comparative model analyzed by Google Gemini</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
