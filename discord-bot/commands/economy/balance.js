const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check balance for')),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    
    // Get or create user balance
    let { data } = await supabase
      .from('economy_config')
      .select('*')
      .eq('guild_id', interaction.guild.id)
      .eq('user_id', user.id)
      .single();
    
    if (!data) {
      await supabase
        .from('economy_config')
        .insert({
          guild_id: interaction.guild.id,
          user_id: user.id,
          balance: 0,
          level: 1,
          xp: 0
        });
      data = { balance: 0, level: 1, xp: 0 };
    }
    
    const embed = new EmbedBuilder()
      .setTitle('💰 Balance')
      .setDescription(`${user}'s balance: **${data.balance}** coins\n**Level:** ${data.level}\n**XP:** ${data.xp}`)
      .setColor('#2b2d31')
      .setTimestamp()
      .setFooter({ text: 'Auron Economy' });
    
    await interaction.reply({ embeds: [embed] });
  },
};
