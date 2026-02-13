import { Telegraf } from "telegraf";
import { log } from "./index";

interface OtpEntry {
  code: string;
  expiresAt: number;
  type: "password_reset" | "bot_delete";
  userId?: string;
  botConfigId?: string;
}

const otpStore = new Map<string, OtpEntry>();

const OTP_EXPIRY_MS = 5 * 60 * 1000;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function cleanExpired() {
  const now = Date.now();
  otpStore.forEach((entry, key) => {
    if (entry.expiresAt < now) {
      otpStore.delete(key);
    }
  });
}

export function createOtp(type: "password_reset" | "bot_delete", identifier: string, extra?: { userId?: string; botConfigId?: string }): string {
  cleanExpired();
  const code = generateOtp();
  const key = `${type}:${identifier}`;
  otpStore.set(key, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    type,
    ...extra,
  });
  return code;
}

export function verifyOtp(type: "password_reset" | "bot_delete", identifier: string, code: string): boolean {
  cleanExpired();
  const key = `${type}:${identifier}`;
  const entry = otpStore.get(key);
  if (!entry) return false;
  if (entry.code !== code) return false;
  if (entry.expiresAt < Date.now()) {
    otpStore.delete(key);
    return false;
  }
  otpStore.delete(key);
  return true;
}

export async function sendOtpViaTelegram(botToken: string, telegramUserId: string, otp: string, purpose: string): Promise<boolean> {
  try {
    const tempBot = new Telegraf(botToken);
    const message = `Your verification code: ${otp}\n\nPurpose: ${purpose}\nThis code expires in 5 minutes.\n\nIf you didn't request this, please ignore.`;
    await tempBot.telegram.sendMessage(Number(telegramUserId), message);
    log(`OTP sent to Telegram user ${telegramUserId}`, "bot");
    return true;
  } catch (err: any) {
    log(`Failed to send OTP via Telegram: ${err.message}`, "bot");
    return false;
  }
}
