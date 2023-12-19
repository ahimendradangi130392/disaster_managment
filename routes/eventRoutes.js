const express = require('express');
const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const AddEventMiddleware = require('../middleware/AddEventMiddleware');
const router = express.Router();

// Add Event campaign for the organization
router.post(
  '/add_event',
  AddEventMiddleware,
  authMiddleware,
  async (req, res) => {
    try {
      const { org_id, event_name, short_bio, from_date, to_date } = req.body;
      const newEvent = new Event({
        org_id: org_id,
        event_name: event_name,
        short_bio: short_bio,
        from_date: from_date,
        to_date: to_date
      });
      // Save the new employee to the database
      await newEvent.save();
      res.json({ msg: 'Campaign Added successfully' });

    } catch (error) {
      res.status(500).json({ msg: 'Server erro-->', error });
    }
  }
);

// get Event List
router.get(
  '/event_list',
  authMiddleware,
  async (req, res) => {
    try {
      const { org_id } = req.query;
      const records = await Event.find({ org_id: org_id });
      res.json({ msg: 'Event get successfully', data: records });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
);


// update Event 
router.patch(
  '/event_update',
  AddEventMiddleware,
  authMiddleware,
  async (req, res) => {
    try {
      const { event_id, org_id, event_name, short_bio, from_date, to_date } = req.body;
      const eventData = await Event.findById({ org_id: org_id, _id: event_id });
      if (!eventData || eventData.length === 0) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      eventData.org_id = org_id;
      eventData.event_name = event_name;
      eventData.short_bio = short_bio;
      eventData.from_date = from_date;
      eventData.to_date = to_date;
      const result = await eventData.save();
      res.json({ msg: 'Event updated successfully', result });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
);


// delete Event
router.delete(
  '/delete_event/:event_Id',
  authMiddleware,
  async (req, res) => {
    try {
      const event_Id = req.params.event_Id;
      const result = await Event.deleteOne({ _id: event_Id });
      if (result.deletedCount) {
        res.json({ msg: 'Event Deleted successfully' });
      } else {
        return res.status(404).json({ msg: 'Event not Deleted' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
)

module.exports = router;