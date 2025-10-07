const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the server shop'),
  
  async execute(interaction) {
    const { data: items } = await supabase
      .from('shop_items')
      .select('*')
      .eq('guild_id', interaction.guild.id);
    
    if (!items || items.length === 0) {
      return interaction.reply({ content: '🛒 The shop is empty!', ephemeral: true });
    }
    
    const embed = new EmbedBuilder()
      .setTitle('🛒 Server Shop')
      .setDescription(items.map(item => `**${item.name}** - ${item.price} coins\n${item.description || 'No description'}`).join('\n\n'))
      .setColor('#2b2d31')
      .setTimestamp()
      .setFooter({ text: 'Use /buy [item] to purchase' });
    
    await interaction.reply({ embeds: [embed] });
  },
};
