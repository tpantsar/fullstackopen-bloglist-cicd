require('dotenv').config()

const PORT = process.env.PORT || 3001

// Select MongoDB URI based on the Node environment
// Tests run on a different database than the actual application
const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

const SECRET = process.env.SECRET

const NODE_ENV = process.env.NODE_ENV

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
  NODE_ENV,
}
