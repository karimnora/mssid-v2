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

  // GET Quota Status
  app.get("/api/gemini/quota", (req, res) => {
    const role = ((req.headers["x-user-role"] || req.query.role) as UserRole) || "ROLE_FREE";
    const clientId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || req.ip || "anonymous";
    const status = aiLimiterCache.getQuotaStatus(clientId, role);
    res.json({ role, clientId, ...status });
  });

  // AI Tutor Explain API (with Rate Limiting & Query Cache)
  app.post("/api/gemini/explain", async (req, res) => {
    const { topic, question, grade, promptType, subject } = req.body;
    
    // Determine Client Identity and Role
    const clientRole = ((req.headers["x-user-role"] || req.body.role || req.body.userRole) as UserRole) || "ROLE_FREE";
    const clientId = (req.headers["x-user-id"] as string) || req.body.userId || req.body.email || req.ip || "anonymous_client";

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

  // CMS AI Content Generation API
  app.post("/api/gemini/cms-generate", async (req, res) => {
    const { type, topic, grade, subject, difficulty } = req.body;

    const clientRole = ((req.headers["x-user-role"] || req.body.role || req.body.userRole) as UserRole) || "ROLE_TEACHER";
    const clientId = (req.headers["x-user-id"] as string) || req.body.userId || req.body.email || req.ip || "cms_teacher";

    // 1. Query Cache
    const cacheKey = aiLimiterCache.generateCacheKey({
      type,
      topic,
      grade,
      subject,
      question: difficulty,
    });

    const cachedResponse = aiLimiterCache.getCachedResponse(cacheKey);
    const quotaStatus = aiLimiterCache.getQuotaStatus(clientId, clientRole);

    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      return res.json({
        text: cachedResponse.text,
        cached: true,
        cacheHitsCount: cachedResponse.hits,
        usage: quotaStatus,
      });
    }

    // 2. Rate Limiting Quota
    const quotaResult = aiLimiterCache.checkAndConsumeQuota(clientId, clientRole);
    if (!quotaResult.allowed) {
      return res.status(429).json({
        error: "RATE_LIMIT_EXCEEDED",
        message: `تم الوصول للحد اليومي لإنشاء المحتوى بواسطة الذكاء الاصطناعي في CMS (${quotaResult.limit} طلب/يوم). يرجى المحاولة بعد ${quotaResult.resetHours} ساعة.`,
        limit: quotaResult.limit,
        remaining: 0,
        resetHours: quotaResult.resetHours,
      });
    }

    // 3. Call Gemini API
    try {
      const ai = getGenAI();

      const systemInstruction = `أنت مساعد خبير ومستشار بيداغوجي لتوليد المحتوى التعليمي الرسمي وفق المنهاج الوطني الجزائري لوزارة التربية الوطنية للمرحلة الابتدائية (1AP - 5AP).
قم بتوليد محتوى دقيق، خالي من الأخطاء اللغوية أو العلمية، باللغة العربية الفصحى.`;

      let prompt = "";
      if (type === "summary") {
        prompt = `قم بتوليد ملخص درس شامل لمادة ${subject || "اللغة العربية"} للمستوى ${grade || "5AP"} حول موضوع "${topic}".
استخرج 3 قواعد رئيسية، و2 صيغ/قوانين أو ضوابط، ومثالاً مع الحل وفق منهجية وزارة التربية الوطنية.`;
      } else if (type === "qcm") {
        prompt = `أنشئ 3 أسئلة اختيارات متعددة (QCM) لمادة ${subject || "اللغة العربية"} للمستوى ${grade || "5AP"} حول "${topic}" بدرجة صعوبة ${difficulty || "متوسطة"}.
لكل سؤال قدم 3 اختيارات، وحدد الخيار الصحيح مع تعليل بيداغوجي قصير.`;
      } else if (type === "math_problem") {
        prompt = `أنشئ وضعية إدماجية مستوحاة من البيئة الجزائرية اليومية للمستوى ${grade || "5AP"} حول موضوع "${topic}".
تتكون من نص المسألة، سؤالين متدرجين، والحل النموذجي مع سلم التنقيط (4 نقاط).`;
      } else if (type === "dictation") {
        prompt = `أكتب نص إملاء قصير (30 إلى 45 كلمة) مشكولاً شكلاً تاماً للمستوى ${grade || "5AP"} حول موضوع "${topic}".
حدد الكلمات التقييمية المستهدفة مع الأسئلة الإملائية المصاحبة.`;
      } else {
        prompt = `أنشئ بطاقة مراجعة سريعة وتمارين داعمة لموضوع "${topic}" للمستوى ${grade || "5AP"}.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const responseText = response.text || "";
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
      console.warn("Gemini CMS API Fallback Triggered:", error?.message || error);

      let fallbackText = "";
      const currentTopic = topic || "الجملة وأنواعها";
      const currentGrade = grade || "5AP";
      const currentSubject = subject || "اللغة العربية";

      if (type === "summary") {
        fallbackText = `📘 ملخص بيداغوجي رسمي: ${currentTopic}
المستوى التعليمي: ${currentGrade} | المادة: ${currentSubject}

📌 **أولاً: المفاهيم والقواعد الرئيسية:**
1. **القاعدة الأولى:** تعتبر وحدة (${currentTopic}) كفاءة أساسية موجهة لتلاميذ المرحلة الابتدائية (${currentGrade}).
2. **القاعدة الثانية:** تتكون الوحدة من عدة عناصر مترابطة تتطلب مراعاة الشروط النحوية/الرياضية المنظمة.
3. **القاعدة الثالثة:** الحرص على سلامة الصيغ والتعبير الفصيح الخالي من الأخطاء أثناء التطبيق.

💡 **ثانياً: مثال تطبيقي محلول:**
• **السؤال:** طبّق القواعد المدروسة على الحالة النموذجية التالية في موضوع (${currentTopic}).
• **الحل النموذجي:** نتبع المنهجية الرسمية (التحليل ➔ تحديد الكفاءة ➔ صياغة النتيجة المبررة).

📝 **ملاحظة وتوجيهات للمعلم:**
ينصح بالتركيز على الأمثلة المستمدة من البيئة المدرسية الجزائرية لتعزيز الفهم والاستيعاب لدى التلاميذ.`;
      } else {
        fallbackText = `📋 بطاقة مراجعة وتثبيت بيداغوجية: ${currentTopic}
المستوى: ${currentGrade} | المادة: ${currentSubject}

🌟 **أهم النقاط المحورية:**
- استحضار القواعد الأساسية والتعاريف لـ (${currentTopic}).
- التمرن المستمر على حل التمارين الموجهة بخط واضح وإجابات سريعة.`;
      }

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
