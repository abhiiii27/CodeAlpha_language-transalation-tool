import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiApiKey } from "./src/serverEnv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());


// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = getGeminiApiKey();

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    ai = null;
  }
} else {
  console.warn(
    "GEMINI_API_KEY is missing (or set to a placeholder). Gemini translation is disabled and the app will use offline/mock fallbacks. " +
    "Create a .env.local file with GEMINI_API_KEY=your_key before running."
  );
}


// Deep locale dictionary mapping for common global translations representing graceful degradation
const COMMON_DICTIONARY: Record<string, Record<string, string>> = {
  "hello": {
    "English": "Hello",
    "Spanish": "Hola",
    "French": "Bonjour",
    "German": "Hallo",
    "Italian": "Ciao",
    "Portuguese": "Olá",
    "Russian": "Привет",
    "Japanese": "こんにちは",
    "Korean": "안녕하세요",
    "Chinese": "你好",
    "Arabic": "مرحباً",
    "Hindi": "नमस्ते"
  },
  "how are you": {
    "English": "How are you?",
    "Spanish": "¿Cómo estás?",
    "French": "Comment ça va?",
    "German": "Wie geht es dir?",
    "Italian": "Come stai?",
    "Portuguese": "Como você está?",
    "Russian": "Как дела?",
    "Japanese": "お元気ですか",
    "Korean": "어떻게 지내세요?",
    "Chinese": "你好吗？",
    "Arabic": "كيف حالك؟",
    "Hindi": "आप कैसे हैं?"
  },
  "thank you": {
    "English": "Thank you",
    "Spanish": "Gracias",
    "French": "Merci",
    "German": "Danke",
    "Italian": "Grazie",
    "Portuguese": "Obrigado",
    "Russian": "Спасибо",
    "Japanese": "ありがとう",
    "Korean": "감사합니다",
    "Chinese": "谢谢",
    "Arabic": "شكراً",
    "Hindi": "धन्यवाद"
  },
  "goodbye": {
    "English": "Goodbye",
    "Spanish": "Adiós",
    "French": "Au revoir",
    "German": "Auf Wiedersehen",
    "Italian": "Arrivederci",
    "Portuguese": "Adeus",
    "Russian": "До свидания",
    "Japanese": "さようなら",
    "Korean": "안녕히 가세요",
    "Chinese": "再见",
    "Arabic": "وداعاً",
    "Hindi": "अलविदा"
  },
  "welcome": {
    "English": "Welcome",
    "Spanish": "Bienvenido",
    "French": "Bienvenue",
    "German": "Willkommen",
    "Italian": "Benvenuto",
    "Portuguese": "Bem-vindo",
    "Russian": "Добро пожаловать",
    "Japanese": "ようこそ",
    "Korean": "환영합니다",
    "Chinese": "欢迎",
    "Arabic": "أهلاً بك",
    "Hindi": "स्वागत है"
  },
  "good morning": {
    "English": "Good morning",
    "Spanish": "Buenos días",
    "French": "Bonjour",
    "German": "Guten Morgen",
    "Italian": "Buongiorno",
    "Portuguese": "Bom dia",
    "Russian": "Доброе утро",
    "Japanese": "おはようございます",
    "Korean": "좋은 아침입니다",
    "Chinese": "早上好",
    "Arabic": "صباح الخير",
    "Hindi": "शुभ प्रभात"
  },
  "good night": {
    "English": "Good night",
    "Spanish": "Buenas noches",
    "French": "Bonne nuit",
    "German": "Gute Nacht",
    "Italian": "Buona notte",
    "Portuguese": "Boa noite",
    "Russian": "Спокойной ночи",
    "Japanese": "おやすみなさい",
    "Korean": "안녕히 주무세요",
    "Chinese": "晚安",
    "Arabic": "تصبح على خير",
    "Hindi": "शुभ रात्रि"
  },
  "i love you": {
    "English": "I love you",
    "Spanish": "Te amo",
    "French": "Je t'aime",
    "German": "Ich liebe dich",
    "Italian": "Ti amo",
    "Portuguese": "Eu te amo",
    "Russian": "Я люблю тебя",
    "Japanese": "愛しています",
    "Korean": "사랑해요",
    "Chinese": "我爱你",
    "Arabic": "أحبك",
    "Hindi": "मैं आपसे प्यार करता हूँ"
  },
  "please": {
    "English": "Please",
    "Spanish": "Por favor",
    "French": "S'il vous plaît",
    "German": "Bitte",
    "Italian": "Per favore",
    "Portuguese": "Por favor",
    "Russian": "Пожалуйста",
    "Japanese": "お願いします",
    "Korean": "부탁합니다",
    "Chinese": "请",
    "Arabic": "من فضلك",
    "Hindi": "कृपया"
  },
  "yes": {
    "English": "Yes",
    "Spanish": "Sí",
    "French": "Oui",
    "German": "Ja",
    "Italian": "Sì",
    "Portuguese": "Sim",
    "Russian": "Да",
    "Japanese": "はい",
    "Korean": "네",
    "Chinese": "是的",
    "Arabic": "نعم",
    "Hindi": "हाँ"
  },
  "no": {
    "English": "No",
    "Spanish": "No",
    "French": "Non",
    "German": "Nein",
    "Italian": "No",
    "Portuguese": "Não",
    "Russian": "Нет",
    "Japanese": "いいえ",
    "Korean": "아니요",
    "Chinese": "不",
    "Arabic": "لا",
    "Hindi": "नहीं"
  }
};

