import express from 'express'
import { port } from './src/envConfig.js'
import { dailyFetch } from './daily.js'
import { Article } from './src/models/article.js'
import extractArticle from './src/extract.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const app = express()
const envFile = dotenv.config()
const mongoURL = process.env.MONGO_URL || envFile.MONGO_URL

app.get('/', async (req, res) => {
  res.send(`Hello, what's up? Looks like you've stumbled upon our API. Use it respectfully. Send a GET request to /extract?url=YOUR_URL_HERE to extract your article.`)
})

app.get('/extract', async (req, res) => {
  const article = await extractArticle(req.query.url)
  article ? res.json(article) : res.status(404).send('There was an error, please try again later.')
})

app.get('/articles', async (req, res) => {
  const articles = await Article.find({}).limit(50).sort({$natural:-1})
  articles ? res.json(articles) : res.status(404).send('There was an error, please try again later.')
})

app.listen(port, () => {
  console.log('Listening on port', port)
  mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log('Connected to DB')
      setTimeout(dailyFetch, 1.296e+8)

    })
    .catch((err) => console.error(err))
})