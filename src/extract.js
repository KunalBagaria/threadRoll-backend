import article from 'article-parser'
const { extract } = article

const replaceStuff = (content) => {
    let finalContent = content
    const toReplaceStuff = ['.', '?', '|', ';']
    for (let i = 0; i < finalContent.length; i++) {
        if (toReplaceStuff.includes(finalContent[i]) && (finalContent[i + 1] !== ' ')) {
            finalContent = finalContent.substring(0, i + 1) + ' ' + finalContent.substring(i + 1);
        }
    }
    return finalContent
}

const extractArticle = async (link) => {
    try {
        const article = await extract(link)
        article['content'] = article['content'].replace(/(<([^>]+)>)/ig, '');
        article['content'] = article['content'].replace(/\\/g, '');
        article['content'] = replaceStuff(article['content']);
        return article
    } catch (e) {
        console.log(e)
    }
}

export default extractArticle