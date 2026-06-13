import { Sun, Moon } from "lucide-react";
import { Theme } from "../../types";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="p-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm relative overflow-hidden"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === "light" ? (
          <Moon className="w-5 h-5 animate-slide-up" />
        ) : (
          <Sun className="w-5 h-5 animate-slide-up text-amber-400" />
        )}
      </div>
    </button>
  );
}
