const { check, validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  let validationRules = [
    check('org_id').notEmpty().withMessage('Organization id is required'),
    check('volunteer_id').notEmpty().withMessage('Volunteer id is required'),
    check('campaign_id').notEmpty().withMessage('Campaign id is required'),
    check('notes').notEmpty().withMessage('Notes is required')
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