const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // check if not token
  if (!token) {
    // unauthorized
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    // once verified, payload object is returned to variable 'decoded'
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    // passes modified req object to next middleware
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
