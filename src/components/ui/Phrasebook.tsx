import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  Trash2,
  Folder,
  FolderOpen,
  FolderPlus,
  ArrowRight,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { FavoritePhrase } from "../../types";

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

interface PhrasebookProps {
  favorites: FavoritePhrase[];
  onLoadItem: (item: FavoritePhrase) => void;
  onDeleteFavorite: (id: string) => void;
  onUpdateCategory: (id: string, newCategory: string) => void;
  onAddCustomCategory?: (category: string) => void;
  onClearFavorites: () => void;
}

export default function Phrasebook({
  favorites,
  onLoadItem,
  onDeleteFavorite,
  onUpdateCategory,
  onClearFavorites,
}: PhrasebookProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [confirmClear, setConfirmClear] = useState(false);
  const [showAddFolderInput, setShowAddFolderInput] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");
  
  // Audio playback state
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stop synthesis on component change or unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (item: FavoritePhrase, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card load on icon click
    if (!window.speechSynthesis) return;

    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.translatedText);
      const mappedLocale = LANGUAGE_LOCALE_MAP[item.targetLang] || "en-US";
      utterance.lang = mappedLocale;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(mappedLocale.split("-")[0]));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        setSpeakingId(null);
      };

      utterance.onerror = () => {
        setSpeakingId(null);
      };

      setSpeakingId(item.id);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingId(null);
    }
  };

  const handleCopy = (item: FavoritePhrase, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.translatedText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get list of unique categories
  const categories = ["All", ...Array.from(new Set(favorites.map((f) => f.category || "General")))];

  // Clean and filter favorites
  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch =
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceLang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetLang.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "All") {
      return matchesSearch;
    }
    return matchesSearch && item.category === selectedCategory;
  });

  const handleAddCustomFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderInput.trim()) return;
    
    const formattedCategory = newFolderInput.trim();
    if (!categories.includes(formattedCategory)) {
      setSelectedCategory(formattedCategory);
    }
    setNewFolderInput("");
    setShowAddFolderInput(false);
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div
      id="smart-phrasebook-panel"
      className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-100 dark:fill-indigo-950/40" />
          <h2 className="text-sm font-sans font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Phrasebook & Organized Folders
          </h2>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/30">
            {favorites.length} Saved
          </span>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <span className="text-xs text-rose-500 font-bold font-sans">Are you sure?</span>
                <button
                  id="confirm-clear-phrasebook-btn"
                  onClick={() => {
                    onClearFavorites();
                    setConfirmClear(false);
                  }}
                  className="text-[10px] font-mono font-bold bg-rose-500 text-white hover:bg-rose-600 px-2 py-1 rounded cursor-pointer uppercase tracking-wider shadow-sm transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  id="cancel-clear-phrasebook-btn"
                  onClick={() => setConfirmClear(false)}
                  className="text-[10px] font-sans font-medium text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="clear-all-phrasebook-btn"
                onClick={() => setConfirmClear(true)}
                className="text-xs font-mono font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Phrasebook</span>
              </button>
            )}
          </div>
        )}
      </div>

      {favorites.length === 0 && !showAddFolderInput && selectedCategory === "All" ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded text-slate-400 text-center select-none">
          <Star className="w-8 h-8 text-slate-200 dark:text-slate-800 mb-2" />
          <p className="text-sm font-bold">Your smart phrasebook is empty.</p>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 max-w-sm font-sans leading-relaxed">
            Star/bookmark translations right on the outcome panel to store frequent expressions in organized local folders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
          {/* Left Panel: Folders / Folders sidebar */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 mr-auto select-none">
              Folders list
            </div>
            
            <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-2 lg:pb-0 pr-1 select-none scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === "All" ? favorites.length : favorites.filter(f => f.category === cat).length;
                return (
                  <button
                    key={cat}
                    id={`folder-btn-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded text-left text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/30"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-400 dark:text-slate-550 shrink-0" />
                      )}
                      <span className="truncate max-w-[124px] lg:max-w-none">{cat}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                id="add-custom-folder-trigger"
                onClick={() => setShowAddFolderInput(!showAddFolderInput)}
                className="flex items-center gap-2 px-3 py-2 rounded text-left text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/55 dark:hover:bg-indigo-950/20 shrink-0 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>New Folder...</span>
              </button>
            </div>

            {/* Custom Category creation form */}
            {showAddFolderInput && (
              <form onSubmit={handleAddCustomFolder} className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-slate-50/50 dark:bg-slate-900/30 flex flex-col gap-2 mt-1 animate-fade-in">
                <input
                  id="new-folder-input-field"
                  type="text"
                  value={newFolderInput}
                  onChange={(e) => setNewFolderInput(e.target.value)}
                  placeholder="Folder Name... (e.g. Work)"
                  autoFocus
                  className="w-full text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAddFolderInput(false)}
                    className="text-[10px] font-sans font-medium text-slate-500 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-[10px] font-semibold bg-indigo-650 text-white px-3 py-1 rounded hover:bg-indigo-500 cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Panel: Cards Dashboard view */}
          <div className="space-y-4">
            {/* Search filter for bookmarked items */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="phrasebook-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phrasebook by keyword or language..."
                className="w-full text-sm rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-4 py-2 text-slate-800 dark:text-slate-150 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded text-slate-400 font-sans text-sm select-none">
                No matching phrases found in <strong>{selectedCategory}</strong> folder.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
                {filteredFavorites.map((item) => (
                  <div
                    key={item.id}
                    id={`bookmark-card-${item.id}`}
                    onClick={() => onLoadItem(item)}
                    title="Click card to load into translator"
                    className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded p-4.5 shadow-sm hover:border-slate-350 dark:hover:border-slate-700 hover:shadow transition-all cursor-pointer relative flex flex-col justify-between"
                  >
                    {/* Folder Shifter and Language Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400">
                          {item.sourceLang}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-teal-605 dark:text-teal-400">
                          {item.targetLang}
                        </span>
                      </div>

                      {/* Dropdown to shift folder context */}
                      <select
                        id={`shifter-dropdown-${item.id}`}
                        value={item.category || "General"}
                        onClick={(e) => e.stopPropagation()} // Prevent card load trigger
                        onChange={(e) => onUpdateCategory(item.id, e.target.value)}
                        className="text-[10px] sm:text-[11px] font-medium border border-slate-200 dark:border-slate-800 rounded bg-slate-50/50 dark:bg-slate-950 px-2 py-0.5 text-slate-600 dark:text-slate-300 cursor-pointer focus:outline-none"
                      >
                        {categories.filter(c => c !== "All").map((catName) => (
                          <option key={catName} value={catName}>
                            📁 {catName}
                          </option>
                        ))}
                        {!categories.includes("General") && (
                          <option value="General">📁 General</option>
                        )}
                      </select>
                    </div>

                    {/* Original & Translated Phrasing text fields */}
                    <div className="space-y-2 mb-4">
                      <div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-wider mb-0.5">Original</div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-sans">
                          {item.originalText}
                        </p>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-850/65 pt-2">
                        <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono uppercase font-bold tracking-wider mb-0.5">Translation</div>
                        <p className="text-sm font-semibold text-slate-850 dark:text-white line-clamp-2 leading-tight">
                          {item.translatedText}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row: Meta & quick active interactions */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2.5 mt-auto">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {formatDate(item.timestamp)}
                        </span>
                        {item.tone && item.tone !== "standard" && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400">
                            {item.tone}
                          </span>
                        )}
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleSpeak(item, e)}
                          title="Speak Translation"
                          className={`p-1.5 rounded border transition-all cursor-pointer ${
                            speakingId === item.id
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                              : "text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"
                          }`}
                        >
                          {speakingId === item.id ? (
                             <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => handleCopy(item, e)}
                          title="Copy Translation"
                          className="p-1.5 rounded border border-transparent text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFavorite(item.id);
                          }}
                          title="Remove from phrasebook"
                          className="p-1.5 rounded border border-transparent text-slate-450 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                        </button>

                        <button
                          onClick={() => onLoadItem(item)}
                          title="Load into translator"
                          className="p-1.5 rounded border border-transparent text-indigo-600 dark:text-indigo-455 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
