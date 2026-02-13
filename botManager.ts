import { Telegraf, Markup } from "telegraf";
import type { BotInstance, BotStatus, BotConfig, BotCustomization } from "@shared/schema";
import { DEFAULT_CUSTOMIZATION, botCustomizationSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { log } from "./index";
import { storage } from "./storage";

interface ForwardedMessage {
  userId: number;
  userFullName: string;
  username: string;
  originalText: string;
  taggedText: string;
  plainText: string;
  groupMessageId: number;
}

interface BotState {
  instance: BotInstance;
  bot: Telegraf;
  messages: Map<string, ForwardedMessage>;
  pendingReplyMsgId: string | null;
}

const activeBots = new Map<string, BotState>();

function parseCustomization(raw: unknown): BotCustomization {
  try {
    if (!raw) return DEFAULT_CUSTOMIZATION;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return botCustomizationSchema.parse(parsed);
  } catch {
    return DEFAULT_CUSTOMIZATION;
  }
}

function buildTaggedMessage(fullName: string, username: string, messageText: string): string {
  return `Name:- ${fullName}\nUsername:- ${username}\nMessage:-\n\n${messageText}`;
}

function buildReplyMessage(fullName: string, username: string, messageText: string, replyText: string): string {
  return `Name:- ${fullName}\nUsername:- ${username}\nMessage:-\n\n${messageText}\n\nReply:-\n${replyText}`;
}

function setupBotHandlers(state: BotState, bot: Telegraf, groupId: string, ownerId: string, botUsername: string, numericGroupId: number) {
  const c = state.instance.customization;

  bot.command("addbot", async (ctx) => {
    try {
      const chat = ctx.chat;
      if (chat.type !== "group" && chat.type !== "supergroup") return;
      if (chat.id.toString() !== groupId) return;
      if (ctx.from?.id?.toString() !== ownerId) {
        await ctx.reply(c.ownerNotice);
        return;
      }
      const inviteLink = `https://t.me/${botUsername}?startgroup=true`;
      await ctx.reply(`Use this link to add the bot to another group:\n${inviteLink}`);
    } catch (err: any) {
      log(`addbot command error: ${err.message}`, "bot");
    }
  });

  bot.command("ban", async (ctx) => {
    try {
      const chat = ctx.chat;
      if (chat.type !== "group" && chat.type !== "supergroup") return;
      if (chat.id.toString() !== groupId) return;
      if (ctx.from?.id?.toString() !== ownerId) {
        await ctx.reply(c.ownerNotice);
        return;
      }
      const replyMsg = ctx.message?.reply_to_message;
      if (!replyMsg || !replyMsg.from) {
        await ctx.reply("Reply to a message from the user you want to ban.");
        return;
      }
      const targetId = replyMsg.from.id;
      if (targetId.toString() === ownerId) {
        await ctx.reply("You can't ban yourself.");
        return;
      }
      const me = await bot.telegram.getMe();
      if (targetId === me.id) {
        await ctx.reply("I can't ban myself.");
        return;
      }
      await bot.telegram.banChatMember(chat.id, targetId);
      const targetName = replyMsg.from.first_name || "User";
      await ctx.reply(`${targetName} has been banned from the group.`);
    } catch (err: any) {
      log(`ban command error: ${err.message}`, "bot");
      try { await ctx.reply(`Failed to ban user: ${err.message}`); } catch {}
    }
  });

  bot.command("kickall", async (ctx) => {
    try {
      const chat = ctx.chat;
      if (chat.type !== "group" && chat.type !== "supergroup") return;
      if (chat.id.toString() !== groupId) return;
      if (ctx.from?.id?.toString() !== ownerId) {
        await ctx.reply(c.ownerNotice);
        return;
      }
      const admins = await bot.telegram.getChatAdministrators(chat.id);
      const me = await bot.telegram.getMe();
      let kicked = 0;
      let failed = 0;

      await ctx.reply("Removing all non-owner admins from the group...\n\nNote: Regular (non-admin) members must be banned individually using /ban. Telegram does not allow bots to list non-admin members.");

      for (const admin of admins) {
        const uid = admin.user.id;
        if (uid.toString() === ownerId || uid === me.id) continue;
        if (admin.status === "creator") continue;
        try {
          await bot.telegram.banChatMember(chat.id, uid);
          await bot.telegram.unbanChatMember(chat.id, uid);
          kicked++;
        } catch (e: any) {
          failed++;
          log(`Could not remove member ${uid}: ${e.message}`, "bot");
        }
      }

      let result = `Done! Removed ${kicked} admin(s) from the group.`;
      if (failed > 0) result += ` ${failed} could not be removed (insufficient permissions).`;
      result += "\n\nTo remove regular members, reply to their message and use /ban.";
      await ctx.reply(result);
    } catch (err: any) {
      log(`kickall command error: ${err.message}`, "bot");
      try { await ctx.reply(`Failed: ${err.message}\n\nMake sure the bot is an admin with ban permissions.`); } catch {}
    }
  });

  const mainMenuKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback(c.startBtnSend, "menu_send")],
    [Markup.button.callback(c.startBtnOwner, "menu_owner"), Markup.button.callback(c.startBtnHelp, "menu_help")],
    [Markup.button.callback(c.startBtnLanguage, "menu_language")],
  ]);

  bot.start(async (ctx) => {
    try {
      await ctx.reply(state.instance.welcomeMessage, mainMenuKeyboard);
    } catch (err: any) {
      log(`/start command error: ${err.message}`, "bot");
    }
  });

  const userLanguage = new Map<number, string>();

  bot.action("menu_send", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const lang = userLanguage.get(ctx.from?.id || 0) || "en";
      const msg = lang === "hi" ? c.sendPromptHi : c.sendPromptEn;
      await ctx.reply(msg);
    } catch (err: any) {
      log(`menu_send error: ${err.message}`, "bot");
    }
  });

  bot.action("menu_owner", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const lang = userLanguage.get(ctx.from?.id || 0) || "en";
      const msg = lang === "hi" ? c.ownerInfoHi : c.ownerInfoEn;
      await ctx.reply(msg);
    } catch (err: any) {
      log(`menu_owner error: ${err.message}`, "bot");
    }
  });

  bot.action("menu_help", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const lang = userLanguage.get(ctx.from?.id || 0) || "en";
      const msg = lang === "hi" ? c.helpTextHi : c.helpTextEn;
      await ctx.reply(msg);
    } catch (err: any) {
      log(`menu_help error: ${err.message}`, "bot");
    }
  });

  bot.action("menu_language", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const langKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback("English", "lang_en"), Markup.button.callback("Hinglish", "lang_hi")],
      ]);
      await ctx.reply("Choose your language:", langKeyboard);
    } catch (err: any) {
      log(`menu_language error: ${err.message}`, "bot");
    }
  });

  bot.action("lang_en", async (ctx) => {
    try {
      await ctx.answerCbQuery("Language set to English");
      const userId = ctx.from?.id;
      if (userId) userLanguage.set(userId, "en");
      await ctx.editMessageText("Language set to: English");
    } catch (err: any) {
      log(`lang_en error: ${err.message}`, "bot");
    }
  });

  bot.action("lang_hi", async (ctx) => {
    try {
      await ctx.answerCbQuery("Language set to Hinglish");
      const userId = ctx.from?.id;
      if (userId) userLanguage.set(userId, "hi");
      await ctx.editMessageText("Language set to: Hinglish");
    } catch (err: any) {
      log(`lang_hi error: ${err.message}`, "bot");
    }
  });

  bot.on("message", async (ctx) => {
    try {
      const chat = ctx.chat;
      const msg = ctx.message;
      const fromId = ctx.from?.id?.toString();

      if (chat.type === "private") {
        if (!("text" in msg)) {
          const lang = userLanguage.get(ctx.from?.id || 0) || "en";
          await ctx.reply(lang === "hi" ? c.textOnlyMsgHi : c.textOnlyMsgEn);
          return;
        }

        const text = msg.text;
        if (text.startsWith("/")) return;

        const fullName = [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" ") || "Unknown";
        const username = ctx.from?.username ? `@${ctx.from.username}` : "No username";
        const chatUserId = ctx.from?.id;

        if (!chatUserId) return;

        const msgId = randomUUID().replace(/-/g, "").slice(0, 12);
        const taggedText = buildTaggedMessage(fullName, username, text);

        const replyMarkup = Markup.inlineKeyboard([
          Markup.button.callback(c.replyBtnText, `reply_${msgId}`),
          Markup.button.callback(c.exitBtnText, `exit_${msgId}`),
        ]);

        try {
          const sentMsg = await bot.telegram.sendMessage(numericGroupId, taggedText, replyMarkup);
          state.messages.set(msgId, {
            userId: chatUserId,
            userFullName: fullName,
            username,
            originalText: text,
            taggedText,
            plainText: text,
            groupMessageId: sentMsg.message_id,
          });
          log(`Forwarded message from ${fullName} to group`, "bot");
        } catch (err: any) {
          log(`Failed to forward message to group: ${err.message}`, "bot");
          await ctx.reply("Sorry, I couldn't forward your message. Please try again later.");
        }

        return;
      }

      if (chat.type === "group" || chat.type === "supergroup") {
        const chatId = chat.id.toString();
        if (chatId !== groupId) return;
        if (fromId !== ownerId) return;
        if (!("text" in msg)) return;

        const text = (msg as any).text as string;
        if (text.startsWith("/")) return;

        if (!state.pendingReplyMsgId) return;

        const msgId = state.pendingReplyMsgId;
        const fwdMsg = state.messages.get(msgId);
        if (!fwdMsg) {
          state.pendingReplyMsgId = null;
          return;
        }

        try {
          await bot.telegram.sendMessage(fwdMsg.userId, text);
          log(`Owner sent message to ${fwdMsg.userFullName}`, "bot");
        } catch (err: any) {
          log(`Failed to send reply to user: ${err.message}`, "bot");
        }
      }
    } catch (err: any) {
      log(`Message handler error: ${err.message}`, "bot");
    }
  });

  bot.on("callback_query", async (ctx) => {
    try {
      const data = (ctx.callbackQuery as any).data as string | undefined;
      if (!data) return;

      const fromId = ctx.from?.id?.toString();

      if (fromId !== ownerId) {
        await ctx.answerCbQuery(c.ownerNotice, { show_alert: true });
        return;
      }

      if (data.startsWith("reply_")) {
        const msgId = data.replace("reply_", "");
        const fwdMsg = state.messages.get(msgId);
        if (!fwdMsg) {
          await ctx.answerCbQuery("Message not found");
          return;
        }

        state.pendingReplyMsgId = msgId;

        const exitMarkup = Markup.inlineKeyboard([
          Markup.button.callback(c.exitBtnText, `exit_${msgId}`),
        ]);

        try {
          await ctx.editMessageText(fwdMsg.plainText, exitMarkup);
          await ctx.answerCbQuery("Reply mode ON. Send your reply in this group.");
        } catch (err: any) {
          log(`Failed to edit message for reply: ${err.message}`, "bot");
          await ctx.answerCbQuery("Error activating reply mode");
        }
      } else if (data.startsWith("exit_")) {
        const msgId = data.replace("exit_", "");
        const fwdMsg = state.messages.get(msgId);
        if (!fwdMsg) {
          await ctx.answerCbQuery("Message not found");
          return;
        }

        if (state.pendingReplyMsgId === msgId) {
          state.pendingReplyMsgId = null;
        }

        const replyMarkup = Markup.inlineKeyboard([
          Markup.button.callback(c.replyBtnText, `reply_${msgId}`),
          Markup.button.callback(c.exitBtnText, `exit_${msgId}`),
        ]);

        try {
          await ctx.editMessageText(fwdMsg.taggedText, replyMarkup);
          await ctx.answerCbQuery("Restored original message.");
        } catch (err: any) {
          log(`Failed to edit message for exit: ${err.message}`, "bot");
          await ctx.answerCbQuery("Error restoring message");
        }
      }
    } catch (err: any) {
      log(`Callback query error: ${err.message}`, "bot");
    }
  });
}

