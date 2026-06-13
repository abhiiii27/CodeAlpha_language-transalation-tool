import { TranslationHistoryItem, Theme, FavoritePhrase } from "../types";

const HISTORY_KEY = "ai_translation_history";
const THEME_KEY = "ai_translation_theme";
const FAVORITES_KEY = "ai_translation_favorites";
const MAX_HISTORY_STEPS = 50;

export const storageService = {
  // Theme state
  getTheme(): Theme {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return "light";
  },

  setTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
    // Apply class to draft document elements
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  },

  // History state
  getHistory(): TranslationHistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse translation history:", e);
      return [];
    }
  },

  saveHistory(item: Omit<TranslationHistoryItem, "id" | "timestamp">): TranslationHistoryItem[] {
    const history = this.getHistory();
    const newItem: TranslationHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // Prevent duplicates if exact match of text and languages exists
    const filtered = history.filter(
      (h) =>
        !(
          h.originalText.trim() === item.originalText.trim() &&
          h.sourceLang === item.sourceLang &&
          h.targetLang === item.targetLang
        )
    );

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_STEPS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteHistoryItem(id: string): TranslationHistoryItem[] {
    const history = this.getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  },

  // Favorites state
  getFavorites(): FavoritePhrase[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse translation favorites:", e);
      return [];
    }
  },

  saveFavorite(item: Omit<FavoritePhrase, "id" | "timestamp"> & { id?: string }): FavoritePhrase[] {
    const favorites = this.getFavorites();
    const isEditing = !!item.id;
    const finalId = item.id || crypto.randomUUID();
    
    const newItem: FavoritePhrase = {
      ...item,
      id: finalId,
      timestamp: new Date().toISOString(),
      category: item.category || "General",
    };

    let updated: FavoritePhrase[];
    if (isEditing) {
      updated = favorites.map((f) => (f.id === finalId ? newItem : f));
    } else {
      // Prevent exact duplicates of original & target text in same languages
      const filtered = favorites.filter(
        (f) =>
          !(
            f.originalText.trim() === item.originalText.trim() &&
            f.sourceLang === item.sourceLang &&
            f.targetLang === item.targetLang &&
            f.category === (item.category || "General")
          )
      );
      updated = [newItem, ...filtered];
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteFavorite(id: string): FavoritePhrase[] {
    const favorites = this.getFavorites();
    const updated = favorites.filter((item) => item.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  },

  updateFavoriteCategory(id: string, newCategory: string): FavoritePhrase[] {
    const favorites = this.getFavorites();
    const updated = favorites.map((item) => {
      if (item.id === id) {
        return { ...item, category: newCategory || "General" };
      }
      return item;
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  },

  clearFavorites(): void {
    localStorage.removeItem(FAVORITES_KEY);
  },
};
