# Auron Discord Bot

Professional all-in-one Discord bot with web dashboard integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd discord-bot
npm install
```

### 2. Configure Bot

Create a `.env` file (copy from `.env.example`):

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
SUPABASE_URL=https://dknfsmfsclbjhqjzmezq.supabase.co
# Prefer this on servers (bypasses RLS safely)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# Fallback if you don't have service role
SUPABASE_KEY=your_supabase_anon_key
```

**Where to get these:**
- `DISCORD_TOKEN` & `DISCORD_CLIENT_ID`: [Discord Developer Portal](https://discord.com/developers/applications)
- `SUPABASE_URL` & `SUPABASE_KEY`: Already configured in `.env.example` (connected to your dashboard)

### 3. Deploy Slash Commands

```bash
npm run deploy
```

### 4. Start the Bot

```bash
npm start
```

## 🎛️ Managing the Bot

Use the web dashboard to configure all bot settings: **[Your Dashboard URL]/dashboard**

### Dashboard Features:
- ⚙️ **Bot Settings** - Prefix, status, colors
- 🛡️ **Automod** - Spam detection, blacklist words
- 🎫 **Tickets** - Support ticket system
- 🎙️ **Temp VC** - Temporary voice channels
- 💰 **Economy** - Coins, shop, rewards
- 👋 **Welcome** - Greet new members
- 📊 **Logging** - Track all events
- ⏰ **Monitor** - Inactivity questions

## 📝 Commands

### Moderation
- `/ban @user [reason]` - Ban a member
- `/kick @user [reason]` - Kick a member
- `/timeout @user <minutes> [reason]` - Timeout a member
- `/unban <userid>` - Unban a user

### Prefix Commands (.)
You can also use `.` prefix for all commands:
- `.ban @user reason`
- `.kick @user reason`
- `.timeout @user 10 reason`

### Economy
- `/balance [@user]` - Check coins
- `/shop` - View shop items
- `/buy <item>` - Purchase items
- `/leaderboard` - Top members

### Setup Commands
- `/tempvc-setup` - Initialize temp VC system
- `/ticket-setup` - Initialize ticket system
- `/automod enable/disable` - Toggle automod
- `/blacklist add/remove <word>` - Manage blacklist

## 🔧 Bot Permissions

Make sure your bot has these permissions:
- Manage Channels
- Manage Roles
- Kick Members
- Ban Members
- Moderate Members
- Move Members
- Read Messages
- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History

## 📊 Database Integration

This bot automatically connects to the same database as your web dashboard. Any changes made in the dashboard are instantly reflected in the bot.

### How it works:
1. Dashboard saves settings to Supabase database
2. Bot reads settings from the same database
3. Real-time synchronization - no restarts needed!

## 🎨 Features

### ✅ Implemented
- Bot configuration (prefix, status, colors)
- Welcome system with embeds
- Automod (spam, blacklist, mentions)
- Logging (messages, joins, bans)
- Moderation commands (ban, kick, timeout)
- Dual command system (/ and .)

### 🚧 Ready to Extend
- Temp VC system (create panel & handlers)
- Ticket system (threads & transcripts)
- Economy system (coins, XP, shop)
- Inactivity monitor (random questions)

## 🆘 Support

If you need help:
1. Check the dashboard is properly configured
2. Verify bot has correct permissions
3. Check console for error messages
4. Ensure `.env` file is configured correctly

## 📝 Notes

- Use the dashboard to configure features before using bot commands
- Some features require specific Discord permissions
- Bot must be online to respond to commands
- Configuration changes take effect immediately