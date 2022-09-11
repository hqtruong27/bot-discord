import './deploy-commands'
import '../common/discord-helper.js'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'node:path'
import {
    Client,
    Collection,
    GatewayIntentBits,
    ActivityType
} from 'discord.js'
import {
    createAudioPlayer,
    NoSubscriberBehavior,
} from '@discordjs/voice'
import QuotesService from '../services/quotesService'
import { Player } from 'discord-player'

const __dirname = dirname(fileURLToPath(import.meta.url))
const prefix = '!'
const path = './commands/'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.commands = new Collection()
// client.queue = new Collection()
client.player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
})

const commandFiles = fs.readdirSync(join(__dirname, path)).filter(file => file.endsWith('.js'));

(await Promise.all(
    commandFiles.map(
        async file => await import(`${path + file}`)
    )
))
    .map(command => {
        const { data } = { ...command }
        if (data)
            data.map(
                x => client.commands.set(x.name, command)
            )
    })

client.login(process.env.TOKEN_DISCORD)
client.once('ready', async () => {
    console.log('Ready! 🌸🌸🌸')
    client.user.setStatus('idle')
    client.user.setActivity("https://github.com/hqtruong27", {
        type: ActivityType.Playing,
        url: "https://github.com/hqtruong27"
    })
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({
            ephemeral: true,
            content: 'There was an error while executing this command!',
        })
    }
})

client.on('messageCreate', async (message) => {
    const { content, author } = message
    if (!content.startsWith(prefix) || author.bot) return

    const args = content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = client.commands.get(commandName)
    if (!command) return

    message.prefix = prefix
    message.query = args?.join(' ')
    message.commandName = commandName
    await command.execute(message, client.player)
})

export const discord = {
    buildQuotes: async (channel) => {
        await channel.sendTyping()
        const data = await QuotesService.random()

        if (!data) return false
        const { content, author } = data
        channel.send(`${content} - ${`${author}`.toString('bold')}`.toString('italic'))
        return true
    },

    buildQuotesAnime: async (channel) => {
        await channel.sendTyping()
        const data = await QuotesService.randomAnime()
        if (data) {
            let {
                quote,
                anime,
                character
            } = data

            channel.send(`${quote} - ${`${character}`.toString('bold')}\n\n --__${anime}__--`.toString('italic'))
            return true
        }

        return false
    },

    sendRandomQuotesToChannel: async () => {
        if (!client.isReady()) {
            console.log('bot not login')
            return
        }

        const arr = ['quotes', 'quotes-anime']
        let success = false
        while (!success) {
            const random = Math.floor(Math.random() * arr.length)
            const randomText = arr[random]
            console.log(random)
            arr.splice(random, 1)
            console.log(`Remaining: ${JSON.stringify(arr)} \n`)
            const channels = client.channels.cache.filter(x => x.name === 'chung')
            if (channels) {
                await Promise.all(
                    channels.map(async (channel) => {
                        //const msgs = (await channel.messages.fetch()).filter(x => x.author.id == client.user.id)
                        switch (randomText) {
                            case 'quotes':
                                success = await discord.buildQuotes(channel)
                                break
                            case 'quotes-anime':
                                success = await discord.buildQuotesAnime(channel)
                            default:
                                success = true
                                break
                        }
                    })
                )
            }
        }

        console.log('send quotes to channel success!!')
    }
}