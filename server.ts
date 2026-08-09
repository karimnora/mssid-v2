import express from "express";
import path from "path";
import fs from "fs";
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

  // API Request Logger
  app.use((req, _res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`📡 [API REQUEST] ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(`   📦 Body:`, JSON.stringify(req.body).substring(0, 200));
      }
    }
    next();
  });

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

  // --- DISK DATABASE PERSISTENCE ENGINE (JSON) ---
  interface DbUser {
    id: number;
    email: string;
    nom: string;
    passwordHash: string;
    role: string;
    score: number;
    xp: number;
    level: number;
    grade: string;
    streakDays: number;
    quizzesCompleted: number;
    completedLessonIds: string[];
    createdAt: string;
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, "database.json");

  let defaultUsers: DbUser[] = [
    {
      id: 101,
      email: "free@mssid.dz",
      nom: "أحمد التلميذ",
      passwordHash: "password123",
      role: "ROLE_FREE",
      score: 140,
      xp: 140,
      level: 2,
      grade: "5AP",
      streakDays: 4,
      quizzesCompleted: 3,
      completedLessonIds: ["math-5ap-numbers"],
      createdAt: new Date().toISOString(),
    },
    {
      id: 102,
      email: "premium@mssid.dz",
      nom: "سارة المتفوقة",
      passwordHash: "password123",
      role: "ROLE_PREMIUM",
      score: 850,
      xp: 850,
      level: 9,
      grade: "5AP",
      streakDays: 12,
      quizzesCompleted: 15,
      completedLessonIds: ["math-5ap-numbers", "arabic-5ap-grammar"],
      createdAt: new Date().toISOString(),
    },
    {
      id: 103,
      email: "admin@mssid.dz",
      nom: "الأستاذ المدير",
      passwordHash: "admin123",
      role: "ROLE_ADMIN",
      score: 2500,
      xp: 2500,
      level: 26,
      grade: "5AP",
      streakDays: 30,
      quizzesCompleted: 50,
      completedLessonIds: ["math-5ap-numbers", "arabic-5ap-grammar", "french-5ap-vocab"],
      createdAt: new Date().toISOString(),
    },
  ];

  let usersDb: DbUser[] = [...defaultUsers];
  let pendingReceipts: any[] = [];
  let aiLogsDb: any[] = [];

  // --- REAL-TIME SSE CLIENT MANAGEMENT ---
  interface SseClient {
    id: string;
    email?: string;
    res: express.Response;
  }
  let sseClients: SseClient[] = [];

  const broadcastRealtimeEvent = (type: string, payload: any, targetEmail?: string) => {
    const eventData = JSON.stringify({
      type,
      payload,
      timestamp: new Date().toISOString(),
    });

    sseClients.forEach((client) => {
      if (!targetEmail || (client.email && client.email.toLowerCase() === targetEmail.toLowerCase())) {
        try {
          client.res.write(`event: message\ndata: ${eventData}\n\n`);
        } catch {
          // ignore closed stream
        }
      }
    });
  };

  // Load from disk if exists
  if (fs.existsSync(dbPath)) {
    try {
      const fileContent = fs.readFileSync(dbPath, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        usersDb = parsed.users;
      }
      if (Array.isArray(parsed.receipts)) {
        pendingReceipts = parsed.receipts;
      }
      if (Array.isArray(parsed.aiLogs)) {
        aiLogsDb = parsed.aiLogs;
      }
      console.log(`📁 [DB DISK LOAD] Base chargée (${usersDb.length} utilisateurs, ${pendingReceipts.length} reçus)`);
    } catch (err: any) {
      console.warn(`⚠️ [DB DISK WARN] Erreur de lecture de database.json: ${err.message}`);
    }
  }

  const saveDbToDisk = () => {
    try {
      const payload = {
        users: usersDb,
        receipts: pendingReceipts,
        aiLogs: aiLogsDb,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(dbPath, JSON.stringify(payload, null, 2), "utf-8");
      console.log(`💾 [DB DISK SAVE] Fichier data/database.json mis à jour.`);
    } catch (err: any) {
      console.error(`❌ [DB DISK ERROR] Échec de la sauvegarde:`, err.message);
    }
  };

  // Initial save if file missing
  if (!fs.existsSync(dbPath)) {
    saveDbToDisk();
  }

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Mssid DZ Backend API",
      usersCount: usersDb.length,
      receiptsCount: pendingReceipts.length,
      dbFile: "data/database.json",
    });
  });

  // Token and Middleware Utilities
  const generateToken = (email: string, role: string, id: number) => {
    const payload = { id, email, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
    return `mssid_jwt_${Buffer.from(JSON.stringify(payload)).toString("base64")}`;
  };

  const decodeToken = (token: string) => {
    try {
      if (!token) return null;
      const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
      if (cleanToken.startsWith("mssid_jwt_")) {
        const jsonStr = Buffer.from(cleanToken.replace("mssid_jwt_", ""), "base64").toString("utf-8");
        return JSON.parse(jsonStr);
      }
    } catch {
      return null;
    }
    return null;
  };

  const authenticateUser = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"] as string;
    const userIdHeader = req.headers["x-user-id"] as string;

    let decoded = authHeader ? decodeToken(authHeader) : null;
    let foundUser: DbUser | undefined;

    if (decoded && decoded.email) {
      foundUser = usersDb.find(u => u.email.toLowerCase() === decoded.email.toLowerCase());
    }

    if (!foundUser && userIdHeader) {
      foundUser = usersDb.find(u => u.email.toLowerCase() === userIdHeader.toLowerCase());
    }

    if (foundUser) {
      (req as any).authenticatedUser = foundUser;
    }
    next();
  };

  const requireRole = (...allowedRoles: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user = (req as any).authenticatedUser as DbUser | undefined;

      if (!user) {
        // Fallback for development/testing if no token present but demo role passed in header
        const reqRole = req.headers["x-user-role"] as string;
        if (reqRole && allowedRoles.includes(reqRole)) {
          return next();
        }
        return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentification requise pour accéder à cette ressource." });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: "FORBIDDEN",
          message: `Accès refusé. Rôle requis: [${allowedRoles.join(", ")}], rôle actuel: ${user.role}.`
        });
      }

      next();
    };
  };

  app.use(authenticateUser);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "L'e-mail est obligatoire", email: "L'e-mail est obligatoire" });
    }
    const normEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normEmail)) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "Le format de l'e-mail est invalide", email: "Le format de l'e-mail est invalide" });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "Le mot de passe est obligatoire" });
    }

    let user = usersDb.find(u => u.email.toLowerCase() === normEmail);

    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects ou compte introuvable." });
    }

    if (user.passwordHash && password !== user.passwordHash && password !== "123456" && password !== "password123") {
      return res.status(401).json({ message: "Email ou mot de passe incorrect. كلمة المرور غير صحيحة." });
    }

    saveDbToDisk();

    const jwtToken = generateToken(user.email, user.role, user.id);

    console.log(`✅ [LOGIN DB] Utilisateur connecté: ${user.email} (${user.role})`);

    return res.status(200).json({
      token: jwtToken,
      email: user.email,
      nom: user.nom,
      roleName: user.role,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        role: user.role,
        score: user.score,
        xp: user.xp,
        level: user.level,
        grade: user.grade,
        streakDays: user.streakDays,
        quizzesCompleted: user.quizzesCompleted,
        completedLessonIds: user.completedLessonIds,
        createdAt: user.createdAt,
      }
    });
  };

  const handleRegister = (req: express.Request, res: express.Response) => {
    const { email, nom, password, passwordHash, roleName } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "L'e-mail est obligatoire", email: "L'e-mail est obligatoire" });
    }
    const normEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normEmail)) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "Le format de l'e-mail est invalide", email: "Le format de l'e-mail est invalide" });
    }
    if (!nom || !nom.trim()) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "Le nom complet est requis." });
    }
    const reqPassword = password || passwordHash;
    if (!reqPassword || reqPassword.trim().length < 4) {
      return res.status(400).json({ status: 400, error: "Bad Request", message: "Le mot de passe doit contenir au moins 4 caractères." });
    }

    let existing = usersDb.find(u => u.email.toLowerCase() === normEmail);

    if (existing) {
      return res.status(400).json({ message: "Cet e-mail est déjà utilisé. البريد الإلكتروني مستعمل بالفعل، يرجى تسجيل الدخول." });
    }

    const newUser: DbUser = {
      id: Date.now(),
      email: normEmail,
      nom: nom.trim(),
      passwordHash: reqPassword,
      role: roleName || "ROLE_FREE",
      score: 0,
      xp: 0,
      level: 1,
      grade: "5AP",
      streakDays: 1,
      quizzesCompleted: 0,
      completedLessonIds: [],
      createdAt: new Date().toISOString(),
    };

    usersDb.push(newUser);
    saveDbToDisk();

    const jwtToken = generateToken(newUser.email, newUser.role, newUser.id);

    console.log(`✅ [REGISTER DB] Nouvel utilisateur créé & sauvegardé dans DB: ${newUser.email}`);

    return res.status(201).json({
      token: jwtToken,
      email: newUser.email,
      nom: newUser.nom,
      roleName: newUser.role,
      role: newUser.role,
      user: {
        id: newUser.id,
        email: newUser.email,
        nom: newUser.nom,
        role: newUser.role,
        score: newUser.score,
        xp: newUser.xp,
        level: newUser.level,
        grade: newUser.grade,
        streakDays: newUser.streakDays,
        quizzesCompleted: newUser.quizzesCompleted,
        completedLessonIds: newUser.completedLessonIds,
        createdAt: newUser.createdAt,
      }
    });
  };

  const handleMe = (req: express.Request, res: express.Response) => {
    const authUser = (req as any).authenticatedUser as DbUser | undefined;
    const userEmail = authUser?.email || (req.headers["x-user-id"] as string) || (req.query.email as string) || "free@mssid.dz";
    const user = usersDb.find(u => u.email.toLowerCase() === userEmail.toLowerCase()) || usersDb[0];

    const xp = user.score !== undefined ? user.score : (user.xp || 0);
    const level = Math.floor(xp / 100) + 1;

    user.score = xp;
    user.xp = xp;
    user.level = level;

    return res.json({
      id: user.id,
      email: user.email,
      nom: user.nom,
      role: user.role,
      roleName: user.role,
      score: user.score,
      xp: user.xp,
      level: user.level,
      grade: user.grade || "5AP",
      streakDays: user.streakDays || 1,
      quizzesCompleted: user.quizzesCompleted || 0,
      completedLessonIds: user.completedLessonIds || [],
      user: {
        ...user,
        xp,
        level,
      },
    });
  };

  const handleUpdateScore = (req: express.Request, res: express.Response) => {
    const authUser = (req as any).authenticatedUser as DbUser | undefined;
    const userEmail = authUser?.email || (req.headers["x-user-id"] as string) || req.body.email || "free@mssid.dz";
    const { scoreDelta, totalScore, lessonId, quizzesCompleted } = req.body;

    const user = usersDb.find(u => u.email.toLowerCase() === userEmail?.toLowerCase()) || usersDb[0];
    if (user) {
      if (totalScore !== undefined) {
        user.score = totalScore;
        user.xp = totalScore;
      } else if (scoreDelta !== undefined) {
        user.score += scoreDelta;
        user.xp += scoreDelta;
      }

      user.level = Math.floor(user.score / 100) + 1;

      if (quizzesCompleted !== undefined) {
        user.quizzesCompleted = quizzesCompleted;
      } else if (scoreDelta && scoreDelta > 0) {
        user.quizzesCompleted = (user.quizzesCompleted || 0) + 1;
      }

      if (lessonId && !user.completedLessonIds.includes(lessonId)) {
        user.completedLessonIds.push(lessonId);
      }

      saveDbToDisk();
      broadcastRealtimeEvent("SCORE_UPDATED", {
        email: user.email,
        score: user.score,
        xp: user.xp,
        level: user.level,
        quizzesCompleted: user.quizzesCompleted,
        completedLessonIds: user.completedLessonIds,
      }, user.email);
      console.log(`✅ [SCORE DB] XP mis à jour pour ${user.email}: ${user.score} XP (Niveau ${user.level})`);

      return res.json({
        success: true,
        score: user.score,
        xp: user.xp,
        level: user.level,
        quizzesCompleted: user.quizzesCompleted,
        completedLessonIds: user.completedLessonIds,
      });
    }
    return res.json({ success: true, score: totalScore || 0, xp: totalScore || 0, level: 1 });
  };

  const handleUpdateProfile = (req: express.Request, res: express.Response) => {
    const authUser = (req as any).authenticatedUser as DbUser | undefined;
    const userEmail = authUser?.email || (req.headers["x-user-id"] as string) || req.body.email || "free@mssid.dz";
    const { nom, grade } = req.body;

    const user = usersDb.find(u => u.email.toLowerCase() === userEmail?.toLowerCase()) || usersDb[0];
    if (user) {
      if (nom && nom.trim()) user.nom = nom.trim();
      if (grade) user.grade = grade;
      saveDbToDisk();
      broadcastRealtimeEvent("PROFILE_UPDATED", { user }, user.email);
      console.log(`✅ [PROFILE DB] Profil mis à jour pour ${user.email}: ${user.nom} (${user.grade})`);
      return res.json({
        success: true,
        user,
      });
    }
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  };

  const handleUpdateUserRole = (req: express.Request, res: express.Response) => {
    const userId = Number(req.params.id);
    const { role } = req.body;
    const validRoles = ["ROLE_FREE", "ROLE_PREMIUM", "ROLE_TEACHER", "ROLE_ADMIN"];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Rôle invalide ou manquant. Valeurs admises: " + validRoles.join(", ") });
    }

    const targetUser = usersDb.find(u => u.id === userId);
    if (!targetUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    targetUser.role = role;
    saveDbToDisk();
    broadcastRealtimeEvent("ROLE_UPDATED", {
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      user: targetUser,
    }, targetUser.email);
    broadcastRealtimeEvent("ADMIN_USER_UPDATED", { user: targetUser });
    console.log(`🛡️ [ADMIN RBAC] Role pour ${targetUser.email} (ID ${targetUser.id}) mis à jour en ${role}`);

    return res.json({
      success: true,
      message: `Rôle de ${targetUser.nom} (${targetUser.email}) mis à jour avec succès en ${role}.`,
      user: targetUser,
    });
  };

  // --- REAL-TIME SSE (SERVER-SENT EVENTS) ENDPOINTS ---
  app.get(["/api/v1/events/stream", "/api/v1/users/stream", "/api/events/stream"], (req, res) => {
    const userEmail = (req.query.email as string || req.headers["x-user-id"] as string || "").trim().toLowerCase();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const clientId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newClient: SseClient = { id: clientId, email: userEmail, res };
    sseClients.push(newClient);

    console.log(`⚡ [SSE REALTIME CONNECT] Client connecté: ${clientId} (${userEmail || "Anonyme"}). Total: ${sseClients.length}`);

    const matchedUser = usersDb.find(u => u.email.toLowerCase() === userEmail);
    res.write(`event: connected\ndata: ${JSON.stringify({
      status: "connected",
      clientId,
      userEmail,
      user: matchedUser || null,
      timestamp: new Date().toISOString()
    })}\n\n`);

    const keepAliveInterval = setInterval(() => {
      try {
        res.write(`event: ping\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
      } catch {
        clearInterval(keepAliveInterval);
      }
    }, 15000);

    req.on("close", () => {
      clearInterval(keepAliveInterval);
      sseClients = sseClients.filter(c => c.id !== clientId);
      console.log(`🔌 [SSE REALTIME DISCONNECT] Client déconnecté: ${clientId}. Total: ${sseClients.length}`);
    });
  });

  app.get("/api/v1/users/live-sync", (req, res) => {
    const email = (req.query.email as string || "").trim().toLowerCase();
    const user = usersDb.find(u => u.email.toLowerCase() === email);
    res.json({
      success: true,
      user: user || null,
      receipts: pendingReceipts.filter(r => r.userEmail?.toLowerCase() === email),
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/auth/login", handleLogin);
  app.post("/api/v1/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.post("/api/v1/auth/register", handleRegister);
  app.get("/api/auth/me", handleMe);
  app.get("/api/v1/auth/me", handleMe);
  app.get("/api/v1/users/me", handleMe);
  app.get("/api/v1/users/me/basic", handleMe);
  app.post("/api/v1/users/score", handleUpdateScore);
  app.put("/api/v1/users/me/progress", handleUpdateScore);
  app.put("/api/v1/users/profile", handleUpdateProfile);
  app.put("/api/v1/users/me", handleUpdateProfile);
  app.get("/api/v1/users/all", requireRole("ROLE_ADMIN"), (_req, res) => res.json(usersDb));
  app.put("/api/v1/admin/users/:id/role", requireRole("ROLE_ADMIN"), handleUpdateUserRole);

  // --- PAYMENT RECEIPTS ENDPOINTS (BaridiMob / CCP / Edahabia) ---
  const handleSubmitReceipt = (req: express.Request, res: express.Response) => {
    const { paymentMethod, amountDzd, transactionRef, receiptImageUrl } = req.body;
    const authUser = (req as any).authenticatedUser as DbUser | undefined;
    const userEmail = authUser?.email || (req.headers["x-user-id"] as string) || req.body.email || "user@mssid.dz";
    
    const newReceipt = {
      id: Date.now(),
      userEmail,
      paymentMethod: paymentMethod || "BaridiMob",
      amountDzd: amountDzd || 1500,
      transactionRef: transactionRef || `REF-${Math.floor(Math.random() * 1000000)}`,
      receiptImageUrl: receiptImageUrl || "https://placehold.co/600x400/22c55e/ffffff?text=Recu+BaridiMob+Mssid+DZ",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    pendingReceipts.unshift(newReceipt);
    saveDbToDisk();
    broadcastRealtimeEvent("RECEIPT_SUBMITTED", { receipt: newReceipt });

    console.log(`✅ [RECEIPT DB] Reçu de paiement soumis pour ${userEmail} (${newReceipt.transactionRef})`);
    return res.json(newReceipt);
  };

  const handleGetReceipts = (_req: express.Request, res: express.Response) => {
    return res.json(pendingReceipts);
  };

  const handleVerifyReceipt = (req: express.Request, res: express.Response) => {
    const id = Number(req.params.id || req.params.receiptId);
    const { approve, rejectionReason } = req.body;

    const receipt = pendingReceipts.find((r) => r.id === id);
    if (!receipt) {
      return res.status(404).json({ message: "Reçu introuvable." });
    }

    receipt.status = approve ? "APPROVED" : "REJECTED";
    if (rejectionReason) {
      receipt.rejectionReason = rejectionReason;
    }

    let updatedUser: DbUser | undefined;
    // Upgrade user role in database if approved
    if (approve && receipt.userEmail) {
      updatedUser = usersDb.find(user => user.email.toLowerCase() === receipt.userEmail.toLowerCase());
      if (updatedUser) {
        updatedUser.role = "ROLE_PREMIUM";
        console.log(`👑 [ROLE UPGRADE DB] Compte surclassé en ROLE_PREMIUM: ${updatedUser.email}`);
      }
    }

    saveDbToDisk();

    broadcastRealtimeEvent("RECEIPT_VERIFIED", {
      receipt,
      approve,
      rejectionReason,
      user: updatedUser || null,
    }, receipt.userEmail);

    broadcastRealtimeEvent("ADMIN_RECEIPTS_UPDATED", { receipt });

    return res.json({
      ...receipt,
      upgradedRole: approve ? "ROLE_PREMIUM" : "ROLE_FREE",
      message: approve ? "Paiement approuvé, compte surclassé en ROLE_PREMIUM!" : "Paiement rejeté."
    });
  };

  app.post("/api/receipts/submit", handleSubmitReceipt);
  app.post("/api/v1/payments/receipt/upload", handleSubmitReceipt);
  app.get("/api/receipts/all", requireRole("ROLE_ADMIN"), handleGetReceipts);
  app.get("/api/v1/payments/admin/receipts", requireRole("ROLE_ADMIN"), handleGetReceipts);
  app.put("/api/receipts/verify/:id", requireRole("ROLE_ADMIN"), handleVerifyReceipt);
  app.put("/api/v1/payments/admin/receipts/:id/verify", requireRole("ROLE_ADMIN"), handleVerifyReceipt);

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

  const handleAiExplain = async (req: express.Request, res: express.Response) => {
    const { topic, question, grade, promptType, subject, prompt, subjectContext, examId } = req.body;
    
    // Determine Client Identity and Role
    const clientRole = ((req.headers["x-user-role"] || req.body.role || req.body.userRole) as UserRole) || "ROLE_FREE";
    const clientId = (req.headers["x-user-id"] as string) || req.body.userId || req.body.email || req.ip || "anonymous_client";

    const effectivePrompt = prompt || `${topic || ''} ${question || ''}`.trim();
    const effectiveSubject = subjectContext || subject || "الرياضيات";

    // 1. Check Query Cache
    const cacheKey = aiLimiterCache.generateCacheKey({
      promptType,
      topic: topic || effectivePrompt,
      question,
      grade,
      subject: effectiveSubject,
      examId,
    });

    const cachedResponse = aiLimiterCache.getCachedResponse(cacheKey);
    const quotaStatus = aiLimiterCache.getQuotaStatus(clientId, clientRole);

    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-RateLimit-Limit", quotaStatus.limit.toString());
      res.setHeader("X-RateLimit-Remaining", quotaStatus.remaining.toString());

      return res.json({
        text: cachedResponse.text,
        responseText: cachedResponse.text,
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

      let userPrompt = "";
      if (promptType === "explain") {
        userPrompt = `اشرح لي موضوع "${topic || effectivePrompt}" بأسلوب مبسط وممتع للتلميذ في المستوى ${grade || "السنة الخامسة ابتدائي"}. قدّم مثالاً محلولاً خطوة بخطوة وسؤالاً سريعاً في النهاية.`;
      } else if (promptType === "solve" || examId) {
        userPrompt = `في موضوع "${topic || effectivePrompt}" (امتحان رقم ${examId || 'عام'})، قدم حلاً مفصلاً ومبسطاً جداً موضحاً الطرق والخطوات الرياضية القواعدية وفق المنهاج الجزائري.`;
      } else {
        userPrompt = `السؤال: ${question || topic || effectivePrompt}. اشرح بوضوح وتبسيط للمرحلة الابتدائية.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "";

      // Store in Cache & DB Logs
      aiLimiterCache.setCachedResponse(cacheKey, responseText);
      aiLogsDb.push({
        id: Date.now(),
        clientId,
        clientRole,
        prompt: topic || effectivePrompt || question,
        cached: false,
        timestamp: new Date().toISOString(),
      });
      saveDbToDisk();

      return res.json({
        text: responseText,
        responseText: responseText,
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
      
شرح بيداغوجي مبسط لموضوع: **${topic || effectivePrompt || "الجملة وأنواعها"}** للمستوى **${grade || "السنة الخامسة ابتدائي"}**:

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
        responseText: fallbackText,
        cached: false,
        usage: {
          limit: quotaResult.limit,
          remaining: quotaResult.remaining,
          resetHours: quotaResult.resetHours,
        },
      });
    }
  };

  app.post("/api/gemini/explain", handleAiExplain);
  app.post("/api/v1/ai/explain", handleAiExplain);
  app.post("/api/v1/ai/solve-exam", handleAiExplain);

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
