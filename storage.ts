import { db } from "./db";
import { users, botConfigs, type InsertUser, type User, type BotConfig } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  createUser(email: string, password: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  saveBotConfig(config: Omit<BotConfig, "createdAt">): Promise<BotConfig>;
  getBotConfigsByUser(userId: string): Promise<BotConfig[]>;
  getAllBotConfigs(): Promise<BotConfig[]>;
  getActiveBotConfigs(): Promise<BotConfig[]>;
  getBotConfigById(id: string): Promise<BotConfig | undefined>;
  updateBotActive(id: string, isActive: boolean): Promise<void>;
  updateBotConfig(id: string, updates: { botToken?: string; groupId?: string; ownerId?: string; welcomeMessage?: string; customization?: unknown }): Promise<BotConfig>;
  deleteBotConfig(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
    }).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }

  async saveBotConfig(config: Omit<BotConfig, "createdAt">): Promise<BotConfig> {
    const [saved] = await db.insert(botConfigs).values(config).returning();
    return saved;
  }

  async getBotConfigsByUser(userId: string): Promise<BotConfig[]> {
    return db.select().from(botConfigs).where(eq(botConfigs.userId, userId));
  }

  async getAllBotConfigs(): Promise<BotConfig[]> {
    return db.select().from(botConfigs);
  }

  async getActiveBotConfigs(): Promise<BotConfig[]> {
    return db.select().from(botConfigs).where(eq(botConfigs.isActive, true));
  }

  async getBotConfigById(id: string): Promise<BotConfig | undefined> {
    const [config] = await db.select().from(botConfigs).where(eq(botConfigs.id, id));
    return config;
  }

  async updateBotActive(id: string, isActive: boolean): Promise<void> {
    await db.update(botConfigs).set({ isActive }).where(eq(botConfigs.id, id));
  }

  async updateBotConfig(id: string, updates: { botToken?: string; groupId?: string; ownerId?: string; welcomeMessage?: string; customization?: unknown }): Promise<BotConfig> {
    const setFields: any = {};
    if (updates.botToken !== undefined) setFields.botToken = updates.botToken;
    if (updates.groupId !== undefined) setFields.groupId = updates.groupId;
    if (updates.ownerId !== undefined) setFields.ownerId = updates.ownerId;
    if (updates.welcomeMessage !== undefined) setFields.welcomeMessage = updates.welcomeMessage;
    if (updates.customization !== undefined) setFields.customization = updates.customization;
    const [updated] = await db.update(botConfigs).set(setFields).where(eq(botConfigs.id, id)).returning();
    return updated;
  }

  async deleteBotConfig(id: string): Promise<void> {
    await db.delete(botConfigs).where(eq(botConfigs.id, id));
  }
}

export const storage = new DatabaseStorage();

export async function seedAdminAccount() {
  const adminEmail = "ytamazon038@gmail.com";
  const adminPassword = "@Fearflesh";

  const existing = await storage.getUserByEmail(adminEmail);
  if (!existing) {
    await storage.createUser(adminEmail, adminPassword);
    console.log("[seed] Admin account created");
  }
}
