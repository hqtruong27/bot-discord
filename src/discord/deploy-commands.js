import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { Routes, REST } from 'discord.js'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const path = './commands/'
const commands = []
const commandFiles = fs.readdirSync(join(__dirname, path)).filter(file => file.endsWith('.js'))

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);
(async function () {
    try {

        (await Promise.all(
            commandFiles.map(
                async file => await import(`${path + file}`)
            )
        ))
            .map(x => {
                const { data } = { ...x }
                if (data)
                    data.map(
                        x => commands.push(x)
                    )
            })

        console.log('Started refreshing application commands.')

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

        console.log('Successfully reloaded application commands.')
    } catch (error) {
        console.log({ error })
    }
})()
