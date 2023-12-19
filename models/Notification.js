const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  Id: { type: mongoose.Schema.Types.ObjectId },
  org_id: { type: String, required: false },
  campaign_id: { type: String, required: false },
  volunteer_id: { type: String, required: false },
  notes: { type: String, required: false },
});

module.exports = mongoose.model('notification', notificationSchema);
