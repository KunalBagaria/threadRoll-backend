import article from 'article-parser'
const { extract } = article

const replacePeriods = (content) => {
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '.' && (content[i + 1] !== ' ')) {
            content.substring(0, i) + ' ' + content.substring(i + 1);
        }
    }
}

const extractArticle = async (link) => {
    try {
        const article = await extract(link)
        let reg = /(<([^>]+)>)/ig;
        article['content'] = article['content'].replace(reg, "");
        article['content'] = article['content'].replace(/\\/g, "");
        article['content'] = replacePeriods(article['content']);
        return article
    } catch (e) {
        console.log(e)
    }
}

export default extractArticle