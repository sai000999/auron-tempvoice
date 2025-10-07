const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempvc-setup')
    .setDescription('Setup temporary voice channel system')
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('Category to create channels in')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const category = interaction.options.getChannel('category');
    
    // Create voice channel
    const voiceChannel = await interaction.guild.channels.create({
      name: '🎧 Create VC',
      type: ChannelType.GuildVoice,
      parent: category.id
    });
    
    // Create interface text channel
    const textChannel = await interaction.guild.channels.create({
      name: '💬 VC Interface',
      type: ChannelType.GuildText,
      parent: category.id
    });
    
    // Save to database
    const { error } = await supabase
      .from('tempvc_config')
      .upsert({
        guild_id: interaction.guild.id,
        category_id: category.id,
        create_vc_channel_id: voiceChannel.id,
        interface_channel_id: textChannel.id,
        enabled: true
      });
    if (error) {
      console.error('TempVC setup save error:', error.message);
      return interaction.reply({ content: `❌ Failed to save config: ${error.message}`, flags: 64 });
    }
    
    // Send management embed
    const embed = new EmbedBuilder()
      .setTitle('🎛️ Temporary Voice Channel System')
      .setDescription('Join the **Create VC** channel to automatically get your own temporary voice channel.\nYou\'ll receive a control panel to manage it once it\'s created.')
      .setColor('#2b2d31')
      .setTimestamp()
      .setFooter({ text: 'Auron Temp VC System' });
    
    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('vc_lock').setLabel('Lock VC').setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
        new ButtonBuilder().setCustomId('vc_unlock').setLabel('Unlock VC').setStyle(ButtonStyle.Secondary).setEmoji('🔓'),
        new ButtonBuilder().setCustomId('vc_hide').setLabel('Hide VC').setStyle(ButtonStyle.Secondary).setEmoji('🙈'),
        new ButtonBuilder().setCustomId('vc_unhide').setLabel('Unhide VC').setStyle(ButtonStyle.Secondary).setEmoji('👀')
      );
    
    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('vc_rename').setLabel('Rename VC').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
        new ButtonBuilder().setCustomId('vc_bitrate').setLabel('Set Bitrate').setStyle(ButtonStyle.Primary).setEmoji('📶'),
        new ButtonBuilder().setCustomId('vc_limit').setLabel('Set User Limit').setStyle(ButtonStyle.Primary).setEmoji('👥')
      );
    
    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('vc_transfer').setLabel('Transfer Ownership').setStyle(ButtonStyle.Primary).setEmoji('🔁'),
        new ButtonBuilder().setCustomId('vc_claim').setLabel('Claim Ownership').setStyle(ButtonStyle.Success).setEmoji('🏆'),
        new ButtonBuilder().setCustomId('vc_delete').setLabel('Delete VC').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
      );
    
    await textChannel.send({ embeds: [embed], components: [row1, row2, row3] });
    
    await interaction.reply({ content: '✅ Temp VC system setup complete!', flags: 64 });
  },
};
