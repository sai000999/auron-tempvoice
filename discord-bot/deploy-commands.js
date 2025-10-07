/**
 * DEPLOY SLASH COMMANDS
 * 
 * Run this file once to register slash commands with Discord
 * Usage: node deploy-commands.js
 */

require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  // Bot Management
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),
  
  // Moderation Commands
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID to unban')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  // Automod Commands
  new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automod settings (use dashboard for full control)')
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Enable automod'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable automod'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Manage blacklisted words')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a word to blacklist')
        .addStringOption(option =>
          option.setName('word')
            .setDescription('Word to blacklist')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a word from blacklist')
        .addStringOption(option =>
          option.setName('word')
            .setDescription('Word to remove')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all blacklisted words'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  // Temp VC Commands
  new SlashCommandBuilder()
    .setName('tempvc-setup')
    .setDescription('Setup temporary voice channel system (configure in dashboard)')
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('Category for temp VCs')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('interface')
        .setDescription('Text channel for VC controls')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  // Ticket Commands
  new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Setup ticket system (configure in dashboard)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for ticket panel')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('staff')
        .setDescription('Staff role to ping')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  // Economy Commands
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your coin balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check (optional)')),
  
  new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the server shop'),
  
  new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Purchase an item from the shop')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name')
        .setRequired(true)),
  
  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the richest members'),
  
  // Welcome Commands
  new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure welcome system (use dashboard for full control)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  // Logging Commands
  new SlashCommandBuilder()
    .setName('logging')
    .setDescription('Setup logging channels (configure in dashboard)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  // Inactivity Monitor
  new SlashCommandBuilder()
    .setName('monitor')
    .setDescription('Setup inactivity monitor (configure in dashboard)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to monitor')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Started refreshing application (/) commands...');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );

    console.log('✅ Successfully reloaded application (/) commands!');
    console.log(`📝 Registered ${commands.length} commands`);
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
})();