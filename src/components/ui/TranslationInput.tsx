import React, { useState, useRef, useEffect } from "react";
import { Upload, Trash2, ArrowRightLeft, Sparkles, Mic, MicOff } from "lucide-react";
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
  Turkish: "tr-TR",
  Dutch: "nl-NL",
  Vietnamese: "vi-VN",
  Thai: "th-TH",
  Indonesian: "id-ID",
  Polish: "pl-PL",
  Swedish: "sv-SE",
  Ukrainian: "uk-UA",
  Greek: "el-GR",
  Bengali: "bn-BD",
  Persian: "fa-IR",
  Hebrew: "he-IL",
  Norwegian: "no-NO",
  Danish: "da-DK",
  Finnish: "fi-FI",
  Czech: "cs-CZ",
  Romanian: "ro-RO",
  Hungarian: "hu-HU",
};

interface TranslationInputProps {
  text: string;
  onChangeText: (value: string) => void;
  selectedLang: string; // Lang code (e.g., 'auto' or 'en')
  onChangeLang: (value: string) => void;
  onClear: () => void;
  onTranslate: () => void;
  isLoading: boolean;
  onSwapLanguages?: () => void;
  isSwapEnabled?: boolean;
}

export default function TranslationInput({
  text,
  onChangeText,
  selectedLang,
  onChangeLang,
  onClear,
  onTranslate,
  isLoading,
  onSwapLanguages,
  isSwapEnabled = true,
}: TranslationInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome, MS Edge, or Apple Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const mappedLocale = LANGUAGE_LOCALE_MAP[selectedLang] || "en-US";
        recognition.lang = mappedLocale;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              onChangeText(text ? `${text.trim()} ${transcript}` : transcript);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  // File Upload Handlers
  const handleFileContent = (file: File) => {
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      alert("Invalid file type. Please upload a plain text file (.txt).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileText = e.target?.result as string;
      if (fileText) {
        onChangeText(fileText);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileContent(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileContent(e.target.files[0]);
    }
  };

  return (
    <div
      id="translation-input-container"
      className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm relative overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 hover:shadow-md"
    >
      {/* Top Bar (Language selector + controls) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded select-none">
            Input Source
          </span>
          <label htmlFor="source-lang-select" className="sr-only">Source Language</label>
          <select
            id="source-lang-select"
            value={selectedLang}
            onChange={(e) => onChangeLang(e.target.value)}
            className="text-xs font-semibold text-slate-750 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-7 appearance-none relative"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.4rem center',
              backgroundSize: '1.1rem',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <option value="Auto-Detect">✨ Auto-Detect</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Microphone button (Speech-To-Text) */}
          <button
            id="mic-translation-btn"
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop voice input" : "Speak to translate"}
            className={`p-2 rounded cursor-pointer transition-all ${
              isListening
                ? "bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 ring-2 ring-rose-500/20 border border-rose-500/30"
                : "text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Swap Button for mobile if enabled */}
          {isSwapEnabled && onSwapLanguages && (
            <button
              id="swap-langs-btn-mobile"
              type="button"
              onClick={onSwapLanguages}
              title="Swap Languages"
              className="md:hidden p-2 rounded text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          )}

          {text && (
            <button
              id="clear-input-btn"
              type="button"
              onClick={onClear}
              title="Clear text"
              className="p-2 rounded text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Overlay or Main Textarea Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex-1 flex flex-col p-5 min-h-[220px] ${
          isDragging
            ? "bg-indigo-50/50 dark:bg-indigo-950/25 border-2 border-dashed border-indigo-400"
            : ""
        }`}
      >
        {isListening && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-250 dark:border-rose-900/50 text-rose-650 dark:text-rose-400 text-[11px] font-sans font-medium animate-pulse z-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded bg-rose-505 animate-ping"></span>
            <span>Listening...</span>
          </div>
        )}
        {isDragging ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-indigo-505 gap-2">
            <Upload className="w-10 h-10 animate-bounce" />
            <span className="text-sm font-bold">Drop txt file to read</span>
          </div>
        ) : null}

        <textarea
          id="text-input-field"
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Type or paste text to translate, or drag a .txt file here..."
          maxLength={5000}
          className="w-full flex-1 resize-none bg-transparent text-slate-850 dark:text-slate-100 placeholder-slate-400 border-0 focus:outline-none focus:ring-0 text-base leading-relaxed h-[180px] font-sans"
        />

        {/* File upload prompt if input is empty */}
        {!text && !isDragging && (
          <div className="mt-2 flex items-center justify-center p-4 border border-dashed border-blue-200 dark:border-blue-900/40 rounded bg-blue-50/35 dark:bg-blue-950/20 text-xs text-slate-500 dark:text-slate-400">
            <button
              id="trigger-file-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Upload .txt file</span>
            </button>
            <span className="mx-1 text-slate-400 dark:text-slate-500">or drag it here</span>
            <input
              id="file-upload-input"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".txt"
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30">
        <div id="character-counters" className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span>
            {characterCount} <span className="text-slate-300 dark:text-slate-700">/</span> 5000 chars
          </span>
          <span className="inline-block w-1 h-1 bg-slate-300 dark:bg-slate-750 rounded-full"></span>
          <span>{wordCount} words</span>
        </div>

        <button
          id="translate-submit-btn"
          onClick={onTranslate}
          disabled={isLoading || !text?.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:shadow-indigo-200/50 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer relative"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isLoading ? "Translating..." : "Translate Now"}</span>
        </button>
      </div>
    </div>
  );
}
