require('dotenv').config()
const mongoose = require('mongoose')
const mongoPath = process.env.MONGO_URI

module.exports = async () => {
  mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
}