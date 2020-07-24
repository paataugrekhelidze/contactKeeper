// without babel, we cant use import syntax
// this is an alternative to import
// this is older, commonjs syntax
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ msg: 'hello world' });
});

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000;
// port to listen on
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
