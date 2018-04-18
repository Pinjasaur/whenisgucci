const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../../middlewares/async");

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

const Event = require("../../models/event");
const Creator = require("../../models/creator");

const { RequestError } = require("../../utils/errors");

const mailer = require("../../utils/mailer");

// Get (GET) an event + responses
router.get("/auth/:id", asyncMiddleware(async (req, res, next) => {

  const token = req.query.token;

  if (!token)
    throw new RequestError("Token required");

  const id = hashids2.decode(req.params.id)[0];

  // Verify ID was decoded
  if (id === undefined)
    throw new RequestError("Creator ID invalid");

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  const creator = await Creator.findOne({ _id: id }).exec();

  // Verify there was an Creator found
  if (!creator)
    throw new RequestError("No Creator found", 404);

  if (token !== creator.token)
    throw new RequestError("Token invalid");

  if (creator.authenticated)
    return res
      .redirect("/?utm_source=emailauth&auth=0");

  creator.authenticated = true;
  await creator.save();

  creator.events.forEach(async (e) => {

    const event = await Event.findOne({ _id: e }).exec();

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
    if (event.invitedTo.length > 0) {

      mailer.sendMultiple({
        to: event.invitedTo,
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
  });

  return res
    .redirect(`event/${hashids.encode(creator.events[0])}/results?utm_source=emailauth&auth=1`);
}));

module.exports = router;
