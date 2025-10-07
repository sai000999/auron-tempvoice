const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item from the shop')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name to buy')
        .setRequired(true)),
  
  async execute(interaction) {
    const itemName = interaction.options.getString('item');
    
    // Get item
    const { data: item } = await supabase
      .from('shop_items')
      .select('*')
      .eq('guild_id', interaction.guild.id)
      .ilike('name', itemName)
      .single();
    
    if (!item) {
      return interaction.reply({ content: '❌ Item not found!', ephemeral: true });
    }
    
    // Get user balance
    const { data: userData } = await supabase
      .from('economy_config')
      .select('*')
      .eq('guild_id', interaction.guild.id)
      .eq('user_id', interaction.user.id)
      .single();
    
    if (!userData || userData.balance < item.price) {
      return interaction.reply({ content: '❌ Insufficient balance!', ephemeral: true });
    }
    
    // Deduct coins
    await supabase
      .from('economy_config')
      .update({ balance: userData.balance - item.price })
      .match({ guild_id: interaction.guild.id, user_id: interaction.user.id });
    
    // Give role if applicable
    if (item.role_id) {
      const role = interaction.guild.roles.cache.get(item.role_id);
      if (role) {
        await interaction.member.roles.add(role);
      }
    }
    
    const embed = new EmbedBuilder()
      .setTitle('✅ Purchase Successful')
      .setDescription(`You bought **${item.name}** for ${item.price} coins!`)
      .setColor('#43b581')
      .setTimestamp()
      .setFooter({ text: 'Auron Economy' });
    
    await interaction.reply({ embeds: [embed] });
  },
};
