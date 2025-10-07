const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Setup ticket system')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for ticket creation')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('staff-role')
        .setDescription('Staff role to ping')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const staffRole = interaction.options.getRole('staff-role');
    
    // Save config to database
    await supabase
      .from('ticket_config')
      .upsert({
        guild_id: interaction.guild.id,
        channel_id: channel.id,
        staff_role_id: staffRole.id,
        enabled: true
      });
    
    // Create ticket panel
    const embed = new EmbedBuilder()
      .setTitle('🎫 Ticket System')
      .setDescription('Click the button below to create a support ticket')
      .setColor('#2b2d31')
      .setTimestamp()
      .setFooter({ text: 'Auron Ticket System' });
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('Create Ticket')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎫')
      );
    
    await channel.send({ embeds: [embed], components: [row] });
    
    await interaction.reply({ content: `✅ Ticket system setup in ${channel}`, ephemeral: true });
  },
};
