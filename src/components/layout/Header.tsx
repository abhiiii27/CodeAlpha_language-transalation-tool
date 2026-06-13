import ThemeToggle from "../ui/ThemeToggle";
import { Theme } from "../../types";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="w-full mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-sm select-none">
            <span className="text-white font-mono font-bold text-xs uppercase tracking-tighter">LT</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-850 dark:text-slate-100 font-sans">
            LingoAI <span className="text-slate-400 dark:text-slate-500 font-normal">Translator</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded font-mono select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wide">AI Engine: Neural v2.4 (Online)</span>
          </div>
          
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
