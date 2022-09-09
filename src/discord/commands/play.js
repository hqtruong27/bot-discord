import './../../common/discord-helper'
import {
    Message,
    SlashCommandBuilder,
    ChatInputCommandInteraction,

} from 'discord.js'
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior
} from '@discordjs/voice'

export const data = [
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('play a music')
        .addStringOption((option) =>
            option
                .setName('items')
                .setDescription('print a link ')
                .setRequired(true))
]

/**
 * @param {Message<boolean> | ChatInputCommandInteraction<CacheType>} interaction
 * @param {String} prefix the string
 */
export const execute = async (interaction, prefix, options) => {
    // let send
    // if (prefix) {
    //     send = (message) => interaction.channel.send(message)
    //     await interaction.channel.sendTyping()
    // } else {
    //     send = (message) => interaction.reply(message)
    // }
    console.log(interaction.guild)
    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
    })

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    })

    const resource = createAudioResource('http://m8.music.126.net/20220909172608/c64c93e3dd44043ef72708d7b656986a/yyaac/af9d/f31d/4f48/273048bb3118f433e9fe46c2c878b36e.m4a')
    player.play(resource)

    connection.subscribe(player)

    return false
}
