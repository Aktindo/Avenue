require("dotenv").config();
const mongoose = require("mongoose");
const mongoPath = process.env.MONGO_URI;

module.exports = async () => {
  mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};
