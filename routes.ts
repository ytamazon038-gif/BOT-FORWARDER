import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import session from "express-session";
import memorystore from "memorystore";
import { loginSchema, registerSchema, startBotSchema, forgotPasswordSchema, resetPasswordSchema, deleteOtpRequestSchema, deleteOtpVerifySchema, ADMIN_EMAIL, botCustomizationSchema } from "@shared/schema";
import { storage } from "./storage";
import { startBot, stopBot, deleteBot, getUserBots, getAllBots, getBotById, getRunningBotCount } from "./botManager";
import { createOtp, verifyOtp, sendOtpViaTelegram } from "./otp";

const MemoryStore = memorystore(session);

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "telegram-bot-service-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86400000 }),
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { email, password } = parsed.data;

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const user = await storage.createUser(email, password);
      req.session.userId = user.id;

      return res.json({ id: user.id, email: user.email });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { email, password } = parsed.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const valid = await storage.verifyPassword(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      return res.json({ id: user.id, email: user.email });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const parsed = forgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { email } = parsed.data;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ message: "If an account exists with this email, an OTP has been sent to your Telegram." });
      }

      const botConfigs = await storage.getBotConfigsByUser(user.id);
      if (botConfigs.length === 0) {
        return res.json({ message: "If an account exists with this email, an OTP has been sent to your Telegram." });
      }

      const config = botConfigs[0];
      const otp = createOtp("password_reset", email);
      const sent = await sendOtpViaTelegram(config.botToken, config.ownerId, otp, "Password Reset");

      if (!sent) {
        return res.status(500).json({ message: "Failed to send OTP. Make sure you have started a bot and it can message you on Telegram." });
      }

      return res.json({ message: "OTP sent to your Telegram. Check your private messages from the bot.", sent: true });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const parsed = resetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { email, otp, newPassword } = parsed.data;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or OTP" });
      }

      const valid = verifyOtp("password_reset", email, otp);
      if (!valid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await storage.updatePassword(user.id, newPassword);
      return res.json({ message: "Password reset successfully" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.json({ id: user.id, email: user.email });
  });

  app.post("/api/bots/start", requireAuth, async (req, res) => {
    try {
      const parsed = startBotSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { botToken, groupId, ownerId, welcomeMessage, customization } = parsed.data;
      const userId = req.session.userId!;

      const runningCount = getRunningBotCount(userId);
      if (runningCount >= 2) {
        return res.status(400).json({ message: "You can only run up to 2 bots at a time" });
      }

      const instance = await startBot(botToken, groupId, ownerId, userId, welcomeMessage, customization);

      return res.json({
        action: "start",
        id: instance.id,
        botUsername: instance.botUsername,
        status: instance.status,
        startedAt: instance.startedAt,
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/bots/restart/:id", requireAuth, async (req, res) => {
    try {
      const botId = req.params.id as string;
      const config = await storage.getBotConfigById(botId);
      if (!config) {
        return res.status(404).json({ message: "Bot not found" });
      }

      const user = await storage.getUserById(req.session.userId!);
      const isAdmin = user?.email === ADMIN_EMAIL;

      if (config.userId !== req.session.userId && !isAdmin) {
        return res.status(403).json({ message: "Not your bot" });
      }

      const runningCount = getRunningBotCount(config.userId);
      if (runningCount >= 2) {
        return res.status(400).json({ message: "Already running 2 bots. Stop one first." });
      }

      const customization = botCustomizationSchema.parse(config.customization || {});
      const instance = await startBot(
        config.botToken,
        config.groupId,
        config.ownerId,
        config.userId,
        config.welcomeMessage,
        customization,
        config.id
      );

      return res.json({
        action: "restart",
        id: instance.id,
        botUsername: instance.botUsername,
        status: instance.status,
        startedAt: instance.startedAt,
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/bots/stop/:id", requireAuth, async (req, res) => {
    try {
      const botId = req.params.id as string;
      const botState = getBotById(botId);
      if (!botState) {
        return res.status(404).json({ message: "Bot is not running" });
      }

      const user = await storage.getUserById(req.session.userId!);
      const isAdmin = user?.email === ADMIN_EMAIL;

      if (botState.instance.userId !== req.session.userId && !isAdmin) {
        return res.status(403).json({ message: "Not your bot" });
      }

      const stopped = await stopBot(botId);
      if (!stopped) {
        return res.status(404).json({ message: "Bot not found" });
      }

      return res.json({ action: "stop", message: "Bot stopped" });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/bots/request-delete-otp/:id", requireAuth, async (req, res) => {
    try {
      const botId = req.params.id as string;
      const config = await storage.getBotConfigById(botId);
      if (!config) {
        return res.status(404).json({ message: "Bot not found" });
      }

      const user = await storage.getUserById(req.session.userId!);
      const isAdmin = user?.email === ADMIN_EMAIL;

      if (config.userId !== req.session.userId && !isAdmin) {
        return res.status(403).json({ message: "Not your bot" });
      }

      const otp = createOtp("bot_delete", botId);
      const sent = await sendOtpViaTelegram(config.botToken, config.ownerId, otp, "Bot Deletion Verification");

      if (!sent) {
        return res.status(500).json({ message: "Failed to send OTP to the bot owner on Telegram. Make sure the owner has started a conversation with the bot." });
      }

      return res.json({ message: "OTP sent to bot owner on Telegram", sent: true });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  });

  app.delete("/api/bots/:id", requireAuth, async (req, res) => {
    try {
      const botId = req.params.id as string;
      const otp = req.query.otp as string | undefined;
      const force = req.query.force === "true";

      const config = await storage.getBotConfigById(botId);
      if (!config) {
        return res.status(404).json({ message: "Bot not found" });
      }

      const user = await storage.getUserById(req.session.userId!);
      const isAdmin = user?.email === ADMIN_EMAIL;

      if (config.userId !== req.session.userId && !isAdmin) {
        return res.status(403).json({ message: "Not your bot" });
      }

      if (force) {
        await deleteBot(botId);
        return res.json({ action: "delete", message: "Bot force-deleted successfully" });
      }

      if (!otp || otp.length !== 6) {
        return res.status(400).json({ message: "OTP is required to delete a bot" });
      }

      const valid = verifyOtp("bot_delete", botId, otp);
      if (!valid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await deleteBot(botId);
      return res.json({ action: "delete", message: "Bot deleted successfully" });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  });

  app.put("/api/bots/:id", requireAuth, async (req, res) => {
    try {
      const botId = req.params.id as string;
      const config = await storage.getBotConfigById(botId);
      if (!config) {
        return res.status(404).json({ message: "Bot not found" });
      }

      const user = await storage.getUserById(req.session.userId!);
      const isAdmin = user?.email === ADMIN_EMAIL;

      if (config.userId !== req.session.userId && !isAdmin) {
        return res.status(403).json({ message: "Not your bot" });
      }

      const { welcomeMessage, customization, groupId, ownerId } = req.body;

      const updates: any = {};
      if (welcomeMessage !== undefined) {
        if (typeof welcomeMessage !== "string" || welcomeMessage.trim().length === 0) {
          return res.status(400).json({ message: "Welcome message cannot be empty" });
        }
        updates.welcomeMessage = welcomeMessage.trim();
      }
      if (customization !== undefined) {
        const parsed = botCustomizationSchema.safeParse(customization);
        if (!parsed.success) {
          return res.status(400).json({ message: "Invalid customization data" });
        }
        updates.customization = parsed.data;
      }
      if (groupId !== undefined) {
        if (typeof groupId !== "string" || groupId.trim().length === 0) {
          return res.status(400).json({ message: "Group ID cannot be empty" });
        }
        updates.groupId = groupId.trim();
      }
      if (ownerId !== undefined) {
        if (typeof ownerId !== "string" || ownerId.trim().length === 0) {
          return res.status(400).json({ message: "Owner ID cannot be empty" });
        }
        updates.ownerId = ownerId.trim();
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      const updated = await storage.updateBotConfig(botId, updates);

      const running = getBotById(botId);
      if (running) {
        try {
          await stopBot(botId);
          await new Promise((r) => setTimeout(r, 1500));
          const parsedCustomization = botCustomizationSchema.parse(updated.customization || {});
          const instance = await startBot(
            updated.botToken,
            updated.groupId,
            updated.ownerId,
            updated.userId,
            updated.welcomeMessage,
            parsedCustomization,
            updated.id
          );
          return res.json({
            action: "update",
            message: "Bot updated and restarted",
            id: instance.id,
            botUsername: instance.botUsername,
            status: instance.status,
          });
        } catch (err: any) {
          return res.json({
            action: "update",
            message: "Bot config updated but restart failed: " + err.message,
            id: updated.id,
            botUsername: updated.botUsername,
          });
        }
      }

      return res.json({
        action: "update",
        message: "Bot config updated (bot is stopped)",
        id: updated.id,
        botUsername: updated.botUsername,
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  });

  app.get("/api/bots", requireAuth, async (req, res) => {
    const user = await storage.getUserById(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (user.email === ADMIN_EMAIL) {
      const configs = await storage.getAllBotConfigs();
      const botsWithDetails = await Promise.all(
        configs.map(async (config) => {
          const running = getBotById(config.id);
          const botUser = await storage.getUserById(config.userId);
          return {
            id: config.id,
            botUsername: config.botUsername,
            status: running ? running.instance.status : "stopped" as const,
            startedAt: config.createdAt.toISOString(),
            error: running?.instance.error,
            ownerEmail: botUser?.email || "Unknown",
            groupId: config.groupId,
            ownerId: config.ownerId,
            welcomeMessage: config.welcomeMessage,
            customization: config.customization,
          };
        })
      );
      return res.json(botsWithDetails);
    }

    const configs = await storage.getBotConfigsByUser(req.session.userId!);
    const bots = configs.map((config) => {
      const running = getBotById(config.id);
      return {
        id: config.id,
        botUsername: config.botUsername,
        status: running ? running.instance.status : "stopped" as const,
        startedAt: config.createdAt.toISOString(),
        error: running?.instance.error,
        groupId: config.groupId,
        ownerId: config.ownerId,
        welcomeMessage: config.welcomeMessage,
        customization: config.customization,
      };
    });
    return res.json(bots);
  });

  return httpServer;
}
