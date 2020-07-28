const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contacts');

// @route     GET api/contacts
// @desc      Get all contacts that are related to the user. user info provided through token
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// @route     POST api/contacts
// @desc      Add new contact. user it is added under is provided through token as part of the data when saved in mongodb
// @access    Private
router.post(
  '/',
  // list can have both auth middleware and validation checks passed in as separate elements
  [auth, [body('name', 'Name is required').notEmpty()]],
  async (req, res) => {
    // use express-validator function to check errors returned from client
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // if errors then print status 400 with error message in array format
      return res.status(400).json({ error: error.array() });
    }
    // if no errors then pull out data from client request
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        // remember that auth middleware defines user id
        user: req.user.id,
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  // if any of the following info was provided then assign to a new object
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    // req.params.id holds value of /:id, similar to props.match.login
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    // make sure only the user can make updates to its contacts
    // contact.user holds a value of the owner who holds accounts like this
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields }, //param1 - update with contactFields values
      { new: true } //param2 - create new if not exists
    );
    res.json(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // req.params.id holds value of /:id, similar to props.match.login
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    // make sure only the user can delete its contacts
    // contact.user holds a value of the owner who holds accounts like this
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Contact Removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// exports a router
module.exports = router;
