import { useState } from "react";
import { Search, History, Trash2, Calendar, FileText, ChevronRight } from "lucide-react";
import { TranslationHistoryItem } from "../../types";

interface TranslationHistoryProps {
  history: TranslationHistoryItem[];
  onLoadItem: (item: TranslationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export default function TranslationHistory({
  history,
  onLoadItem,
  onDeleteItem,
  onClearHistory,
}: TranslationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = history.filter(
    (item) =>
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceLang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetLang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="history-section-panel" className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5 select-none">
          <History className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
          <h2 className="text-sm font-sans font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Translation Stream Log
          </h2>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {history.length} Done
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <span className="text-xs text-rose-500 font-bold font-sans">Are you sure?</span>
                <button
                  id="confirm-clear-history-btn"
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="text-[10px] font-mono font-bold bg-rose-500 text-white hover:bg-rose-600 px-2 py-1 rounded cursor-pointer uppercase tracking-wider shadow-sm transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  id="cancel-clear-history-btn"
                  onClick={() => setConfirmClear(false)}
                  className="text-[10px] font-sans font-medium text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="clear-all-history-btn"
                onClick={() => setConfirmClear(true)}
                className="text-xs font-mono font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Stream History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded text-slate-400 text-center select-none">
          <History className="w-8 h-8 text-slate-200 dark:text-slate-800 mb-2" />
          <p className="text-sm font-bold">Your translation log is empty.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Translate expression items and they will automatically log here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history entries by language or text..."
              className="w-full text-sm rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-4 py-2 text-slate-850 dark:text-slate-150 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-550"
            />
          </div>

          {/* List of elements */}
          {filteredHistory.length === 0 ? (
            <div className="text-center p-6 text-sm text-slate-400 font-sans">
              No matching records found for "{searchQuery}".
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  id={`history-row-${item.id}`}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header: Langs + Time */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold select-none">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                        {item.sourceLang}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-teal-605 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/45 px-2 py-0.5 rounded">
                        {item.targetLang}
                      </span>
                      <span className="inline-block w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-1"></span>
                      <span className="text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                      {item.tone && item.tone !== "standard" && (
                        <>
                          <span className="inline-block w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-1"></span>
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100/20">
                            {item.tone}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Texts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-2 py-1 bg-slate-50/50 dark:bg-slate-950/30 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 mb-0.5 select-none">Source</div>
                        <div className="text-slate-700 dark:text-slate-300 font-sans truncate" title={item.originalText}>
                          {item.originalText}
                        </div>
                      </div>
                      <div className="p-2 py-1 bg-indigo-50/10 dark:bg-indigo-950/10 rounded border border-indigo-100/10 dark:border-indigo-950/20">
                        <div className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 mb-0.5 select-none">Translation</div>
                        <div className="text-indigo-900 dark:text-slate-100 font-semibold truncate" title={item.translatedText}>
                          {item.translatedText}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center pr-1">
                    <button
                      id={`load-history-item-${item.id}`}
                      type="button"
                      onClick={() => onLoadItem(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold select-none cursor-pointer border border-transparent hover:border-indigo-600"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Load</span>
                    </button>
                    <button
                      id={`delete-history-item-${item.id}`}
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      title="Delete item"
                      className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