export async function startBot(botToken: string, groupId: string, ownerId: string, userId: string, welcomeMessage: string, customization?: BotCustomization, existingId?: string): Promise<BotInstance> {
  const existingBot = Array.from(activeBots.values()).find(
    (b) => b.instance.botToken === botToken
  );
  if (existingBot) {
    throw new Error("A bot with this token is already running");
  }

  const bot = new Telegraf(botToken);
  const id = existingId || randomUUID();

  let botUsername = "unknown";
  try {
    const me = await bot.telegram.getMe();
    botUsername = me.username || "unknown";
    log(`Bot @${botUsername} verified successfully`, "bot");
  } catch (err: any) {
    throw new Error("Invalid bot token: " + (err.message || "could not connect"));
  }

  const numericGroupId = Number(groupId);
  if (isNaN(numericGroupId)) {
    throw new Error("Invalid Group ID: must be a number (e.g. -1001234567890)");
  }

  try {
    const chat = await bot.telegram.getChat(numericGroupId);
    log(`Verified group access: ${(chat as any).title || groupId}`, "bot");
  } catch (err: any) {
    throw new Error("Cannot access group: " + (err.message || "make sure the bot is added to the group"));
  }

  const resolvedCustomization = customization || DEFAULT_CUSTOMIZATION;

  const instance: BotInstance = {
    id,
    userId,
    botToken,
    groupId,
    ownerId,
    botUsername,
    welcomeMessage,
    customization: resolvedCustomization,
    status: "running",
    startedAt: new Date().toISOString(),
  };

  const state: BotState = {
    instance,
    bot,
    messages: new Map(),
    pendingReplyMsgId: null,
  };

  activeBots.set(id, state);

  setupBotHandlers(state, bot, groupId, ownerId, botUsername, numericGroupId);

  bot.catch((err: any) => {
    log(`Bot @${botUsername} error: ${err.message}`, "bot");
    const s = activeBots.get(id);
    if (s) {
      s.instance.status = "error";
      s.instance.error = err.message;
    }
  });

  try {
    await bot.launch({ dropPendingUpdates: true });
    log(`Bot @${botUsername} launched successfully and polling for updates (id: ${id})`, "bot");
  } catch (err: any) {
    activeBots.delete(id);
    throw new Error("Failed to launch bot: " + (err.message || "unknown error"));
  }

  if (!existingId) {
    await storage.saveBotConfig({
      id,
      userId,
      botToken,
      groupId,
      ownerId,
      botUsername,
      welcomeMessage,
      customization: resolvedCustomization,
      isActive: true,
    });
    log(`Bot @${botUsername} config saved to database`, "bot");
  } else {
    await storage.updateBotActive(id, true);
  }

  return instance;
}

