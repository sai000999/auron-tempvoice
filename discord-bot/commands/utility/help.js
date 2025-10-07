const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display all available commands'),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📚 Auron Bot - Command List')
      .setDescription('Configure everything via the dashboard!')
      .addFields(
        { name: '⚙️ Moderation', value: '`/ban` `/kick` `/timeout`', inline: true },
        { name: '🤖 Automod', value: '`/automod` `/blacklist`', inline: true },
        { name: '🎟️ Tickets', value: '`/ticket-setup`', inline: true },
        { name: '🎙️ Temp VC', value: '`/tempvc-setup`', inline: true },
        { name: '💰 Economy', value: '`/balance` `/shop` `/buy`', inline: true },
        { name: '👋 Welcome', value: '`/welcome`', inline: true },
        { name: '📜 Logging', value: '`/logging`', inline: true },
        { name: '💤 Inactivity', value: '`/monitor`', inline: true },
        { name: '🔧 Utility', value: '`/help` `/ping`', inline: true }
      )
      .setColor('#2b2d31')
      .setTimestamp()
      .setFooter({ text: 'Auron Bot' });
    
    await interaction.reply({ embeds: [embed] });
  },
};
