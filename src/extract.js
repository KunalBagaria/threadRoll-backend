import article from 'article-parser'
import grammarify from 'grammarify'
const { extract } = article

const extractArticle = async (link) => {
    try {
        const article = await extract(link)
        let reg = /(<([^>]+)>)/ig;
        article['content'] = article['content'].replace(reg, "");
        article['content'] = article['content'].replace(/\\/g, "");
        article['content'] = grammarify.clean(article['content']);
        return article
    } catch (e) {
        console.log(e)
    }
}

export default extractArticle