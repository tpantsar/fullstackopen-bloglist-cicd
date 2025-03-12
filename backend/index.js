const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')

const mongo = require('./mongo')
console.log('mongo.Blog:', mongo.Blog)
console.log('mongo.User:', mongo.User)

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('NODE_ENV:', config.NODE_ENV)
})
