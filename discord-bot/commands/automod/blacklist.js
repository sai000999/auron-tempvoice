const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'add') {
      const word = interaction.options.getString('word').toLowerCase();
      
      const { error } = await supabase
        .from('blacklisted_words')
        .insert({ guild_id: interaction.guild.id, word });
      
      if (error) {
        return interaction.reply({ content: '❌ Failed to add word', ephemeral: true });
      }
      
      const embed = new EmbedBuilder()
        .setTitle('✅ Word Blacklisted')
        .setDescription(`Added **${word}** to blacklist`)
        .setColor('#43b581')
        .setTimestamp()
        .setFooter({ text: 'Auron Bot' });
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'remove') {
      const word = interaction.options.getString('word').toLowerCase();
      
      const { error } = await supabase
        .from('blacklisted_words')
        .delete()
        .match({ guild_id: interaction.guild.id, word });
      
      if (error) {
        return interaction.reply({ content: '❌ Failed to remove word', ephemeral: true });
      }
      
      const embed = new EmbedBuilder()
        .setTitle('✅ Word Removed')
        .setDescription(`Removed **${word}** from blacklist`)
        .setColor('#43b581')
        .setTimestamp()
        .setFooter({ text: 'Auron Bot' });
      
      await interaction.reply({ embeds: [embed] });
      
    } else if (subcommand === 'list') {
      const { data } = await supabase
        .from('blacklisted_words')
        .select('word')
        .eq('guild_id', interaction.guild.id);
      
      const words = data && data.length > 0 ? data.map(w => w.word).join(', ') : 'None';
      
      const embed = new EmbedBuilder()
        .setTitle('📋 Blacklisted Words')
        .setDescription(words)
        .setColor('#2b2d31')
        .setTimestamp()
        .setFooter({ text: 'Auron Bot' });
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};
