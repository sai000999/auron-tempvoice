const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automod settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Enable automod'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable automod'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const enabled = subcommand === 'enable';
    
    const { error } = await supabase
      .from('automod_config')
      .upsert({
        guild_id: interaction.guild.id,
        enabled
      });
    
    if (error) {
      return interaction.reply({ content: '❌ Failed to update automod settings', ephemeral: true });
    }
    
    const embed = new EmbedBuilder()
      .setTitle(enabled ? '✅ Automod Enabled' : '❌ Automod Disabled')
      .setDescription(`Automod has been ${enabled ? 'enabled' : 'disabled'}`)
      .setColor(enabled ? '#43b581' : '#ff4040')
      .setTimestamp()
      .setFooter({ text: 'Auron Bot' });
    
    await interaction.reply({ embeds: [embed] });
  },
};
