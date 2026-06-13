import { useState, useEffect } from "react";
import { Copy, Check, Download, AlertCircle, Volume2, VolumeX, Star, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../types";

const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  English: "en-US",
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
  Italian: "it-IT",
  Portuguese: "pt-PT",
  Russian: "ru-RU",
  Japanese: "ja-JP",
  Korean: "ko-KR",
  Chinese: "zh-CN",
  Arabic: "ar-SA",
  Hindi: "hi-IN",
};

interface TranslationOutputProps {
  translatedText: string;
  selectedLang: string; // Lang code/name
  onChangeLang: (value: string) => void;
  isLoading: boolean;
  detectedSourceLanguage?: string; // e.g. 'Spanish' if source lang was 'Auto-Detect'
  onCopy: () => void;
  onDownload: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenInsights: () => void;
}

export default function TranslationOutput({
  translatedText,
  selectedLang,
  onChangeLang,
  isLoading,
  detectedSourceLanguage,
  onCopy,
  onDownload,
  isBookmarked,
  onToggleBookmark,
  onOpenInsights,
}: TranslationOutputProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speaking when translatedText or selected target language changes
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [translatedText, selectedLang]);

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translatedText || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // safety first
      const utterance = new SpeechSynthesisUtterance(translatedText);
      const mappedLocale = LANGUAGE_LOCALE_MAP[selectedLang] || "en-US";
      utterance.lang = mappedLocale;

      // Try searching for the best fitting voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(mappedLocale.split("-")[0]));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesisUtterance error:", e);
        setIsSpeaking(false);
      };

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed run:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <div
      id="translation-output-container"
      className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md"
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 select-none">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tighter bg-teal-50 dark:bg-teal-400/10 px-2.5 py-1 rounded">
            AI Translation
          </span>
          <label htmlFor="target-lang-select" className="sr-only">Target Language</label>
          <select
            id="target-lang-select"
            value={selectedLang}
            onChange={(e) => onChangeLang(e.target.value)}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-7 appearance-none relative"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.4rem center',
              backgroundSize: '1.1rem',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.name} className="text-slate-900">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {/* Detected Language Indicator */}
          {detectedSourceLanguage && (
            <div
              id="detected-lang-badge"
              className="text-[10px] font-mono font-medium px-2 py-1 rounded bg-teal-50 dark:bg-teal-400/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/10"
            >
              Detected Source: {detectedSourceLanguage}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {translatedText && (
            <>
              {/* Bookmark (Star) Button */}
              <button
                id="bookmark-translation-btn"
                onClick={onToggleBookmark}
                title={isBookmarked ? "Remove from Phrasebook" : "Save to Phrasebook"}
                className={`p-2 rounded cursor-pointer transition-all ${
                  isBookmarked
                    ? "bg-amber-100/60 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Star className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" : ""}`} />
              </button>

              {/* Speaker Button (Text-To-Speech) */}
              <button
                id="speak-translation-btn"
                onClick={handleSpeak}
                title={isSpeaking ? "Stop reading aloud" : "Read translation aloud"}
                className={`p-2 rounded cursor-pointer transition-all ${
                  isSpeaking
                    ? "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20 border border-rose-200 dark:border-rose-500/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-500 dark:text-rose-400 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                id="copy-translation-btn"
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-2 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                id="download-translation-btn"
                onClick={onDownload}
                title="Export as Text File"
                className="p-2 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Output Content Area */}
      <div className="relative flex-1 p-5 min-h-[220px] bg-transparent flex flex-col justify-between">
        {isSpeaking && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-400/10 border border-teal-100 dark:border-teal-505/20 text-teal-700 dark:text-teal-400 text-[11px] font-sans font-medium animate-pulse z-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 animate-ping"></span>
            <span>Synthesizing Voice...</span>
          </div>
        )}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800/40"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 dark:border-t-teal-400 animate-spin"></div>
            </div>
            <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400">Contextualizing with Gemini AI...</span>
          </div>
        ) : translatedText ? (
          <div
            id="translated-output-field"
            className="w-full flex-1 text-slate-800 dark:text-slate-100 text-base leading-relaxed break-words whitespace-pre-wrap select-text selection:bg-indigo-100 dark:selection:bg-indigo-650 h-[180px]"
          >
            {translatedText}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-10 gap-2 select-none">
            <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            <span className="text-sm">Translation outcome will update here...</span>
          </div>
        )}
      </div>

      {/* Bottom status bar representing success metrics */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/35 dark:bg-slate-900/30 flex justify-between items-center min-h-[44px]">
        {translatedText && !isLoading ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-slate-400 dark:text-slate-500 hidden sm:inline">
              Completed in <span className="font-mono font-bold text-teal-600 dark:text-teal-400">~1.2s</span>
            </span>
            <button
              id="trigger-insights-btn"
              onClick={onOpenInsights}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer py-1 px-1.5 rounded hover:bg-teal-50 dark:hover:bg-teal-400/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400 shrink-0 animate-pulse" />
              <span>Linguistic Insights</span>
            </button>
          </div>
        ) : (
          <span className="text-xs text-transparent">Placeholder</span>
        )}
        <span className="text-[10px] sm:text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 select-none">
          🛡️ Secure Sandbox Connected
        </span>
      </div>
    </div>
  );
}
