import dotenv from 'dotenv'
import { Article } from './src/models/article.js'
import fetch from 'node-fetch'

const dailyFetch = async () => {
    const envFile = dotenv.config()
    const newsAPIToken = process.env.NEWS || envFile.NEWS
    let articles
    await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPIToken}`)
    .then((res) => res.json())
    .then((json) => {
        articles = json.articles
    })
    .catch((err) => console.error(err))
    if (articles[0]) {
        articles.forEach((article, index) => {
            setTimeout(() => {
                Article.findOne({ title: article.title })
                .then((results) => {
                    if (!results) {
                        const newArticle = new Article({
                            url: article.url,
                            title: article.title,
                            description: article.description ? article.description : '',
                            content: article.content || (article.description ? article.description : ''),
                            image: article.urlToImage ? article.urlToImage : '',
                            published: article.publishedAt ? article.publishedAt : '',
                            author: article.author ? article.author : '',
                            source: article.source.name ? article.source.name : ''
                        })
                        newArticle.save()
                            .then((results) => console.log(results))
                            .catch((err) => console.error(err))
                    } else {
                        console.log(`Skipping article (${article.title}) \n because it already exists`)
                    }
                })
                .catch((err) => console.error(err))
            }, index * 5000)
        })
    }
    setTimeout(dailyFetch, 1.296e+8)
}

export { dailyFetch }