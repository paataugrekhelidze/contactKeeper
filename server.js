// without babel, we cant use import syntax
// this is an alternative to import
// this is older, commonjs syntax
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

//Connect Database
connectDB();

const app = express();

// Init Middleware
// allows reading for an incoming body data
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// Serve static(react) assets in production
// if the environment is in production
if (process.env.NODE_ENV === 'production') {
  // load static folder
  app.use(express.static('client/build'));
  // get anything that are not the above routes
  // positioning this below other routes matters
  // _dirname = current directory
  // ./client/build/index.html
  // if it hits any route other than those above then index.html will be loaded
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
// port to listen on
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
