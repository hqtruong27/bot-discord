import './../../common/discord-helper'
import ImageService from '../../services/imageService'
import {
    Message,
    SlashCommandBuilder,
    ChatInputCommandInteraction
} from 'discord.js'

export const data = [
    new SlashCommandBuilder()
        .setName('image')
        .setDescription('send random image')
        .addStringOption((option) =>
            option
                .setName('items')
                .setDescription('Select your item from the list')
                .setRequired(false))
]

/**
 * @param {Message<boolean> | ChatInputCommandInteraction<CacheType>} interaction
 * @param {String} prefix the string
 */
export const execute = async (interaction, prefix, options) => {
    let send
    if (prefix) {
        send = (message) => interaction.channel.send(message)
        await interaction.channel.sendTyping()
    } else {
        send = (message) => interaction.reply(message)
    }

    const data = await ImageService.random(options)
    if (data) {
        let { url } = data

        await send(url)
        return true
    }

    return false
}
