const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = () => {
  mongoose
    .connect(db, {
      // to avoid conflicts during connection
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
};

// commonjs format
// export default in es2015+ format
module.exports = connectDB;
