/**
 * AURON DISCORD BOT
 * 
 * This bot connects to the same database as your web dashboard.
 * Configure everything through the dashboard at: YOUR_LOVABLE_URL/dashboard
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: npm install discord.js @supabase/supabase-js dotenv
 * 2. Create a .env file with:
 *    DISCORD_TOKEN=your_bot_token
 *    DISCORD_CLIENT_ID=your_client_id
 *    SUPABASE_URL=your_supabase_url
 *    SUPABASE_KEY=your_supabase_anon_key
 * 3. Run: node bot.js
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load slash commands
const fs = require('fs');
const path = require('path');

const loadCommands = (dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      const command = require(filePath);
      if (command.data) {
        client.commands.set(command.data.name, command);
      }
    }
  }
};

const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);
console.log(`✅ Loaded ${client.commands.size} slash commands`);

// ==================== UTILITY FUNCTIONS ====================

async function getGuildSettings(guildId) {
  const { data } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('guild_id', guildId)
    .single();
  
  return data || { prefix: '.', status: 'Playing /help', embed_color: '#2b2d31', accent_color: '#ff4040' };
}

async function getAutomodConfig(guildId) {
  const { data } = await supabase
    .from('automod_config')
    .select('*')
    .eq('guild_id', guildId)
    .single();
  
  return data || { enabled: false };
}

async function getWelcomeConfig(guildId) {
  const { data } = await supabase
    .from('welcome_config')
    .select('*')
    .eq('guild_id', guildId)
    .single();
  
  return data || { enabled: false };
}

async function getLoggingConfig(guildId) {
  const { data } = await supabase
    .from('logging_config')
    .select('*')
    .eq('guild_id', guildId)
    .single();
  
  return data || { enabled: false };
}

function createEmbed(title, description, color = '#2b2d31') {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'Auron Bot' });
}

// ==================== EVENT HANDLERS ====================

client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} is online!`);
  
  // Set bot status from first guild's settings (you can customize this)
  const guild = client.guilds.cache.first();
  if (guild) {
    const settings = await getGuildSettings(guild.id);
    client.user.setPresence({
      activities: [{ name: settings.status }],
      status: 'online',
    });
  }
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ There was an error executing this command!', ephemeral: true });
  }
});

// Welcome System
client.on('guildMemberAdd', async (member) => {
  const config = await getWelcomeConfig(member.guild.id);
  
  if (!config.enabled) return;
  
  const channel = member.guild.channels.cache.get(config.channel_id);
  
  // Auto-role
  if (config.join_role_id) {
    const role = member.guild.roles.cache.get(config.join_role_id);
    if (role) {
      await member.roles.add(role).catch(console.error);
    }
  }
  
  // Auto decancer
  if (config.auto_decancer && member.displayName.match(/[^\x00-\x7F]/)) {
    await member.setNickname('Renamed User').catch(console.error);
  }
  
  // Send welcome message
  if (channel) {
    let message = config.message.replace('{user}', `<@${member.id}>`);
    
    if (config.embed_enabled) {
      const embed = createEmbed(
        config.embed_title,
        config.embed_description.replace('{user}', `<@${member.id}>`),
        config.embed_color
      );
      await channel.send({ embeds: [embed] });
    } else {
      await channel.send(message);
    }
  }
  
  // Send DM
  if (config.dm_enabled && config.dm_message) {
    await member.send(config.dm_message).catch(console.error);
  }
});

// Automod System
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  
  const config = await getAutomodConfig(message.guild.id);
  
  if (!config.enabled) return;
  
  // Check for spam (simple detection)
  if (config.spam_detection) {
    const recentMessages = message.channel.messages.cache
      .filter(m => m.author.id === message.author.id && Date.now() - m.createdTimestamp < 5000)
      .size;
    
    if (recentMessages > 5) {
      await message.member.timeout(config.spam_timeout_duration * 1000, 'Spam detected');
      const embed = createEmbed('⚠️ Auto-Timeout', `${message.author} was timed out for spamming`, '#ff4040');
      await message.channel.send({ embeds: [embed] });
      return;
    }
  }
  
  // Check mass mentions
  if (message.mentions.users.size > config.mass_mention_limit) {
    await message.delete();
    await message.member.timeout(config.spam_timeout_duration * 1000, 'Mass mention');
    return;
  }
  
  // Check blacklisted words
  const { data: blacklist } = await supabase
    .from('blacklisted_words')
    .select('word')
    .eq('guild_id', message.guild.id);
  
  if (blacklist) {
    const content = message.content.toLowerCase();
    for (const item of blacklist) {
      if (content.includes(item.word)) {
        await message.delete();
        const embed = createEmbed('🚫 Blacklisted Word', 'Your message contained a blacklisted word', '#ff4040');
        await message.author.send({ embeds: [embed] }).catch(console.error);
        return;
      }
    }
  }
});

// Logging System
client.on('messageDelete', async (message) => {
  if (message.author?.bot) return;
  
  const config = await getLoggingConfig(message.guild.id);
  if (!config.enabled || !config.message_logs_channel) return;
  
  const channel = message.guild.channels.cache.get(config.message_logs_channel);
  if (!channel) return;
  
  const embed = createEmbed(
    '🗑️ Message Deleted',
    `**Author:** ${message.author}\n**Channel:** ${message.channel}\n**Content:** ${message.content || 'No content'}`,
    '#ff4040'
  );
  
  await channel.send({ embeds: [embed] });
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (oldMessage.author?.bot || oldMessage.content === newMessage.content) return;
  
  const config = await getLoggingConfig(oldMessage.guild.id);
  if (!config.enabled || !config.message_logs_channel) return;
  
  const channel = oldMessage.guild.channels.cache.get(config.message_logs_channel);
  if (!channel) return;
  
  const embed = createEmbed(
    '✏️ Message Edited',
    `**Author:** ${oldMessage.author}\n**Channel:** ${oldMessage.channel}\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`,
    '#f9d342'
  );
  
  await channel.send({ embeds: [embed] });
});

client.on('guildMemberAdd', async (member) => {
  const config = await getLoggingConfig(member.guild.id);
  if (!config.enabled || !config.server_logs_channel) return;
  
  const channel = member.guild.channels.cache.get(config.server_logs_channel);
  if (!channel) return;
  
  const embed = createEmbed(
    '👋 Member Joined',
    `${member.user.tag} joined the server`,
    '#43b581'
  );
  
  await channel.send({ embeds: [embed] });
});

// ==================== PREFIX COMMANDS ====================

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  
  const settings = await getGuildSettings(message.guild.id);
  const prefix = settings.prefix;
  
  if (!message.content.startsWith(prefix)) return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  // Moderation Commands
  if (commandName === 'ban') {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ You need Ban Members permission');
    }
    
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    if (!user) return message.reply('❌ Please mention a user to ban');
    
    await message.guild.members.ban(user, { reason });
    
    const embed = createEmbed('🔨 Member Banned', `${user.tag} has been banned\n**Reason:** ${reason}`, settings.accent_color);
    await message.reply({ embeds: [embed] });
  }
  
  if (commandName === 'kick') {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ You need Kick Members permission');
    }
    
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    if (!member) return message.reply('❌ Please mention a member to kick');
    
    await member.kick(reason);
    
    const embed = createEmbed('👢 Member Kicked', `${member.user.tag} has been kicked\n**Reason:** ${reason}`, settings.accent_color);
    await message.reply({ embeds: [embed] });
  }
  
  if (commandName === 'timeout') {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ You need Moderate Members permission');
    }
    
    const member = message.mentions.members.first();
    const duration = parseInt(args[1]) || 10;
    const reason = args.slice(2).join(' ') || 'No reason provided';
    
    if (!member) return message.reply('❌ Please mention a member to timeout');
    
    await member.timeout(duration * 60 * 1000, reason);
    
    const embed = createEmbed('⏰ Member Timed Out', `${member.user.tag} has been timed out for ${duration} minutes\n**Reason:** ${reason}`, settings.accent_color);
    await message.reply({ embeds: [embed] });
  }
});

// ==================== LOGIN ====================

client.login(process.env.DISCORD_TOKEN);