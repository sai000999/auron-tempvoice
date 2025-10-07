const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    if (!member) {
      return interaction.reply({ content: '❌ Member not found', ephemeral: true });
    }
    
    try {
      await member.kick(reason);
      
      const embed = new EmbedBuilder()
        .setTitle('👢 Member Kicked')
        .setDescription(`${member.user.tag} has been kicked\n**Reason:** ${reason}`)
        .setColor('#ff4040')
        .setTimestamp()
        .setFooter({ text: 'Auron Bot' });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Failed to kick the member', ephemeral: true });
    }
  },
};
