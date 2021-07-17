import dotenv from 'dotenv'
import { Article } from './src/models/article.js'
import { Trending } from './src/models/trending.js'
import fetch from 'node-fetch'

const arFetch = async (term, schema) => {
    const envFile = dotenv.config()
    const newsAPIToken = process.env.NEWS || envFile.NEWS
    let articles
    await fetch(`https://newsapi.org/v2/top-headlines?${term}&apiKey=${newsAPIToken}`)
    .then((res) => res.json())
    .then((json) => {
        articles = json.articles
    })
    .catch((err) => console.error(err))
    if (articles[0]) {
        articles.forEach((article, index) => {
            if (article.content) {
                setTimeout(() => {
                    schema.findOne({ title: article.title })
                    .then((results) => {
                        if (!results) {
                            const newArticle = new schema({
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
            }
        })
    }
    setTimeout(dailyFetch, 1.296e+8)
}

const dailyFetch = () => {
    arFetch('country=us', Article)
    setTimeout(() => {
        const toSearchTerms = [
            'Murder', 'Iran', 'Gretchen Whitmer', 'World Health Organization', 'Gavin Newsom',
            'Amazon', 'Instagram', 'Nancy Pelosi', 'IRS', 'The US House of Representatives', 'Cowboys',
            'Coronavirus Task Force', 'Facebook', 'Obama', 'Unemployment', 'Chicago', 'Patriots', 'Basketball',
            'Kobe Bryant', 'Twitter', 'Hand Sanitizer', 'Fox', 'GOP', 'Centers for Disease Control', 'Anthony Fauci',
            'Impeachment', 'China', 'Masks', 'Meghan Markle', 'Supreme Court', 'India', 'Racism', 'Wuhan'
        ]
        toSearchTerms.forEach((term, index) => {
            setTimeout(() => {
                arFetch(`q=${term.toLowerCase()}`, Trending)
            }, 300000 * index)
        })
    }, 1.8e+6)
}

export { dailyFetch }