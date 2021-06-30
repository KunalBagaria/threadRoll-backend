import article from 'article-parser'
import sanitize from 'sanitize-html'
const { extract } = article

const extractArticle = async (link) => {
    try {
        const article = await extract(link)
        article['content'] = sanitize(article['content'], {
            allowedTags: []
        })
        return article
    } catch (e) {
        console.log(e)
    }
}

export default extractArticle