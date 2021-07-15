import article from 'article-parser'
const { extract } = article

const extractArticle = async (link) => {
    try {
        const article = await extract(link)
        let reg = /(<([^>]+)>)/ig;
        article['content'] = article['content'].replace(reg, "");
        article['content'] = article['content'].replace(/\\/g, "");
        return article
    } catch (e) {
        console.log(e)
    }
}

export default extractArticle