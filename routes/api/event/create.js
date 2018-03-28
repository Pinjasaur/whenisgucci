const express = require("express");
const router  = express.Router();

const Event   = require("../../../models/event");
const Creator = require("../../../models/creator");

router.post("/api/event/create", async (req, res, next) => {

  const email = req.body.createdBy;

  // Check for Creator
  let creatorID = null;
  const creator = await Creator.findOne({ email: email });

  // If exists, get ID.
  if (creator) {
    creatorID = creator.id;
  // Otherwise, create.
  } else {
    await new Creator({
      email: email
    }).save();
  }

  // Create the Event
  const event = await new Event({
    title: req.body.title,
    createdBy: creatorID,
    granularity: req.body.granularity || 30
  }).save();

  // Update the Creator with the Event ID
  creator.events.push(event.id);
  await creator.save();

  res.send(200);
});

module.exports = router;
