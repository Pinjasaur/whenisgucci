const express = require("express");
const router  = express.Router();

const Event   = require("../../../models/event");
const Creator = require("../../../models/creator");

const asyncMiddleware = require("../../../middlewares/async");

const { TestError } = require("../../../utils/errors");

// Create (POST) an event
router.post("/api/event/create", asyncMiddleware(async (req, res, next) => {

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  const email = req.body.createdBy;

  let creator = null;
  // Check for Creator
  creator = await Creator.findOne({ email: email }).exec();

  // If no creator, make a new one
  if (!creator) {
    creator = await new Creator({
      email: email
    }).save();
  }

  // Create the Event
  const event = await new Event({
    title: req.body.title,
    createdBy: creator.id,
    granularity: req.body.granularity || 30,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }).save();

  // Update the Creator with the Event ID
  creator.events.push(event.id);
  await creator.save();

  res
    .status(201)
    .send(resp);
}));

module.exports = router;
