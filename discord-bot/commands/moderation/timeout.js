const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    if (!member) {
      return interaction.reply({ content: '❌ Member not found', ephemeral: true });
    }
    
    try {
      await member.timeout(duration * 60 * 1000, reason);
      
      const embed = new EmbedBuilder()
        .setTitle('⏰ Member Timed Out')
        .setDescription(`${member.user.tag} has been timed out for ${duration} minutes\n**Reason:** ${reason}`)
        .setColor('#ff4040')
        .setTimestamp()
        .setFooter({ text: 'Auron Bot' });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Failed to timeout the member', ephemeral: true });
    }
  },
};
