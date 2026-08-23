import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { aiLimiterCache, UserRole } from "./src/server/aiLimiterCache";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazy/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Mssid DZ API" });
  });

  // GET Rate Limiter & Cache Stats
  app.get("/api/gemini/stats", (_req, res) => {
    res.json(aiLimiterCache.getStatsSummary());
  });

  // SEC-10 (this dev-only Express server has no auth/session of its own — unlike the real Spring
  // Boot backend, which verifies role from the HttpOnly JWT cookie server-side, see
  // springBootApi.ts). It must never trust a client-supplied role or identity: doing so let anyone,
  // including a logged-out visitor, claim `role: "ROLE_ADMIN"` and unlock the 1000/day quota,
  // completely bypassing the free tier — and every accepted request bills the real Gemini API key.
  // Not reachable in production (vercel.json serves only the static build, this server never runs
  // there), but it's still live for anyone running `npm run dev`/`npm start` locally, so it gets the
  // same no-client-trust rule as the real backend rather than staying a dormant footgun.
  const CLIENT_ROLE: UserRole = "ROLE_FREE";

  // GET Quota Status
  app.get("/api/gemini/quota", (req, res) => {
    const clientId = req.ip || "anonymous";
    const status = aiLimiterCache.getQuotaStatus(clientId, CLIENT_ROLE);
    res.json({ role: CLIENT_ROLE, clientId, ...status });
  });

  // AI Tutor Explain API (with Rate Limiting & Query Cache)
  app.post("/api/gemini/explain", async (req, res) => {
    const { topic, question, grade, promptType, subject } = req.body;

    // Determine Client Identity and Role
    const clientRole = CLIENT_ROLE;
    const clientId = req.ip || "anonymous_client";

    // 1. Check Query Cache
    const cacheKey = aiLimiterCache.generateCacheKey({
      promptType,
      topic,
      question,
      grade,
      subject,
    });

    const cachedResponse = aiLimiterCache.getCachedResponse(cacheKey);
    const quotaStatus = aiLimiterCache.getQuotaStatus(clientId, clientRole);

    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-RateLimit-Limit", quotaStatus.limit.toString());
      res.setHeader("X-RateLimit-Remaining", quotaStatus.remaining.toString());

      return res.json({
        text: cachedResponse.text,
        cached: true,
        cacheHitsCount: cachedResponse.hits,
        usage: quotaStatus,
      });
    }

    // 2. Check and Consume Rate Limit Quota
    const quotaResult = aiLimiterCache.checkAndConsumeQuota(clientId, clientRole);
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-RateLimit-Limit", quotaResult.limit.toString());
    res.setHeader("X-RateLimit-Remaining", quotaResult.remaining.toString());

    if (!quotaResult.allowed) {
      return res.status(429).json({
        error: "RATE_LIMIT_EXCEEDED",
        message: `لقد تجاوزت الحد اليومي المسموح به لأسئلة المعلم مَسيد (${quotaResult.limit} سؤالاً/يوم لدور ${clientRole}). يرجى الانتظار ${quotaResult.resetHours} ساعة لتجديد الرصيد أو الترقية للحساب المميز Premium.`,
        messageFr: `Limite quotidienne atteinte (${quotaResult.limit} requêtes/jour pour le rôle ${clientRole}). Veuillez patienter ${quotaResult.resetHours}h.`,
        limit: quotaResult.limit,
        remaining: 0,
        resetHours: quotaResult.resetHours,
        userRole: clientRole,
      });
    }

    // 3. Call Gemini API
    try {
      const ai = getGenAI();

      const systemInstruction = `أنت "المعلّم مَسيد" (المعلم الذكي)، أستاذ افتراضي خبير ومحبوب لمادة الرياضيات واللغة العربية للتعليم الابتدائي في الجزائر (من السنة الأولى إلى السنة الخامسة ابتدائي).
شخصيتك: مشجعة، دافئة، بسيطة، وتستخدم أمثلة من البيئة الجزائرية والمنهج الدراسي الجزائري (وزارة التربية الوطنية).
تحدث باللغة العربية الفصحى الميسرة المناسبة للأطفال بعمر 6 إلى 11 سنة.
تجنب التعقيد، واشرح الخطوات خطوة بخطوة مع تنسيق واضحة ورسائل تحفيزية.`;

      let prompt = "";
      if (promptType === "explain") {
        prompt = `اشرح لي موضوع "${topic}" بأسلوب مبسط وممتع للتلميذ في المستوى ${grade || "السنة الخامسة ابتدائي"}. قدّم مثالاً محلولاً خطوة بخطوة وسؤالاً سريعاً في النهاية.`;
      } else if (promptType === "solve") {
        prompt = `في موضوع "${topic}"، التلميذ يسأل: "${question}".
قدم حلاً مفصلاً ومبسطاً جداً موضحاً الطرق والخطوات الرياضية القواعدية وفق المنهاج الجزائري.`;
      } else if (promptType === "generate") {
        prompt = `ولد مسألة رياضية أو تمرين لغة عربية جديد ومبتكر مستوحى من الحياة اليومية في الجزائر للمستوى ${grade || "السنة الخامسة ابتدائي"} حول موضوع "${topic}". قدم المسألة أولاً، ثم الحل النموذجي المفصل بشكل مخفي أو مفصل.`;
      } else {
        prompt = `السؤال: ${question || topic}. اشرح بوضوح وتبسيط للمرحلة الابتدائية.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "";

      // Store in Cache
      aiLimiterCache.setCachedResponse(cacheKey, responseText);

      return res.json({
        text: responseText,
        cached: false,
        usage: {
          limit: quotaResult.limit,
          remaining: quotaResult.remaining,
          resetHours: quotaResult.resetHours,
        },
      });
    } catch (error: any) {
      console.warn("Gemini Explain API Fallback Triggered:", error?.message || error);
      
      const fallbackText = `مرحباً بك يا بطل! أنا المعلم مَسيد 👋
      
شرح بيداغوجي مبسط لموضوع: **${topic || "الجملة وأنواعها"}** للمستوى **${grade || "السنة الخامسة ابتدائي"}**:

📌 **المفهوم الأساسي:**
الموضوع الذي تسأل عنه يعتبر كفاءة هامة جداً في منهاج التعليم الابتدائي بالجزائر.

💡 **خطوات الفهم والمراجعة:**
1. **التعريف بالقاعدة:** فهم المعنى الأساسي والشروط القواعدية أو العملية.
2. **التطبيق المباشر:** الممارسة اليومية لحل التمارين والتطبيقات السريعة.
3. **التأكد من النتيجة:** مراجعة الخطوات بتمعن قبل اعتماد الإجابة.

📝 **تمرين سريع للتحقق:**
حاول تطبيق هذه القاعدة الآن، وركز جيداً أثناء الإجابة! أسلوبك رائع وستنجح دائماً بإذن الله! 🌟`;

      // Cache fallback response as well
      aiLimiterCache.setCachedResponse(cacheKey, fallbackText);

      return res.json({
        text: fallbackText,
        cached: false,
        usage: {
          limit: quotaResult.limit,
          remaining: quotaResult.remaining,
          resetHours: quotaResult.resetHours,
        },
      });
    }
  });

  // Vite Middleware for development vs Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Mssid DZ running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
