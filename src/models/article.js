import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    published: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: false
    },
    source: {
        type: String,
        required: false
    }
}, { timeStamps: true })

const Article = mongoose.model('articles', articleSchema)

export { Article }