import article from 'article-parser'
const { extract } = article

const replacePeriods = (content) => {
    let finalContent = content
    for (let i = 0; i < finalContent.length; i++) {
        if (finalContent[i] === '.' && (finalContent[i + 1] !== ' ')) {
            finalContent = finalContent.substring(0, i) + '. ' + finalContent.substring(i + 1);
        }
    }
    return finalContent
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