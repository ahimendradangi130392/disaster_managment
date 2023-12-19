const { check, validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  let validationRules = [
    check('org_id').notEmpty().withMessage('Organization id is required'),
    check('event_name').notEmpty().withMessage('Event name is required'),
    check('short_bio').notEmpty().withMessage('Event Short Description  is required'),
    check('from_date').notEmpty().withMessage('From Date is required'),
    check('to_date').notEmpty().withMessage('To Date is required'),
  ]
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