/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/layout/HeroSection";
import TranslationInput from "./components/ui/TranslationInput";
import TranslationOutput from "./components/ui/TranslationOutput";
import TranslationHistory from "./components/ui/TranslationHistory";
import Phrasebook from "./components/ui/Phrasebook";
import Notification from "./components/ui/Notification";
import ToneSelector from "./components/ui/ToneSelector";

import { storageService } from "./services/storageService";
import { translateService } from "./services/translateService";
import { TranslationHistoryItem, FavoritePhrase, Theme, AppNotification, LinguisticInsights } from "./types";
import { ArrowRightLeft } from "lucide-react";
import TranslationInsightsDrawer from "./components/ui/TranslationInsightsDrawer";

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("Auto-Detect");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [detectedSourceLanguage, setDetectedSourceLanguage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>("standard");
  
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoritePhrase[]>([]);
  const [notification, setNotification] = useState<AppNotification | null>(null);

  // Insights Drawer State
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [insightsData, setInsightsData] = useState<LinguisticInsights | null>(null);

  // Initialize Theme, History, and Favorites
  useEffect(() => {
    const activeTheme = storageService.getTheme();
    setTheme(activeTheme);
    storageService.setTheme(activeTheme);

    const savedHistory = storageService.getHistory();
    setHistory(savedHistory);

    const savedFavorites = storageService.getFavorites();
    setFavorites(savedFavorites);
  }, []);

  // Show App notification toast
  const triggerNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({
      id: crypto.randomUUID(),
      message,
      type,
    });
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    storageService.setTheme(nextTheme);
    triggerNotification(`Switched to ${nextTheme === "light" ? "Light" : "Dark"} mode`, "success");
  };

  // Run translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      triggerNotification("Please enter some text to translate", "error");
      return;
    }

    setIsLoading(true);
    setDetectedSourceLanguage(undefined);
    setInsightsData(null);
    setIsInsightsOpen(false);

    try {
      const result = await translateService.translate(inputText, sourceLang, targetLang, selectedTone);
      setTranslatedText(result.translatedText);
      
      if (sourceLang === "Auto-Detect" && result.detectedSourceLanguage) {
        setDetectedSourceLanguage(result.detectedSourceLanguage);
      }

      // Save to history list
      const actualSource = sourceLang === "Auto-Detect" 
        ? (result.detectedSourceLanguage || "English") 
        : sourceLang;

      const updatedHistory = storageService.saveHistory({
        originalText: inputText,
        translatedText: result.translatedText,
        sourceLang: actualSource,
        targetLang: targetLang,
        tone: selectedTone,
      });

      setHistory(updatedHistory);
      if (result.isLocalFallback) {
        triggerNotification("Gemini is under high traffic; activated offline/standby fallback.", "info");
      } else {
        triggerNotification("Translation completed!", "success");
      }
    } catch (error: any) {
      console.error(error);
      triggerNotification(error.message || "Failed to translate text. Try again.", "error");
      setTranslatedText("");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear translation states
  const handleClear = () => {
    setInputText("");
    setTranslatedText("");
    setDetectedSourceLanguage(undefined);
    setInsightsData(null);
    setIsInsightsOpen(false);
    triggerNotification("Input cleared", "info");
  };

  // Swap Languages + Texts (Reverse Translate)
  const handleSwapLanguages = () => {
    setInsightsData(null);
    setIsInsightsOpen(false);
    // If source selection is Auto-Detect, cannot easily invert without knowing detected source
    let finalSourceField = targetLang;
    let finalTargetField = sourceLang === "Auto-Detect" 
      ? (detectedSourceLanguage || "English") 
      : sourceLang;

    // We do not want to set source back to Auto-Detect on swap
    if (finalSourceField === "Auto-Detect") {
      finalSourceField = "English";
    }

    setSourceLang(finalSourceField);
    setTargetLang(finalTargetField);

    // Swap text inputs as well
    const prevInputText = inputText;
    const prevTranslatedText = translatedText;

    setInputText(prevTranslatedText);
    setTranslatedText(prevInputText);
    setDetectedSourceLanguage(undefined);

    triggerNotification("Languages swapped", "info");
  };

  // Download translated text as .txt file
  const handleDownloadTranslation = () => {
    if (!translatedText) return;
    try {
      const blob = new Blob([translatedText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `translation_${targetLang.toLowerCase().replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerNotification("Download started successfully", "success");
    } catch (e) {
      triggerNotification("Failed to download text", "error");
    }
  };

  // Load a translation item from history
  const handleLoadHistoryItem = (item: TranslationHistoryItem) => {
    setInputText(item.originalText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setDetectedSourceLanguage(undefined);
    if (item.tone) {
      setSelectedTone(item.tone);
    } else {
      setSelectedTone("standard");
    }
    triggerNotification("History translation loaded", "success");
    
    // Smooth scroll back to input area
    const element = document.getElementById("translation-playground-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Delete specific item from history
  const handleDeleteHistoryItem = (id: string) => {
    const updated = storageService.deleteHistoryItem(id);
    setHistory(updated);
    triggerNotification("Item removed from history", "success");
  };

  // Clear Entire History list
  const handleClearAllHistory = () => {
    storageService.clearHistory();
    setHistory([]);
    triggerNotification("All history cleared", "success");
  };

  // Favoriting and Smart Phrasebook logic
  const getActualSourceLang = () => {
    return sourceLang === "Auto-Detect" && detectedSourceLanguage ? detectedSourceLanguage : sourceLang;
  };

  const isCurrentTranslationBookmarked = () => {
    if (!translatedText.trim()) return false;
    const actualSource = getActualSourceLang();
    return favorites.some(
      (f) =>
        f.originalText.trim() === inputText.trim() &&
        f.translatedText.trim() === translatedText.trim() &&
        f.sourceLang === actualSource &&
        f.targetLang === targetLang
    );
  };

  const handleToggleBookmark = () => {
    if (!translatedText.trim()) return;
    const actualSource = getActualSourceLang();
    
    const existingIndex = favorites.findIndex(
      (f) =>
        f.originalText.trim() === inputText.trim() &&
        f.translatedText.trim() === translatedText.trim() &&
        f.sourceLang === actualSource &&
        f.targetLang === targetLang
    );

    if (existingIndex > -1) {
      const itemToDelete = favorites[existingIndex];
      const updated = storageService.deleteFavorite(itemToDelete.id);
      setFavorites(updated);
      triggerNotification("Removed from Phrasebook", "info");
    } else {
      const updated = storageService.saveFavorite({
        originalText: inputText,
        translatedText: translatedText,
        sourceLang: actualSource,
        targetLang: targetLang,
        category: "General",
        tone: selectedTone,
      });
      setFavorites(updated);
      triggerNotification("Saved to Phrasebook (General)", "success");
    }
  };

  const handleDeleteFavorite = (id: string) => {
    const updated = storageService.deleteFavorite(id);
    setFavorites(updated);
    triggerNotification("Removed from Phrasebook", "success");
  };

  const handleUpdateFavoriteCategory = (id: string, newCategory: string) => {
    const updated = storageService.updateFavoriteCategory(id, newCategory);
    setFavorites(updated);
    triggerNotification(`Moved to folder "${newCategory}"`, "success");
  };

  const handleClearAllFavorites = () => {
    storageService.clearFavorites();
    setFavorites([]);
    triggerNotification("Phrasebook cleared", "success");
  };

  const handleLoadFavoriteItem = (item: FavoritePhrase) => {
    setInputText(item.originalText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setDetectedSourceLanguage(undefined);
    if (item.tone) {
      setSelectedTone(item.tone);
    } else {
      setSelectedTone("standard");
    }
    triggerNotification("Phrase loaded from Phrasebook", "success");
    
    const element = document.getElementById("translation-playground-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFetchInsights = async () => {
    if (!translatedText.trim()) return;
    setIsInsightsOpen(true);
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const data = await translateService.getInsights(
        inputText,
        translatedText,
        getActualSourceLang(),
        targetLang,
        selectedTone
      );
      setInsightsData(data);
    } catch (err: any) {
      console.error("Error loaded translation insights:", err);
      setInsightsError(err.message || "Failed to load grammar & cultural insights. Please retry.");
    } finally {
      setInsightsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <main className="flex-1 w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 max-w-7xl">
        <HeroSection />

        {/* Tone Selector */}
        <ToneSelector selectedTone={selectedTone} onChangeTone={setSelectedTone} />

        {/* Translation Panels Grid */}
        <div
          id="translation-playground-grid"
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-6 mt-6 md:mt-8"
        >
          {/* Input Panel */}
          <TranslationInput
            text={inputText}
            onChangeText={setInputText}
            selectedLang={sourceLang}
            onChangeLang={setSourceLang}
            onClear={handleClear}
            onTranslate={handleTranslate}
            isLoading={isLoading}
            onSwapLanguages={handleSwapLanguages}
            isSwapEnabled={inputText.trim().length > 0 && translatedText.trim().length > 0}
          />

          {/* Desktop Swap Arrow Button */}
          <div className="hidden md:flex flex-col items-center justify-center p-2">
            <button
              id="swap-langs-btn-desktop"
              type="button"
              disabled={!inputText.trim() && !translatedText.trim()}
              onClick={handleSwapLanguages}
              title="Swap Languages & Texts"
              className="w-10 h-10 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 hover:border-indigo-400 cursor-pointer focus:outline-none"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Output Panel */}
          <TranslationOutput
            translatedText={translatedText}
            selectedLang={targetLang}
            onChangeLang={setTargetLang}
            isLoading={isLoading}
            detectedSourceLanguage={detectedSourceLanguage}
            onCopy={() => triggerNotification("Copied translation to clipboard!", "success")}
            onDownload={handleDownloadTranslation}
            isBookmarked={isCurrentTranslationBookmarked()}
            onToggleBookmark={handleToggleBookmark}
            onOpenInsights={handleFetchInsights}
          />
        </div>

        {/* Phrasebook Favorites Collection */}
        <Phrasebook
          favorites={favorites}
          onLoadItem={handleLoadFavoriteItem}
          onDeleteFavorite={handleDeleteFavorite}
          onUpdateCategory={handleUpdateFavoriteCategory}
          onClearFavorites={handleClearAllFavorites}
        />

        {/* Searchable Translation History */}
        <TranslationHistory
          history={history}
          onLoadItem={handleLoadHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
          onClearHistory={handleClearAllHistory}
        />
      </main>

      <Footer />

      {/* Grammar & Cultural Insights Drawer */}
      <TranslationInsightsDrawer
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        isLoading={insightsLoading}
        error={insightsError}
        insights={insightsData}
        originalText={inputText}
        translatedText={translatedText}
        sourceLang={getActualSourceLang()}
        targetLang={targetLang}
        tone={selectedTone}
        onRetry={handleFetchInsights}
      />

      {/* Toast notifications */}
      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