export async function stopBot(id: string): Promise<boolean> {
  const state = activeBots.get(id);
  if (!state) return false;

  try {
    state.bot.stop("Stopped by user");
  } catch (err: any) {
    log(`Error stopping bot: ${err.message}`, "bot");
  }
  state.instance.status = "stopped";
  activeBots.delete(id);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await storage.updateBotActive(id, false);

  log(`Bot @${state.instance.botUsername} stopped (id: ${id})`, "bot");
  return true;
}

export async function deleteBot(id: string): Promise<boolean> {
  const state = activeBots.get(id);
  if (state) {
    try {
      state.bot.stop("Deleted by user");
    } catch (err: any) {
      log(`Error stopping bot during delete: ${err.message}`, "bot");
    }
    activeBots.delete(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await storage.deleteBotConfig(id);
  log(`Bot config deleted (id: ${id})`, "bot");
  return true;
}

export function getRunningBotStatus(userId?: string): BotStatus[] {
  return Array.from(activeBots.values())
    .filter((s) => !userId || s.instance.userId === userId)
    .map((s) => ({
      id: s.instance.id,
      botUsername: s.instance.botUsername,
      status: s.instance.status,
      startedAt: s.instance.startedAt,
      error: s.instance.error,
    }));
}

export async function getUserBots(userId: string): Promise<BotStatus[]> {
  const configs = await storage.getBotConfigsByUser(userId);
  return configs.map((c) => {
    const running = activeBots.get(c.id);
    return {
      id: c.id,
      botUsername: c.botUsername,
      status: running ? running.instance.status : "stopped" as const,
      startedAt: c.createdAt.toISOString(),
      error: running?.instance.error,
    };
  });
}

export async function getAllBots(): Promise<Array<BotStatus & { userId: string }>> {
  const configs = await storage.getAllBotConfigs();
  return configs.map((c) => {
    const running = activeBots.get(c.id);
    return {
      id: c.id,
      botUsername: c.botUsername,
      status: running ? running.instance.status : "stopped" as const,
      startedAt: c.createdAt.toISOString(),
      error: running?.instance.error,
      userId: c.userId,
    };
  });
}

export function getBotById(id: string): BotState | undefined {
  return activeBots.get(id);
}

export function getRunningBotCount(userId: string): number {
  return Array.from(activeBots.values()).filter((s) => s.instance.userId === userId).length;
}

export async function restoreBotsOnStartup(): Promise<void> {
  try {
    const activeConfigs = await storage.getActiveBotConfigs();
    log(`Found ${activeConfigs.length} bot(s) to restore`, "bot");

    for (const config of activeConfigs) {
      try {
        const customization = parseCustomization(config.customization);
        await startBot(
          config.botToken,
          config.groupId,
          config.ownerId,
          config.userId,
          config.welcomeMessage,
          customization,
          config.id
        );
        log(`Restored bot @${config.botUsername}`, "bot");
      } catch (err: any) {
        log(`Failed to restore bot @${config.botUsername}: ${err.message}`, "bot");
        await storage.updateBotActive(config.id, false);
      }
    }
  } catch (err: any) {
    log(`Error restoring bots: ${err.message}`, "bot");
  }
}

process.once("SIGINT", () => {
  activeBots.forEach((state) => {
    state.bot.stop("SIGINT");
  });
  activeBots.clear();
});

process.once("SIGTERM", () => {
  activeBots.forEach((state) => {
    state.bot.stop("SIGTERM");
  });
  activeBots.clear();
});
