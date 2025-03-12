const config = require('./utils/config')
const express = require('express')
const path = require('path')
const app = express()
require('express-async-errors')
const cors = require('cors')
const { mongoose } = require('./mongo')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// Register the route handlers
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Health check
app.get('/health', (req, res) => {
  console.log('health check')
  res.json({ status: 'ok', mongoDB: !!mongoose.connection.readyState })
})

// Serve API routes
app.use('/api', (req, res) => {
  res.json({ message: 'API works!' })
})

if (config.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
