import { pgTable, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const botCustomizationSchema = z.object({
  startBtnSend: z.string().default("Send Message"),
  startBtnOwner: z.string().default("Owner"),
  startBtnHelp: z.string().default("Help"),
  startBtnLanguage: z.string().default("Language"),
  replyBtnText: z.string().default("Reply"),
  exitBtnText: z.string().default("Exit"),
  ownerNotice: z.string().default("You are not the owner.\nDm @Fearflesh to create your own bot."),
  sendPromptEn: z.string().default("Send me a text message and I'll forward it to the group."),
  sendPromptHi: z.string().default("Mujhe ek text message bhejo, main usse group mein forward kar dunga."),
  helpTextEn: z.string().default("How to use this bot:\n\n1. Send me any text message\n2. Your message will be forwarded to the group\n3. The owner can reply to you through the group\n\nSupport:- @Fearfesh"),
  helpTextHi: z.string().default("Bot kaise use kare:\n\n1. Mujhe koi bhi text message bhejo\n2. Tumhara message group mein forward ho jayega\n3. Owner group se tumhe reply kar sakta hai\n\nSupport:- @Fearfesh"),
  ownerInfoEn: z.string().default("Owner:- @Fearflesh\nDm for support or to create your own bot."),
  ownerInfoHi: z.string().default("Owner:- @Fearflesh\nSupport ya apna bot banane ke liye DM karo."),
  textOnlyMsgEn: z.string().default("Send text only."),
  textOnlyMsgHi: z.string().default("Sirf text message bhejo."),
});

export type BotCustomization = z.infer<typeof botCustomizationSchema>;

export const DEFAULT_CUSTOMIZATION: BotCustomization = botCustomizationSchema.parse({});

export const botConfigs = pgTable("bot_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  botToken: text("bot_token").notNull(),
  groupId: text("group_id").notNull(),
  ownerId: text("owner_id").notNull(),
  botUsername: text("bot_username").notNull(),
  welcomeMessage: text("welcome_message").notNull(),
  customization: jsonb("customization"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BotConfig = typeof botConfigs.$inferSelect;

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const DEFAULT_WELCOME_MESSAGE = "Welcome! Send me a text message and I'll forward it to the group.";

export const startBotSchema = z.object({
  botToken: z.string().min(10, "Bot token is required"),
  groupId: z.string().min(1, "Target group ID is required"),
  ownerId: z.string().min(1, "Owner user ID is required"),
  welcomeMessage: z.string().min(1, "Welcome message is required").default(DEFAULT_WELCOME_MESSAGE),
  customization: botCustomizationSchema.optional(),
});

export type StartBotInput = z.infer<typeof startBotSchema>;

export interface BotInstance {
  id: string;
  userId: string;
  botToken: string;
  groupId: string;
  ownerId: string;
  botUsername: string;
  welcomeMessage: string;
  customization: BotCustomization;
  status: "running" | "stopped" | "error";
  startedAt: string;
  error?: string;
}

export interface BotStatus {
  id: string;
  botUsername: string;
  status: "running" | "stopped" | "error";
  startedAt: string;
  error?: string;
  ownerEmail?: string;
  groupId?: string;
  ownerId?: string;
  welcomeMessage?: string;
  customization?: BotCustomization;
}

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const deleteOtpRequestSchema = z.object({
  botId: z.string().min(1, "Bot ID is required"),
});

export const deleteOtpVerifySchema = z.object({
  botId: z.string().min(1, "Bot ID is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const ADMIN_EMAIL = "ytamazon038@gmail.com";
