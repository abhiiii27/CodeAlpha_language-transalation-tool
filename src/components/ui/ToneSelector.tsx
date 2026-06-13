import React from "react";
import { Sparkles } from "lucide-react";

export interface ToneOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "standard",
    label: "Standard",
    emoji: "✨",
    description: "Preserve the original context and style",
  },
  {
    id: "formal",
    label: "Formal",
    emoji: "👔",
    description: "Business and professional communications",
  },
  {
    id: "informal",
    label: "Informal",
    emoji: "☕",
    description: "Casual conversation with friends",
  },
  {
    id: "slang",
    label: "Slang/Idiomatic",
    emoji: "⚡",
    description: "Localized, natural street phrasing",
  },
  {
    id: "creative",
    label: "Creative",
    emoji: "✍️",
    description: "Poetic, literary, or expressive style",
  },
];

interface ToneSelectorProps {
  selectedTone: string;
  onChangeTone: (toneId: string) => void;
}

export default function ToneSelector({ selectedTone, onChangeTone }: ToneSelectorProps) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm mt-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-sans font-bold text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            Tone & Context Settings
          </h3>
          <p className="text-xs font-sans text-slate-400 dark:text-slate-500 mt-0.5">
            Instruct the neural AI engine to re-phrase your translations under a custom register or context.
          </p>
        </div>
        <div className="text-[10px] sm:text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded border border-indigo-100/30 w-fit">
          Selected: <span className="uppercase">{TONE_OPTIONS.find(t => t.id === selectedTone)?.label || "Standard"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2.5">
        {TONE_OPTIONS.map((tone) => {
          const isSelected = selectedTone === tone.id;
          return (
            <button
              key={tone.id}
              id={`tone-btn-${tone.id}`}
              type="button"
              title={tone.description}
              onClick={() => onChangeTone(tone.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded border font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left md:text-center shrink-0 flex-1 md:flex-initial ${
                isSelected
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                  : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <span className="text-base sm:text-lg mb-0.5">{tone.emoji}</span>
              <div className="flex flex-col">
                <span className="leading-tight">{tone.label}</span>
                <span className={`text-[10px] sm:hidden md:hidden lg:inline font-normal leading-normal mt-0.5 ${
                  isSelected ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"
                }`}>
                  {tone.id === "standard" ? "Standard literal" : tone.id === "formal" ? "Business style" : tone.id === "informal" ? "Casual communication" : tone.id === "slang" ? "Street phrasing" : "Expressive & creative"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
