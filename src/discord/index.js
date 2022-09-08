import '../common/discord-helper.js'
import QuotesService from './quotesService.js'
import { Routes, REST, Client, GatewayIntentBits, ActivityType } from 'discord.js'

const prefix = '!'
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
})

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'quotes',
        description: 'Replied a quotes from api',
    },
    {
        name: 'q',
        description: 'Replied a quotes from api',
    },
    {
        name: 'quotes-anime',
        description: 'Replied a quotes from api',
    },
    {
        name: 'q-a',
        description: 'Replied a quotes from api',
    },
    {
        name: 'image',
        description: 'Replied a random image',
    },
]
export default class DiscordService {
    static buildQuotes = async (channel) => {
        await channel.sendTyping()
        const data = await QuotesService.random()

        if (!data) return false
        const { content, author } = data
        channel.send(`${content} - ${`${author}`.toString('bold')}`.toString('italic'))
        return true
    }

    static buildQuotesAnime = async (channel) => {
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
    }

    static sendRandomQuotesToChannel = async () => {
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
            const channel = client.channels.cache.find(x => x.name === 'chung')
            if (channel) {
                switch (randomText) {
                    case 'quotes':
                        success = await this.buildQuotes(channel)
                        break
                    case 'quotes-anime':
                        success = await this.buildQuotesAnime(channel)
                    default:
                        success = true
                        break
                }
            }
        }

        console.log('send quotes to channel success!!')
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()

client.once('ready', async () => {
    console.log('Ready! 🌸🌸🌸')
    client.user.setStatus('idle')
    client.user.setActivity("https://github.com/hqtruong27", {
        type: ActivityType.Playing,
        url: "https://github.com/hqtruong27"
    })
})

client.login(process.env.TOKEN_DISCORD)

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const { commandName, channel } = interaction
    switch (commandName) {
        case 'ping':
            {
                await channel.sendTyping()
                await interaction.reply('Pong!')
                break
            }
        case 'q':
        case 'quotes':
            {
                await DiscordService.buildQuotes(channel)
                break
            }
        case 'q-a':
        case 'quotes-anime':
            {
                await DiscordService.buildQuotesAnime(channel)
                break
            }
        default:
            break
    }
})

client.on('messageCreate', async (message) => {

    let { content, channel, } = message
    if (!content.startsWith(prefix) || message.author.bot) return

    const args = content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()


    if (!client.commands.get(command)) return

    client.commands.get(command).execute(message)
})