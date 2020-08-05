import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';
const ContactForm = () => {
  const contactContext = useContext(ContactContext);
  const { current, addContact, clearCurrent, updateContact } = contactContext;
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal',
  });
  const { name, email, phone, type } = contact;
  useEffect(() => {
    if (current !== null) {
      setContact(current);
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal',
      });
    }
  }, [current]);

  // copy rest of the state values from contact using ...contact
  const onChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  // clear edit
  const clearAll = () => {
    clearCurrent();
  };
  // when submit is executed, add current state of contact to context state
  const onSubmit = (e) => {
    e.preventDefault();
    // if current is not null then we are updating existing contact
    if (current === null) {
      addContact(contact);
    } else {
      updateContact(contact);
    }
    // reset all values to default
    setContact({
      name: '',
      email: '',
      phone: '',
      type: 'personal',
    });
    clearCurrent();
  };
  return (
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
        {current ? 'Edit Contact' : 'Add Contact'}
      </h2>
      <input
        type='text'
        name='name'
        placeholder='Name'
        value={name}
        onChange={onChange}
      />
      <input
        type='email'
        name='email'
        placeholder='Email'
        value={email}
        onChange={onChange}
      />
      <input
        type='text'
        name='phone'
        placeholder='Phone'
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      {/* property name links radio buttons to each other */}
      <input
        type='radio'
        name='type'
        value='personal'
        checked={type === 'personal'}
        onChange={onChange}
      />{' '}
      Personal{' '}
      <input
        type='radio'
        name='type'
        value='professional'
        checked={type === 'professional'}
        onChange={onChange}
      />{' '}
      Professional
      <div>
        <input
          type='submit'
          value={current ? 'Update Contact' : 'Add Contact'}
          className='btn btn-primary btn-block'
        />
      </div>
      {current && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
