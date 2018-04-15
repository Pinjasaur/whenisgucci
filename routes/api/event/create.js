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
const nunjucks = require("nunjucks");
const juice   = require("juice");

const fs      = require("fs");

const Event   = require("../../../models/event");
const Creator = require("../../../models/creator");

const asyncMiddleware = require("../../../middlewares/async");

const { TestError } = require("../../../utils/errors");

const mailer = require("../../../utils/mailer");

// Create (POST) an event
router.post("/api/event/create", asyncMiddleware(async (req, res, next) => {

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  const email = req.body.createdBy;
  const invitees = req.body.invitedTo
    .map(i => i.trim()) // Trim whitespace
    .filter(i => i !== "") // No empties
    .filter((x, i, a) => a.indexOf(x) === i); // No duplicates

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
    title: req.body.title,
    createdBy: creator.id,
    granularity: req.body.granularity || 30,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    invitedTo: invitees,
    timesSelected: req.body.events,
    valid: creator.authenticated
  }).save();

  // Update the Creator with the Event ID
  creator.events.push(event.id);
  await creator.save();

  // Respond with the event hashed ID
  resp.result = {
    event: {
      id: hashids.encode(event.id)
    }
  };

  res
    .status(201)
    .send(resp);

  // If email not validated, send email to validate
  if (!creator.authenticated) {

    // Send verification email if required
    mailer.send({
      to: creator.email,
      from: "noreply@whenisgucci.com",
      subject: "WhenIsGucci: Email Verification Required",
      html: nunjucks.renderString(
        juice(
          fs.readFileSync("views/email/verify-email.njk").toString()
        ),
        {
          authToken: creator.token,
          authHash: hashids2.encode(creator.id)
        }
      )
    });

  // If they have, send transactional emails confirming event
  } else {

    // Send confirmation email to creator
    mailer.send({
      to: creator.email,
      from: "noreply@whenisgucci.com",
      subject: "WhenIsGucci: Event Created",
      html: nunjucks.renderString(
        juice(
          fs.readFileSync("views/email/event-created.njk").toString()
        ),
        {
          eventTitle: event.title,
          eventCode: hashids.encode(event.id)
        }
      )
    });

    // Send invite emails to any invitees
    if (invitees.length > 0) {

      mailer.sendMultiple({
        to: invitees,
        from: "noreply@whenisgucci.com",
        subject: "WhenIsGucci: Event Invitation",
        html: nunjucks.renderString(
          juice(
            fs.readFileSync("views/email/event-invited.njk").toString()
          ),
          {
            eventCode: hashids.encode(event.id)
          }
        )
      });

    }

  }
}));

module.exports = router;
