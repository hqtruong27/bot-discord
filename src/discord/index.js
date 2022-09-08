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

const __dirname = dirname(fileURLToPath(import.meta.url))
const prefix = '!'
const path = './commands/'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.commands = new Collection()

const commandFiles = fs.readdirSync(join(__dirname, path)).filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = await import(`${path + file}`)
    const { commands } = client
    command.data.map(x => commands.set(x.name, command))
}
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
        await command.execute(interaction, null)
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

    await command.execute(message, prefix)
})

export default client