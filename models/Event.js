const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  Id: { type: mongoose.Schema.Types.ObjectId },
  org_id: { type: String, required: false },
  event_name: { type: String, required: false },
  short_bio: { type: String, required: false },
  from_date: { type: String, required: false },
  to_date: { type: String, required: false },
});

module.exports = mongoose.model('event', eventSchema);
