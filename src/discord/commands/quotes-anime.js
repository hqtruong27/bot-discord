import './../../common/discord-helper'
import QuotesService from '../../services/quotesService'
import { Message, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export const data = [
    new SlashCommandBuilder()
        .setName('quotes-anime')
        .setDescription('send quotes anime'),
    new SlashCommandBuilder()
        .setName('q-a')
        .setDescription('send quotes anime')
]

/**
 * @param {Message<boolean> | ChatInputCommandInteraction<CacheType>} interaction
 * @param {String} prefix the string
 */
export const execute = async (interaction, prefix) => {
    if (prefix) await interaction.channel.sendTyping()
    const data = await QuotesService.randomAnime()
    if (data) {
        let {
            quote,
            anime,
            character
        } = data


        const message = `${quote} - ${`${character}`.toString('bold')}\n\n --__${anime}__--`.toString('italic')
        if (prefix) {
            await interaction.channel.send(message)
        } else {
            await interaction.reply(message)
        }

        return true
    }

    return false
}
