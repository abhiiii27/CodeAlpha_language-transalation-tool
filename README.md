# LingoAI Translator 🌐

Translate text instantly with tone control, offline-friendly fallbacks, and learning-focused linguistic insights.

---

## 1) Project Overview 🧠
LingoAI Translator is a web application that helps users translate text between multiple languages while preserving the original intent. It also provides structured linguistic and cultural explanations for the generated translation.

### What problem it solves
- Removes friction in everyday translation workflows (input → translate → act on the result).
- Supports different communication styles (tone) for more natural outcomes.
- Helps users understand *why* a translation happened via grammar/idiom breakdowns.
- Keeps a local translation history and a reusable phrasebook for frequent expressions.

### Target users & use cases
- **Students & language learners**: understand grammar changes and idioms.
- **Travelers**: quickly translate phrases and hear the result aloud.
- **Professionals**: generate more formal or professional phrasing.
- **Casual communicators**: produce informal, friendly translations.

---

## 2) Key Features ✨
- **Multi-language translation** with selectable source/target languages.
- **Auto-Detect** source language option.
- **Tone & register control** (standard, formal, informal, slang/idiomatic, creative).
- **Swap languages & texts** to reverse-translate.
- **Translation history** (saved locally): search, load, delete, clear.
- **Phrasebook / favorites** with **custom folders** (saved locally): search, load, delete, move between categories, clear.
- **Text-to-speech** for translated output.
- **Speech-to-text** for entering source text (browser support required).
- **Copy** translation to clipboard.
- **Download** translation as a `.txt` file.
- **Linguistic & Cultural Insights** drawer using a structured JSON response.

---

## 3) Tech Stack 🧰
- **Frontend:**
  - React 19 + TypeScript
  - Tailwind CSS (via `@tailwindcss/vite`)
  - lucide-react (icons)
  - motion/react (drawer animations)
- **Backend (Node.js/Express):**
  - Express
  - dotenv (environment variables)
  - `@google/genai` (Gemini API client)
- **APIs / external services integrated:**
  - Gemini API through `@google/genai`
- **Development tools:**
  - Vite (dev + build)
  - esbuild (bundling server into `dist/server.cjs`)
  - tsx (running `server.ts` in dev)

---

## 4) Project Structure 📁
```text
.
├─ index.html
├─ server.ts
├─ vite.config.ts
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ types.ts
│  ├─ index.css
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Header.tsx
│  │  │  └─ Footer.tsx
│  │  └─ ui/
│  │     ├─ TranslationInput.tsx
│  │     ├─ TranslationOutput.tsx
│  │     ├─ TranslationHistory.tsx
│  │     ├─ Phrasebook.tsx
│  │     ├─ ToneSelector.tsx
│  │     ├─ ThemeToggle.tsx
│  │     ├─ TranslationInsightsDrawer.tsx
│  │     └─ Notification.tsx
│  └─ services/
│     ├─ translateService.ts
│     └─ storageService.ts
└─ assets/
```

### Key files
- **`server.ts`**: Express API endpoints (`/api/translate`, `/api/explain`, `/api/detect`) and Vite middleware/static serving.
- **`src/App.tsx`**: Main UI logic (translation flow, swap, history, phrasebook, insights drawer).
- **`src/services/translateService.ts`**: Client calls to the backend endpoints.
- **`src/services/storageService.ts`**: LocalStorage-backed theme, history, and favorites management.

---

## 5) Installation and Setup 🛠️
### Prerequisites
- Node.js

### Steps
1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables
- Create a file named **`.env.local`** in the project root.
- Add your Gemini API key:
```bash
GEMINI_API_KEY=your_gemini_api_key
```

> If `GEMINI_API_KEY` is not set (or is a placeholder), the app still runs, but translation/insight responses fall back to offline mock behavior / local dictionary fallback.

4. Run the project locally:
```bash
npm run dev
```

### Build & start (production mode)
```bash
npm run build
npm run start
```

---

## 6) Usage Guide 🎯
1. **Enter text**
   - Type/paste into the input textarea, or
   - Upload a `.txt` file, or
   - Use the microphone button (speech-to-text, browser-dependent).

2. **Choose languages**
   - Set **Source Language** (optionally **Auto-Detect**)
   - Set **Target Language**

3. **Pick a tone**
   - Select one of the tone options: Standard / Formal / Informal / Slang / Creative.

4. **Translate**
   - Click **Translate Now**.
   - The output panel updates with:
     - translated text
     - detected source language (when Auto-Detect is enabled)

5. **Act on the translation**
   - **Speak** the translation aloud
   - **Copy** to clipboard
   - **Download** as `.txt`
   - **Save** to the **Phrasebook** (star button)

6. **Get Linguistic Insights**
   - Click **Linguistic Insights** in the output panel footer.
   - A drawer opens showing:
     - comparative grammar differences
     - idioms/key phrasings
     - alternative registers
     - cultural etiquette/context nuggets

7. **Use History & Phrasebook**
   - **History Stream Log**: search by text/language, load items back into the translator, delete individual entries, or clear all.
   - **Phrasebook**: filter by folder/category, move items between categories, load phrases, or clear favorites.



---

## 7) Challenges and Learnings 🧩
- Implemented **structured JSON parsing** for insights responses and ensured the UI can render consistent data categories.
- Built **graceful degradation** paths for missing/failed API availability (offline/mock + local dictionary fallback).
- Fixed error handling in API unavailability detection (corrected status code check from 553 to 503).
- Managed multiple client-side features with **localStorage** persistence (theme, translation history, favorites/phrasebook).
- Integrated **browser speech APIs** (Speech-to-Text and Speech Synthesis) with safe cleanup on unmount.

---

## 8) Future Enhancements 🚀
- Add **export/import** for history and phrasebook (e.g., JSON/CSV) to move data between devices.
- Expand the local dictionary fallback beyond the current hardcoded phrases for improved offline usefulness.
- Improve performance and UX for large histories/favorites (virtualized lists, pagination).
- Add per-item editing for phrasebook entries (store user notes alongside phrases).

---

## 9) Contributing Guidelines 🤝
Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-change`
3. Commit your changes.
4. Open a pull request describing:
   - what you changed
   - why it improves the project
   - how to test it locally

---

## 10) License 📄
License information is not present as a standalone `LICENSE` file in the repository root.

**Please add a `LICENSE` file to clarify the open-source license** (or update this section accordingly).

---

## 11) Author 👤
- **Abhishek Buran**
- GitHub: https://github.com/abhiiii27

