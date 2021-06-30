import dotenv from 'dotenv'
const envFile = dotenv.config()

const port = envFile.PORT || process.env.PORT

export { port }
