const express = require("express");
const router = express.Router();
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

const asyncMiddleware = require("../../middlewares/async");

const { RequestError } = require("../../utils/errors");
const { isValidEvent } = require("../../utils/validators");
const { sendVerification,
        sendCreated,
        sendInvites }  = require("../../utils/mailer");

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

  // NOTE! Cannot use forEach w/ async/await (to get expected results)
  // See: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  for (let eventID of creator.events) {

    const event = await Event.findOne({ _id: eventID }).exec();

    // Verify there was an Event found
    if (!event)
      return res
        .redirect("/?utm_source=emailauth&auth=2");

    event.verified = true;
    await event.save();

    // Send confirmation email to creator
    sendCreated(creator, event);

    // Send invite emails to any invitees
    if (event.invitedTo.length > 0)
      sendInvites(event);
  }

  return res
    .redirect(`/event/${hashids.encode(creator.events[0])}/results?utm_source=emailauth&auth=1`);
}));

module.exports = router;
