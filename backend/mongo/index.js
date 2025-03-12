const mongoose = require('mongoose')

const Blog = require('./models/blog')
const User = require('./models/user')

const config = require('../utils/config')
const logger = require('../utils/logger')

logger.info('Initializing MongoDB connection in backend/mongo/index.js')

const MONGO_URL = config.MONGODB_URI
logger.info('MONGO_URL:', MONGO_URL)

if (!MONGO_URL) {
  logger.error('❌ MONGODB_URI is not set. Check Render environment variables.')
  process.exit(1) // Stop the process if MongoDB URI is missing
}

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose.set('strictQuery', false)

  //logger.info('Connecting to MongoDB ...')
  logger.info(`Connecting to MongoDB at ${MONGO_URL}`)

  mongoose.connect(MONGO_URL)

  mongoose.connection.once('open', () => {
    logger.info('Successfully connected to MongoDB')
  })

  mongoose.connection.on('error', (error) => {
    logger.info('Error connecting to MongoDB:', error)
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost')
  })
}

module.exports = {
  mongoose,
  Blog,
  User,
}
