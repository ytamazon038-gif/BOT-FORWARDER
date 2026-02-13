# Telegram Bot Service

## Overview
A web-based Telegram bot management service with user authentication. Users create accounts with email/password, then launch and manage multiple Telegram bots through a dashboard. Each bot forwards private text messages to a specified group with inline Reply/Exit controls. Bots start and stop immediately without verification codes. Bot configurations are persisted in the database and automatically restored on server restart.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- **Backend**: Express.js + Telegraf (Telegram Bot API) + express-session
- **Database**: PostgreSQL (user accounts + bot configs via Drizzle ORM)
- **Storage**: Bot tokens persisted in database, auto-restored on restart

## Key Files
- `shared/schema.ts` - Zod schemas, Drizzle table definitions (users, botConfigs), TypeScript types
- `client/src/pages/home.tsx` - Main dashboard (bot info, launch form, setup instructions)
- `client/src/pages/login.tsx` - Login page with forgot password flow
- `client/src/pages/register.tsx` - Registration page
- `client/src/lib/auth.ts` - useAuth hook for session state
- `client/src/App.tsx` - Router with ProtectedRoute/GuestRoute
- `server/botManager.ts` - Telegraf bot lifecycle, message forwarding, DB persistence, auto-restore
- `server/routes.ts` - API endpoints with session auth middleware
- `server/storage.ts` - Database storage interface (user CRUD, bot config CRUD, password hashing, admin seeding)
- `server/otp.ts` - OTP generation, storage (in-memory with 5min expiry), and Telegram delivery

## API Endpoints
### Auth
- `POST /api/auth/register` - Create account (email, password, confirmPassword)
- `POST /api/auth/login` - Sign in (email, password)
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Current user info
- `POST /api/auth/forgot-password` - Request password reset OTP (sent via Telegram bot to owner)
- `POST /api/auth/reset-password` - Reset password with OTP verification (email, otp, newPassword)

### Bots (all require auth)
- `GET /api/bots` - List user's bots with config details (admin sees all with owner email)
- `POST /api/bots/start` - Start a new bot (botToken, groupId, ownerId, welcomeMessage, customization)
- `PUT /api/bots/:id` - Update bot config (groupId, ownerId, welcomeMessage, customization) - auto-restarts if running
- `POST /api/bots/restart/:id` - Restart a stopped bot
- `POST /api/bots/stop/:id` - Stop a bot (keeps config in DB)
- `POST /api/bots/request-delete-otp/:id` - Request OTP for bot deletion (sent to owner via Telegram)
- `DELETE /api/bots/:id?otp=123456` - Delete a bot with OTP verification
- `DELETE /api/bots/:id?force=true` - Force delete without OTP (always works)

## Customization System
- Every bot text (buttons, messages, prompts) is fully customizable per bot
- Stored as JSON in `customization` column of `bot_configs` table
- Schema: `botCustomizationSchema` in `shared/schema.ts` defines all fields with defaults
- Fields: startBtnSend, startBtnOwner, startBtnHelp, startBtnLanguage, replyBtnText, exitBtnText, ownerNotice, sendPromptEn/Hi, ownerInfoEn/Hi, helpTextEn/Hi, textOnlyMsgEn/Hi
- `DEFAULT_CUSTOMIZATION` constant provides backward-compatible defaults
- `parseCustomization()` in botManager.ts safely parses DB JSON with fallback to defaults
- Dashboard has collapsible customization section with live Telegram-style preview
- Preview updates in real-time as user types using react-hook-form `watch()`

## How It Works
1. User registers/logs in with email and password (admin account pre-seeded)
2. User enters Bot Token, Target Group ID, Owner User ID, and Welcome Message on dashboard
3. Optionally customizes all bot button labels, messages, and response texts
4. Bot starts immediately and begins forwarding private text messages to the group (Name/Username/Message format)
5. Two inline buttons (Reply, Exit) appear below each forwarded message - labels are customizable
6. Only the owner can use the buttons - non-owners see customizable redirect message
7. Reply: enters continuous reply mode - all owner messages in group go to user until Exit is clicked
8. Exit: restores original tagged format with both buttons, stops reply forwarding
9. Bot /start command shows welcome message with customizable inline buttons: Send Message, Owner, Help, Language
10. Language selection: English / Hinglish supported - all prompts customizable

## Bot Persistence
- Bot configurations (token, groupId, ownerId, welcomeMessage, customization) are stored in `bot_configs` table
- Stopping a bot sets `is_active = false` but keeps the config
- Restarting a stopped bot re-launches it from saved config
- Deleting a bot removes the config entirely (requires OTP verification)
- On server startup, all bots marked `is_active = true` are automatically restored

## OTP Verification
- **Forgot Password**: User enters email on login page, OTP sent to owner's Telegram via their bot, user enters OTP + new password to reset
- **Bot Deletion**: When deleting a bot, OTP sent to bot owner via Telegram private message (not in group), user must enter OTP to confirm deletion
- OTPs are 6 digits, stored in-memory, expire after 5 minutes
- Delivery via temporary Telegraf instance using bot token (works for both active and stopped bots)

## Admin Account
- Email: ytamazon038@gmail.com
- Password: @Fearflesh
- Seeded automatically on server startup

## Limits
- Max 2 running bots per user account (enforced at start time)

## Group Management Commands (owner-only, in group chat)
- `/addbot` - Get link to add bot to another group
- `/ban` - Reply to a user's message to ban them from the group
- `/kickall` - Remove all non-owner admins from the group (regular members must be banned via /ban)
- All commands require the bot to be a group admin with ban permissions

## Credits
- Creator: @Fearflesh
- Support: @Fearfesh
