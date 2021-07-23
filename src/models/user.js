import mongoose from 'mongoose'
const Schema = mongoose.Schema


// write a user schema that has a userId and an array of article objects
const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    articles: [String]
})

const User = mongoose.model('User', userSchema)

export { User }