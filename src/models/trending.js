import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const trendingSchema = new Schema({
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

const Trending = mongoose.model('trends', trendingSchema)

export { Trending }