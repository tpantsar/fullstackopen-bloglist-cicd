const mongoose = require('mongoose')

const Blog = require('./models/blog')
const User = require('./models/user')

const config = require('../utils/config')
const logger = require('../utils/logger')

const MONGO_URL = config.MONGODB_URI

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose.set('strictQuery', false)

  //logger.info('Connecting to MongoDB ...')
  logger.info(`Connecting to MongoDB at ${MONGO_URL}`)

  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

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
  Blog,
  User,
}
