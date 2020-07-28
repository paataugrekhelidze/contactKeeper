const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    body('name', 'Please add name').notEmpty(),
    body('email', ' Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // mongoose function to check if the data exists using email variable
      // using User model to find an account
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      // using User model to create new User
      user = new User({
        name,
        email,
        password,
      });

      // encrypt password
      // 10 - determines how secure salt is
      const salt = await bcrypt.genSalt(10);

      // mix in password and salt for extra security and then generate hash
      user.password = await bcrypt.hash(password, salt);

      // save data in mongodb
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      // generate a web token with user.id and pass it to client
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// exports a router
module.exports = router;
