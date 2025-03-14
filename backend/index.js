const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')

const PORT = config.PORT
const NODE_ENV = config.NODE_ENV

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('NODE_ENV:', NODE_ENV)

  if (NODE_ENV === 'development') {
    console.log(`http://localhost:${PORT}`)
  }
})
