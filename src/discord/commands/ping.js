import { Message, SlashCommandBuilder } from 'discord.js'

export const data = [new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')]

/**
 * @param {Message<boolean>} interaction
 * @param {String} prefix the string
 */
export const execute = async (interaction, prefix) => {
    await interaction.channel.sendTyping()
    !prefix
        ? await interaction.reply('Pong!')
        : await interaction.channel.send('Pong!')
}