function findLocalTranslation(text: string, targetLangName: string): string | null {
  const normText = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

  for (const key of Object.keys(COMMON_DICTIONARY)) {
    const entry = COMMON_DICTIONARY[key];
    const matches = Object.entries(entry).some(([lang, val]) => {
      const normVal = val.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
      return normVal === normText;
    });

    if (matches) {
      return entry[targetLangName] || entry["English"] || null;
    }
  }
  return null;
}

// Helper function to handle transparent retries and model fallbacks during quota/availability spikes
async function handleGenerateContentWithFallback(
  aiClient: GoogleGenAI,
  requestParams: any,
  primaryModel: string = "gemini-3.5-flash",
  fallbackModel: string = "gemini-3.1-flash-lite"
): Promise<any> {
  const models = [primaryModel, fallbackModel, "gemini-flash-latest"];
  let lastError: any = null;

  for (const modelName of models) {
    let retries = 1; // Try up to 2 times total per model name (1 initial + 1 retry) to minimize latency
    let delay = 500;

    while (retries >= 0) {
      try {
        console.log(`Attempting generateContent with model: ${modelName} (${retries} retries left)...`);
        const response = await aiClient.models.generateContent({
          ...requestParams,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err.message || err);
        console.warn(`Error running model ${modelName}:`, errStr);

        // We retry if it's a 503, 429, temporary network issue, or high demand spike
        const isTemporary =
          errStr.includes("503") ||
          errStr.includes("429") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("locked") ||
          errStr.includes("ResourceExhausted") ||
          errStr.includes("overloaded");

        if (isTemporary && retries > 0) {
          console.log(`Temporary issue detected for model ${modelName}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
          retries--;
        } else {
          // If not temporary or no retries left, proceed to the next fallback model (or error out)
          console.log(`Moving past model ${modelName} due to persistent or non-recoverable error.`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with all available Models.");
}

// REST API Endpoints
app.post("/api/translate", async (req, res) => {
  const { text, sourceLang, targetLang, tone } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing required parameters: text or targetLang." });
  }

  // Fallback translating locally if no API key is set
  if (!ai) {
    console.warn("No Gemini API client, using mock translation service.");
    const toneText = tone ? ` [Tone: ${tone}]` : "";
    return res.json({
      translatedText: `[Mock Translation to ${targetLang}${toneText}]: "${text}" (Please configure GEMINI_API_KEY in Settings > Secrets for real translation)`,
      detectedSourceLanguage: sourceLang === "Auto-Detect" ? "English" : sourceLang
    });
  }

  try {
    let toneInstruction = "preserve the original text's mood and intent.";
    if (tone && tone !== "standard") {
      switch (tone) {
        case "formal":
          toneInstruction = "use a highly polite, polished, and formal business register appropriate for professional relations and native polite manners.";
          break;
        case "informal":
          toneInstruction = "use a cozy, friendly, relaxed, and casual conversational register appropriate for chatting with friends or loved ones.";
          break;
        case "slang":
          toneInstruction = "use extremely natural, localized slang and colloquialisms to sound like a local native speaker on the street.";
          break;
        case "creative":
          toneInstruction = "use literary, stylized, expressive, or poetic phrasing to maximize artistic flow, emotional depth, or vivid word choices.";
          break;
        default:
          break;
      }
    }

    const prompt = `Translate the following text to ${targetLang}. 
Source Language: ${sourceLang || "Auto-Detect"} (if 'Auto-Detect', analyze and determine the source language yourself).

Requested Translation Tone & Stylization:
You MUST translate the text such that you ${toneInstruction}

Text to translate:
"""
${text}
"""

Please translate accurately, adapting properly according to the tone instruction. Preserve formatting, newlines, and initial style as appropriate. Do not add any extra meta text, notes, or conversational explanations in your translated output. Your response must strictly follow the JSON schema provided.`;

    const response = await handleGenerateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: {
              type: Type.STRING,
              description: "The complete translated text."
            },
            detectedSourceLanguage: {
              type: Type.STRING,
              description: "The source language name detected (e.g., 'English', 'Spanish', 'French', etc.)."
            }
          },
          required: ["translatedText", "detectedSourceLanguage"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI engine");
    }

    const result = JSON.parse(responseText.trim());
    res.json({
      translatedText: result.translatedText,
      detectedSourceLanguage: result.detectedSourceLanguage || (sourceLang === "Auto-Detect" ? "English" : sourceLang)
    });
    } catch (error: any) {
        console.error("Translation API error:", error);

        const errStr = String(error.message || error);
        const isServiceUnavailable =
          errStr.includes("503") || // 503 or custom
          errStr.includes("429") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("ResourceExhausted") ||
          errStr.includes("overloaded");

        if (isServiceUnavailable) {
      const localTranslation = findLocalTranslation(text, targetLang);
      if (localTranslation) {
        console.log(`[Graceful Recovery] Translated "${text}" to "${targetLang}" locally using dictionary fallback.`);
        return res.json({
          translatedText: localTranslation,
          detectedSourceLanguage: sourceLang === "Auto-Detect" ? "English" : sourceLang,
          isLocalFallback: true,
        });
      }

      // Beautiful fallback explaining the temporary issue while preserving context
      const fallbackMsg = `[⚠️ Model High-Demand Fallback]

The Gemini AI model is currently experiencing high demand from global traffic.

While the service relaxes, here are your request details:
• Entered Text: "${text}"
• Detection Mode: ${sourceLang || "Auto-Detect"}
• Target Language: ${targetLang}

💡 Recommended Action:
Please wait 5-10 seconds and click the "Translate" button again. Demand spikes on public models are temporary and resolve very quickly!`;

      return res.json({
        translatedText: fallbackMsg,
        detectedSourceLanguage: sourceLang === "Auto-Detect" ? "English" : sourceLang,
        isLocalFallback: true,
      });
    }

    res.status(500).json({
      error: "Translation failed.",
      details: error.message || "Unknown error during AI generation."
    });
  }
});

app.post("/api/explain", async (req, res) => {
  const { text, translatedText, sourceLang, targetLang, tone } = req.body;

  if (!text || !translatedText || !targetLang) {
    return res.status(400).json({ error: "Missing required parameters: text, translatedText or targetLang." });
  }

  // Fallback if no Gemini client is initialized
  if (!ai) {
    return res.json({
      idioms: [
        {
          phrase: text.length > 20 ? text.slice(0, 20) + "..." : text,
          meaning: "Under offline/mock development mode.",
          context: "Please configure your GEMINI_API_KEY in Settings > Secrets to unlock genuine comparative analysis, cultural nuances, and context insights."
        }
      ],
      grammarDifferences: [
        {
          rule: "Translation Register Mode",
          explanation: `Linguistic analysis for translating from ${sourceLang === "Auto-Detect" ? "Detected Language" : sourceLang} to ${targetLang} in standard register.`,
          example: `Source phrase: "${text}" | Proposed outcome: "${translatedText}"`
        }
      ],
      alternativePhrases: [
        {
          phrase: "Alternate translation",
          register: "Neutral alternative",
          whyUseIt: "Useful benchmark for verification or formal letters."
        }
      ],
      culturalNuances: [
        {
          title: "Country Etiquette Tip",
          fact: "Custom context analysis requires the Gemini API. For production accounts, real-time cultural nuances details are fetched from global LLM contexts automatically!"
        }
      ]
    });
  }

  try {
    const prompt = `You are a professional, friendly, and bilingual linguist professor.
Your task is to analyze the following translation pair and provide a detailed grammatical, cultural, and idiomatic explanation to help the learner understand "Why" it was translated this way.

Source Language: ${sourceLang || "Auto-Detect"}
Target Language: ${targetLang}
Translation Tone Requested: ${tone || "Standard"}

Source Text:
"""
${text}
"""

Translated Text:
"""
${translatedText}
"""

Please analyze and generate:
1. "idioms": Any interesting idioms, expressions, metaphors, or wordplay occurring in either text, explaining their literal and figurative meanings. If none are present, pick an interesting word combination or cultural expression and analyze it instead.
2. "grammarDifferences": Highlight key grammar differences (e.g. word order, gendered agreement, honorific levels, prepositions, postpositions) between these two languages related directly/conceptually to this sentence.
3. "alternativePhrases": Supply 2 to 3 alternative ways to say this translation in ${targetLang} with different registers (e.g. Street Slang, Literary, Snappy shorthand, or Ultra Formal), specifying why and when the learner should use it.
4. "culturalNuances": Describe 1 to 2 fun cultural nuggets, conversational context markers, or etiquette details about using this phrase or related terms in countries where ${targetLang} is spoken natively.

Output your comparative analysis strictly adhering to the JSON schema specified.`;

    const response = await handleGenerateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idioms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  context: { type: Type.STRING }
                },
                required: ["phrase", "meaning", "context"]
              }
            },
            grammarDifferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rule: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  example: { type: Type.STRING }
                },
                required: ["rule", "explanation", "example"]
              }
            },
            alternativePhrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  register: { type: Type.STRING },
                  whyUseIt: { type: Type.STRING }
                },
                required: ["phrase", "register", "whyUseIt"]
              }
            },
            culturalNuances: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  fact: { type: Type.STRING }
                },
                required: ["title", "fact"]
              }
            }
          },
          required: ["idioms", "grammarDifferences", "alternativePhrases", "culturalNuances"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty details response from AI engine");
    }

    const result = JSON.parse(responseText.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Insights API error:", error);
    res.status(500).json({ error: "Failed to generate linguistic insights.", details: error.message });
  }
});

app.post("/api/detect", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing required parameter: text." });
  }

  if (!ai) {
    return res.json({ detectedSourceLanguage: "English" });
  }

  try {
    const prompt = `Identify the natural language of the following text:
"""
${text}
"""
Output ONLY the name of the language (e.g. "English", "French", "Japanese") as a simple text. Do not add punctuation or details.`;

    const response = await handleGenerateContentWithFallback(ai, {
      contents: prompt,
    });

    const detected = response.text ? response.text.trim() : "English";
    res.json({ detectedSourceLanguage: detected });
  } catch (error: any) {
    console.error("Language detection error:", error);
    res.status(500).json({ error: "Detection failed.", details: error.message });
  }
});

// Setup Vite Development Server or Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Language Translator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
