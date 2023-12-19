const express = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const SendNotification = require('../middleware/SendNotification');
const router = express.Router();

// Search Volunter by category with his details
router.get(
  '/filters',
  authMiddleware,
  async (req, res) => {
    try {
      const { skill_id } = req.query;
      const records = await User.find({ skills: { $in: [skill_id] }, 'user_type': 2 }, { fullname: 1, gender: 1, dob: 1, phone: 1, address: 1, city: 1, state: 1, zip: 1, skills: 1, volunteer_experience: 1, languages_spoken: 1, emergency_contact: 1, short_bio: 1 });
      res.json({ msg: 'Volunter get successfully', data: records });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
);

// Send notification to the select volunter
router.post(
  '/send_notification',
  SendNotification,
  authMiddleware,
  async (req, res) => {
    try {
      const { org_id, campaign_id, volunteer_id, notes } = req.body;
      const formattedVolunteerId = volunteer_id.replace(/'/g, '"');
      const volunteerIdArray = JSON.parse(formattedVolunteerId);
      await Promise.all(volunteerIdArray.map(async (element, index) => {
        let data = {
          org_id: org_id,
          volunteer_id: element,
          campaign_id: campaign_id,
          notes: notes
        }
        let notification = new Notification(data);
        await notification.save();
      }));
      res.json({ msg: 'Notification Sent successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
);

// Get Vplunteer Notification list

router.get(
  '/get_notification',
  async (req, res) => {
    try {
      const { volunteer_id } = req.query;
      const eventInfo = await Notification.aggregate([
        { $match: { volunteer_id: volunteer_id } },
        {
          $lookup: {
            from: 'events',
            localField: 'id',
            foreignField: 'campaign_id',
            as: 'events'
          }
        },
        {
          $addFields: {
            events: {
              $filter: {
                input: '$events',
                as: 'event',
                cond: { $eq: ['$$event.campaign_id', '$id'] }
              }
            }
          }
        }
      ]);

      res.json({ msg: 'Notification get successfully', eventInfo });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  })

module.exports = router;