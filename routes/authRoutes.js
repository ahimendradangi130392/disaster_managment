const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const AddVolunteerMiddleware = require('../middleware/AddVolunteerMiddleware');

const router = express.Router();

// User login
router.post(
  '/login',
  [
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required'),
    check('user_type').notEmpty().withMessage('User Type is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, user_type } = req.body;
      const user = await User.findOne({ 'email': email, 'user_type': user_type });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      var salt = bcrypt.genSaltSync(10);
      //var new_password = bcrypt.hashSync(password, salt);
      const compare = bcrypt.compareSync(password, user.password); // true

      if (!compare) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: 8400 }, // 2 hour
        (error, token) => {
          if (error) throw error;
          res.json({ 'token': token, "data": user });
        }
      );
    } catch (error) {
      logger.error('Error logging in:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);


// Add ORG/Volunteer with his details
router.post(
  '/signup',
  AddVolunteerMiddleware,
  async (req, res) => {
    try {
      if (req.body.user_type == 1) {
        const { organization_name, organization_type, organization_address, organization_city, organization_state, organization_zip, organization_phone, organization_mission, organization_year_founded, organization_employees, organization_focusarea, organization_supports, organization_id, email, password, user_type } = req.body;

        const isOrgExists = await User.find({ 'email': email, 'user_type': 1 });
        if (isOrgExists.length > 0) {
          res.status(409).json({ msg: 'Organization Already Exists' });
        }

        var salt = bcrypt.genSaltSync(10);
        var new_password = bcrypt.hashSync(password, salt);
        // const compare = bcrypt.compareSync('123456', new_password); // true
        // console.log('password-->', compare);
        // return true;
        const newOrg = new User({
          user_type: user_type,
          organization_name: organization_name,
          organization_type: organization_type,
          organization_address: organization_address,
          organization_city: organization_city,
          organization_state: organization_state,
          organization_zip: organization_zip,
          organization_phone: organization_phone,
          organization_mission: organization_mission,
          organization_year_founded: organization_year_founded,
          organization_employees: organization_employees,
          organization_focusarea: organization_focusarea,
          organization_supports: organization_supports,
          organization_id: organization_id,
          email: email,
          password: new_password
        });
        // Save the new employee to the database
        await newOrg.save();
        res.json({ msg: 'Organization Registered successfully' });

      }
      else if (req.body.user_type == 2) {
        const { fullname, gender, dob, phone, address, city, state, zip, skills, volunteer_experience, languages_spoken, emergency_contact, short_bio, email, password, user_type } = req.body;
        const isVolExists = await User.find({ 'email': email, 'user_type': 2 });
        if (isVolExists.length > 0) {
          res.status(409).json({ msg: 'Volunteer Already Exists' });
        }
        var salt = bcrypt.genSaltSync(10);
        var new_password = bcrypt.hashSync(password, salt);
        const newOrg = new User({
          user_type: user_type,
          fullname: fullname,
          gender: gender,
          dob: dob,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zip: zip,
          skills: JSON.parse(skills),
          volunteer_experience: volunteer_experience,
          languages_spoken: languages_spoken,
          emergency_contact: emergency_contact,
          short_bio: short_bio,
          email: email,
          password: new_password
        });
        // Save the new employee to the database
        await newOrg.save();
        res.json({ msg: 'volunteer Registered successfully' });

      }
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
);

module.exports = router;
