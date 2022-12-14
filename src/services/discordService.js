import '../common/discord-helper.js'
import QuotesService from './quotesService.js'
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

    static sendRandomQuotesToChannel = async (client) => {
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
            console.log(channels)
            if (channels) {
                for (const channel of channels) {
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
        }

        console.log('send quotes to channel success!!')
    }
}

// const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);

// (async () => {
//     try {
//         console.log('Started refreshing application (/) commands.')

//         await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

//         console.log('Successfully reloaded application (/) commands.')
//     } catch (error) {
//         console.error(error)
//     }
// })()

// client.once('ready', async () => {
//     console.log('Ready! ????????????')
//     client.user.setStatus('idle')
//     client.user.setActivity("https://github.com/hqtruong27", {
//         type: ActivityType.Playing,
//         url: "https://github.com/hqtruong27"
//     })
// })

// client.login(process.env.TOKEN_DISCORD)

// client.on('interactionCreate', async (interaction) => {
//     if (!interaction.isChatInputCommand()) return

//     const { commandName, channel } = interaction
//     switch (commandName) {
//         case 'ping':
//             {
//                 await channel.sendTyping()
//                 await interaction.reply('Pong!')
//                 break
//             }
//         case 'q':
//         case 'quotes':
//             {
//                 await DiscordService.buildQuotes(channel)
//                 break
//             }
//         case 'q-a':
//         case 'quotes-anime':
//             {
//                 await DiscordService.buildQuotesAnime(channel)
//                 break
//             }
//         default:
//             break
//     }
// })

// client.on('messageCreate', async (message) => {
//     let {
//         content,
//         channel,
//         command = content.substring(1),
//     } = message

//     if (!content.startsWith(prefix) || message.author.bot) return

//     // const messages = await channel.messages.fetch({ limit: 2 })
//     // console.log({ messages })
//     // const lastMessage = messages.last()

//     // if (lastMessage.author.id == message.author.id && lastMessage.content == content) {
//     //     await channel.send('so fast wait for 5s!')
//     //     return
//     // }
//     const filter_msg = msg => msg.content == content && msg.author == message.author
//     const msgs = await channel.awaitMessages({
//         filter: filter_msg,
//         time: 4000
//     })

//     console.log(msgs)
//     if (msgs.size > 0) {
//         await channel.send('so fast wait for 5s!')
//         return
//     }

//     switch (command) {
//         case 'ping':
//             {
//                 await channel.sendTyping()
//                 await channel.send('Pong!')
//                 break
//             }
//         case 'q':
//         case 'quotes':
//             {
//                 await DiscordService.buildQuotes(channel)
//                 break
//             }
//         case 'q-a':
//         case 'quotes-anime':
//             {
//                 await DiscordService.buildQuotesAnime(channel)
//                 break
//             }
//         default:
//             break
//     }
// })