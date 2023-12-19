const { check, validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  let validationRules = [
    check('user_type').notEmpty().withMessage('User Type is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required')
  ]
  // Check the Volunteer to determine additional validation
  if (req.body.user_type == 2) {
    validationRules.push(check('fullname').notEmpty().withMessage('Full Name is required'));
    validationRules.push(check('gender').notEmpty().withMessage('Gender is required'));
    validationRules.push(check('dob').notEmpty().withMessage('Date of Birth is required'));
    validationRules.push(check('phone').notEmpty().withMessage('Phone number is required'));
    validationRules.push(check('address').notEmpty().withMessage('Address is required'));
    validationRules.push(check('city').notEmpty().withMessage('City is required'));
    validationRules.push(check('state').notEmpty().withMessage('State is required'));
    validationRules.push(check('zip').notEmpty().withMessage('Zip Code is required'));
    validationRules.push(check('skills').notEmpty().withMessage('Skills is required'));
    validationRules.push(check('volunteer_experience').notEmpty().withMessage('Volunteer Experience is required'));
    validationRules.push(check('languages_spoken').notEmpty().withMessage('Languages Spoken is required'));
    validationRules.push(check('emergency_contact').notEmpty().withMessage('Emergency Contact is required'));
    validationRules.push(check('short_bio').notEmpty().withMessage('Short Bio/Introduction is required'));
  } else if (req.body.user_type == 1) {
    // Add organization specific validations if needed
    validationRules.push(check('organization_name').notEmpty().withMessage('Organization Name is required'));
    validationRules.push(check('organization_type').notEmpty().withMessage('Organization Type is required'));
    validationRules.push(check('organization_address').notEmpty().withMessage('Organization Address is required'));
    validationRules.push(check('organization_city').notEmpty().withMessage('Organization City is required'));
    validationRules.push(check('organization_state').notEmpty().withMessage('Organization State is required'));
    validationRules.push(check('organization_zip').notEmpty().withMessage('Organization zip is required'));
    validationRules.push(check('organization_phone').notEmpty().withMessage('Organization phone is required'));
    validationRules.push(check('organization_mission').notEmpty().withMessage('Organization mission is required'));
    validationRules.push(check('organization_year_founded').notEmpty().withMessage('Organization_year_founded is required'));
    validationRules.push(check('organization_employees').notEmpty().withMessage('Organization number employees is required'));
    validationRules.push(check('organization_focusarea').notEmpty().withMessage('Organization focus area is required'));
    validationRules.push(check('organization_supports').notEmpty().withMessage('Organization supports is required'));
    validationRules.push(check('organization_id').notEmpty().withMessage('Organization id is required'));
  }

  // Run validation
  Promise.all(validationRules.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return res.status(400).json({ error: firstError });
      }
      next();
    })
    .catch(err => {
      res.status(500).json({ error: 'Server error', details: err });
    });

};