/**
 * AURON DISCORD BOT - Temp VC Edition
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
const requiredEnv = ['DISCORD_TOKEN', 'SUPABASE_URL', 'SUPABASE_KEY'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing environment variables:', missing.join(', '), '- set them in discord-bot/.env');
  process.exit(1);
}
const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
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
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

// Store active temp VCs: { channelId: ownerId }
const tempVCs = new Map();

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

async function getTempVCConfig(guildId) {
  const { data, error } = await supabase
    .from('tempvc_config')
    .select('*')
    .eq('guild_id', guildId)
    .maybeSingle();
  if (error) {
    console.error('Supabase getTempVCConfig error:', error.message);
  }
  return data || null;
}

function createEmbed(title, description, color = '#2b2d31') {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'Auron Temp VC Bot' });
}

// ==================== EVENT HANDLERS ====================

client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} is online!`);
  client.user.setPresence({
    activities: [{ name: '🎧 Temp VC System' }],
    status: 'online',
  });
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    
    if (!command) return;
    
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ There was an error executing this command!', flags: 64 });
    }
  }
  
  // Handle button interactions for VC controls
  if (interaction.isButton()) {
    const ownerId = tempVCs.get(interaction.member.voice.channelId);
    
    if (!ownerId) {
      return interaction.reply({ content: '❌ You must be in a temporary voice channel to use this!', flags: 64 });
    }
    
    if (ownerId !== interaction.user.id && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Only the channel owner can use this!', flags: 64 });
    }
    
    const voiceChannel = interaction.member.voice.channel;
    
    try {
      switch (interaction.customId) {
        case 'vc_lock':
          await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            Connect: false
          });
          await interaction.reply({ content: '🔒 Voice channel locked!', flags: 64 });
          break;
          
        case 'vc_unlock':
          await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            Connect: true
          });
          await interaction.reply({ content: '🔓 Voice channel unlocked!', flags: 64 });
          break;
          
        case 'vc_hide':
          await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            ViewChannel: false
          });
          await interaction.reply({ content: '🙈 Voice channel hidden!', flags: 64 });
          break;
          
        case 'vc_unhide':
          await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            ViewChannel: true
          });
          await interaction.reply({ content: '👀 Voice channel visible!', flags: 64 });
          break;
          
        case 'vc_delete':
          await interaction.reply({ content: '🗑️ Deleting channel...', flags: 64 });
          tempVCs.delete(voiceChannel.id);
          await voiceChannel.delete();
          break;
          
        case 'vc_claim':
          if (ownerId) {
            const owner = await interaction.guild.members.fetch(ownerId).catch(() => null);
            if (owner && voiceChannel.members.has(ownerId)) {
              return interaction.reply({ content: '❌ The current owner is still in the channel!', flags: 64 });
            }
          }
          tempVCs.set(voiceChannel.id, interaction.user.id);
          await interaction.reply({ content: '🏆 You are now the channel owner!', flags: 64 });
          break;
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Failed to perform action!', flags: 64 });
    }
  }
});

// Temp VC System
client.on('voiceStateUpdate', async (oldState, newState) => {
  const config = await getTempVCConfig(newState.guild.id);
  
  console.log('Voice state update detected');
  console.log('Config:', config);
  
  if (!config || !config.enabled) {
    console.log('Config not enabled or not found');
    return;
  }
  
  // User joined the create channel
  console.log('Checking if user joined create channel:', newState.channelId, 'vs', config.create_vc_channel_id);
  if (newState.channelId === config.create_vc_channel_id && oldState.channelId !== newState.channelId) {
    console.log('User joined create channel! Creating temp VC...');
    try {
      const category = newState.guild.channels.cache.get(config.category_id);
      
      const tempChannel = await newState.guild.channels.create({
        name: `${newState.member.user.username}'s VC`,
        type: ChannelType.GuildVoice,
        parent: category?.id,
        userLimit: 0
      });
      
      console.log('Temp VC created:', tempChannel.name);
      
      // Store the owner
      tempVCs.set(tempChannel.id, newState.member.id);
      
      // Move user to new channel
      await newState.member.voice.setChannel(tempChannel);
      
      console.log('User moved to temp VC');
      
      // Send control panel DM
      const embed = createEmbed(
        '🎛️ Voice Channel Created',
        `Your temporary voice channel has been created!\nGo to the VC Interface channel to control it.`
      );
      
      await newState.member.send({ embeds: [embed] }).catch(() => {});
      
      // Auto-delete timer
      if (config.auto_delete_timeout) {
        setTimeout(async () => {
          if (tempChannel.members.size === 0) {
            tempVCs.delete(tempChannel.id);
            await tempChannel.delete().catch(console.error);
          }
        }, config.auto_delete_timeout * 1000);
      }
      
    } catch (error) {
      console.error('Error creating temp VC:', error);
    }
  }
  
  // Auto-delete empty temp VCs
  if (oldState.channel && tempVCs.has(oldState.channelId)) {
    if (oldState.channel.members.size === 0) {
      tempVCs.delete(oldState.channelId);
      await oldState.channel.delete().catch(console.error);
    }
  }
});

// ==================== LOGIN ====================

client.login(process.env.DISCORD_TOKEN);
