import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import extractArticle from './src/extract.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { port } from './src/envConfig.js'
import { dailyFetch } from './daily.js'
import { Article } from './src/models/article.js'
import { Trending } from './src/models/trending.js'
import { User } from './src/models/user.js'

const app = express()
const envFile = dotenv.config()
const mongoURL = process.env.MONGO_URL || envFile.MONGO_URL

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use(cors())
app.use(limiter)

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

app.get('/trending', async (req, res) => {
  const articles = await Trending.find({}).limit(50).sort({$natural:-1})
  articles ? res.json(articles) : res.status(404).send('There was an error, please try again later.')
})

app.get('/save', async (req, res) => {
  if (req.query.user && req.query._id) {
    console.log(req.query.user, req.query._id)
    User.findOne({ userId: req.query.user }).then((results) => {
      if (results) {
        User.updateOne({ userId: req.query.user }, { $push: { articles: req.query._id } }).then((results) => console.log(results))
      } else {
        const newUser = new User({
          userId: req.query.user,
          articles: [req.query._id]
        })
        newUser.save()
      }
      res.status(200).send('Article saved.')
    }).catch((err) => {
      res.status(500).send('There was an error, please try again later.')
    })
  } else {
    res.status(500).send('There was an error, please try again later.')
  }
})

app.get('/getarticle', async (req, res) => {
  if (req.query.user) {
    User.findOne({ userId: req.query.user })
      .then((user) => {
        Article.find({ '_id': { $in: user.articles } }).sort({$natural:-1})
          .then((results) => {
            results ? res.json(results).status(200) : res.status(404).send('There was an error, please try again later.')
          })
          .catch((err) => console.error(err))
    }).catch((err) => {
      res.status(500).send('There was an error, please try again later.')
    })
  } else {
    res.status(500).send('There was an error, please try again later.')
  }
})

app.get('/savedtrending', async (req, res) => {
  if (req.query.user) {
    User.findOne({ userId: req.query.user })
      .then((user) => {
        Trending.find({ '_id': { $in: user.articles } }).sort({$natural:-1})
          .then((results) => {
            results ? res.json(results).status(200) : res.status(404).send('There was an error, please try again later.')
          })
          .catch((err) => console.error(err))
    }).catch((err) => {
      res.status(500).send('There was an error, please try again later.')
    })
  } else {
    res.status(500).send('There was an error, please try again later.')
  }
})

app.listen(port, () => {
  console.log('Listening on port', port)
  mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log('Connected to DB')
      dailyFetch()
      setInterval(dailyFetch, 1.296e+8)
    })
    .catch((err) => console.error(err))
})