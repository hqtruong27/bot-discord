import express from 'express'
import https from 'https'
import fs from 'fs'
import bodyParser from 'body-parser'
import './src/services/discordService'
import './src/task/background'
import QuotesService from './src/services/quotesService'

const PORT = parseInt(process.env.PORT) || 3000
const HOST = process.env.HOST || '127.0.0.1'
const sslOptions = {
    cert: fs.readFileSync('./ssl/cert.pem'),
    key: fs.readFileSync('./ssl/key.pem')
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT + 1, HOST)
https.createServer(sslOptions, app)
    .listen(PORT, HOST, () => {
        console.info(`Server is running at https://${HOST}:${PORT} and http://${HOST}:${(PORT + 1)}`)
    })

app.get('/quotes-anime', async (req, res) => {
    const response = await QuotesService.randomAnime()
    res.status(200).json(response)
})

app.get('/quotes', async (req, res) => {
    const response = await QuotesService.random()
    res.status(200).json(response)
})