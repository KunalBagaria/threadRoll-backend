import express from 'express'
import { port } from './src/envConfig.js'
import extractArticle from './src/extract.js'

const app = express()

app.get('/', async (req, res) => {
  res.send(`Hello, what's up? Looks like you've stumbled upon our API. Use it respectfully. Send a GET request to /extract?url=YOUR_URL_HERE to extract your article.`)
})

app.get('/extract', async (req, res) => {
  const article = await extractArticle(req.query.url)
  article ? res.json(article) : res.status(404).send('There was an error, please try again later.')
})

app.listen(port, () => {
  console.log('Listening on port', port)
})
