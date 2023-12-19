const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Id: { type: mongoose.Schema.Types.ObjectId },
  user_type: { type: String, required: false },
  fullname: { type: String, required: false },
  gender: { type: String, required: false },
  dob: { type: String, required: false },
  email: { type: String, required: false },
  password: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zip: { type: String, required: false },
  skills: [{ type: String, required: false }],
  volunteer_experience: { type: String, required: false },
  languages_spoken: { type: String, required: false },
  emergency_contact: { type: String, required: false },
  short_bio: { type: String, required: false },
  organization_name: { type: String, required: false },
  organization_type: { type: String, required: false },
  organization_address: { type: String, required: false },
  organization_city: { type: String, required: false },
  organization_state: { type: String, required: false },
  organization_zip: { type: String, required: false },
  organization_phone: { type: String, required: false },
  organization_mission: { type: String, required: false },
  organization_year_founded: { type: String, required: false },
  organization_employees: { type: String, required: false },
  organization_focusarea: { type: String, required: false },
  organization_supports: { type: String, required: false },
  organization_id: { type: String, required: false }

});

module.exports = mongoose.model('user', userSchema);
