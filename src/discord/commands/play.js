import './../../common/discord-helper'
import {
    Message,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Collection

} from 'discord.js'
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayer,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    VoiceConnection,
    demuxProbe
} from '@discordjs/voice'
// import 'ffmpeg-static'
// import opus from '@discordjs/opus'
// import _sodium from 'libsodium-wrappers'
import {
    stream,
    search
} from 'play-dl'
import { QueryType } from 'discord-player'
const queue = new Collection()
export const data = [
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('play a music')
        .addStringOption((option) =>
            option
                .setName('track')
                .setDescription('print a link ')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause playing current song')
]

/**
 * @param {Message<boolean> | ChatInputCommandInteraction<CacheType>} interaction
 * @param {AudioPlayer} player the string
 */
export const execute = async (interaction, player) => {
    // let send
    // if (prefix) {
    //     send = (message) => interaction.channel.send(message)
    //     await interaction.channel.sendTyping()
    // } else {
    //     send = (message) => interaction.reply(message)
    // }

    // const { prefix, query, commandName } = interaction

    // if (!interaction.member.voice.channelId) {
    //     return interaction.channel.send('please join a voice channel.')
    // }

    // if (!query) {
    //     return interaction.channel.send('Please enter song name or link youtube.')
    // }

    // const queue = interaction.client.player.createQueue(interaction.guild,
    //     {
    //         metadata: {
    //             channel: interaction.channel,
    //         },
    //         leaveOnEnd: false,
    //         leaveOnStop: true,
    //         leaveOnEmpty: true,
    //         initialVolume: 80,
    //         autoSelfDeaf: false,
    //         leaveOnEmptyCooldown: 1000 * 60
    //     })

    // try {
    //     if (!queue.connection)
    //         await queue.connect(interaction.member.voice.channel)
    // } catch {
    //     queue.destroy()
    //     return await interaction.reply({
    //         content: "❌ | Could not join voice channel",
    //         ephemeral: true,
    //     })
    // }


    // const { track, tracks, playlist } = await interaction.client.player.search(query, {
    //     requestedBy: interaction.user,
    //     searchEngine: QueryType.AUTO,
    // })

    // const playEmbed = new EmbedBuilder()
    //     .setColor('Random')
    //     .setTitle(`🎶 | New ${playlist ? "playlist" : "song"} Added to queue`)

    // if (!playlist) {
    //     const tr = tracks[0]
    //     playEmbed.setThumbnail(tr.thumbnail)
    //     playEmbed.setDescription(`${tr.title}`)
    // }


    // if (!queue.playing) {
    //     playlist
    //         ? queue.addTracks(tracks)
    //         : queue.play(tracks[0])

    //     await interaction.reply({ embeds: [playEmbed] })
    // } else if (queue.playing) {
    //     playlist
    //         ? queue.addTracks(tracks)
    //         : queue.addTrack(tracks[0])
    //     await interaction.reply({
    //         embeds: [playEmbed],
    //     })

    //     const queuePlaying = queue.nowPlaying()
    //     await interaction.reply('Now playing: ' + queuePlaying.title)
    // }

    // interaction.client.player.on("finish", (track) => {
    //     console.log({ fi: track })
    // })

    const { prefix, query, commandName } = interaction
    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guildId,
        selfMute: false,
        selfDeaf: false,
        adapterCreator: interaction.guild.voiceAdapterCreator
    })

    switch (commandName) {
        case 'play':
            if (!interaction.member.voice.channelId) {
                return interaction.channel.send('please join a voice channel.')
            }

            if (!query) {
                return interaction.channel.send('Please enter song name or link youtube.')
            }

            await play(player, connection, interaction)
            break
    }
}

const probeAndCreateResource = async (readableStream) => {
    const { stream, type } = await demuxProbe(readableStream)
    return createAudioResource(stream, { inputType: type })
}

/**
 *
 * @param {AudioPlayer} player
 * @param {VoiceConnection} connection
 * @param {Message<boolean> | ChatInputCommandInteraction<CacheType>} interaction
 */
const play = async (player, connection, interaction) => {
    const { prefix, query, commandName } = interaction
    const videos = await search(query, {
        source: {
            youtube: 'video'
        },
        limit: 10,
    })

    const video = videos[0] ?? null
    const queueServer = queue.get(interaction.guildId) ?? { songs: [], playing: false }
    if (video) {
        const { url, title } = video

        let song = {
            title: title,
            url: url
        }

        if (!queueServer.playing) {
            queueServer.songs.push(song)

            const yt = await stream(song.url, {
                discordPlayerCompatibility: true
            })

            const resource = await probeAndCreateResource(yt.stream)
            player.play(resource)
            connection.subscribe(player)
            // player.on(AudioPlayerStatus.Playing, async () => {
            //     queueServer.playing = true
            //     await interaction.channel.send("Now playing: " + song.title)
            // })

            player.on('stateChange', async (oldState, newState) => {
                if (newState.status === AudioPlayerStatus.Idle) {
                    console.log('next song')
                    queueServer.playing = false
                    await play(player, connection, interaction)
                }
                if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
                    if (!queueServer.pause) {
                        console.log('finish')
                        queueServer.playing = false
                    }
                }
                if (newState.status === AudioPlayerStatus.Playing) {
                    console.log('playing')
                    queueServer.playing = true
                    await interaction.channel.send("Now playing: " + song.title)
                }
            })
            queue.set(interaction.guildId, queueServer)
        }
        else {
            queueServer.songs.push(song)
            queue.set(interaction.guildId, queueServer)
            console.log({ queueServer })
        }
    }
}