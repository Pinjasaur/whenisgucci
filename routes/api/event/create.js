const express = require("express");
const router  = express.Router();
const Hashids = require("hashids");
const hashids = new Hashids(
  process.env.HASHIDS_EVENT_SALT,
  process.env.HASHIDS_EVENT_LENGTH,
  process.env.HASHIDS_EVENT_ALPHABET
);
const hashids2 = new Hashids(
  process.env.HASHIDS_CREATOR_SALT,
  process.env.HASHIDS_CREATOR_LENGTH
);
const hat     = require("hat");
const Event   = require("../../../models/event");
const Creator = require("../../../models/creator");

const asyncMiddleware = require("../../../middlewares/async");

const { TestError } = require("../../../utils/errors");

const { sendVerification,
        sendCreated,
        sendInvites } = require("../../../utils/mailer");

const { trimAndUnique } = require("../../../utils/index");

const { TITLE_MAX,
        INVITEES_MAX }  = require("../../../utils/constants");

// Create (POST) an event
router.post("/api/event/create", asyncMiddleware(async (req, res, next) => {

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  const email = req.body.createdBy;
  const invitees = trimAndUnique(req.body.invitedTo);

  let creator = null;
  // Check for Creator
  creator = await Creator.findOne({ email: email }).exec();

  // If no creator, make a new one
  if (!creator) {
    creator = await new Creator({
      email: email,
      token: hat()
    }).save();
  }

  // Create the Event
  const event = await new Event({
    title: req.body.title.slice(0, TITLE_MAX),
    createdBy: creator.id,
    granularity: req.body.granularity || 30,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    invitedTo: invitees.slice(0, INVITEES_MAX),
    timesSelected: req.body.events,
    verified: creator.authenticated
  }).save();

  // Update the Creator with the Event ID
  creator.events.push(event.id);
  await creator.save();

  // Respond with the event hashed ID
  resp.result = {
    event: {
      id: hashids.encode(event.id),
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      invitedTo: event.invitedTo,
      timesSelected: event.timesSelected.map(t => {
        return {
          start: t.startDate,
          end: t.endDate
        }
      })
    },
    creator: {
      email: creator.email,
      authenticated: creator.authenticated
    }
  };

  res
    .status(201)
    .send(resp);

  // If email not validated, send email to validate
  if (!creator.authenticated) {

    // Send verification email if required
    sendVerification(creator, event);

  // If they have, send transactional emails confirming event
  } else {

    // Send confirmation email to creator
    sendCreated(creator, event);

    // Send invite emails to any invitees
    if (invitees.length > 0)
      sendInvites(event);
  }
}));

module.exports = router;
