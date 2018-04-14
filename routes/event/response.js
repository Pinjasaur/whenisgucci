const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../../middlewares/async");

const Hashids = require("hashids");
const hashids = new Hashids(
  process.env.HASHIDS_EVENT_SALT,
  process.env.HASHIDS_EVENT_LENGTH,
  process.env.HASHIDS_EVENT_ALPHABET
);
const Event = require("../../models/event");

const { RequestError } = require("../../utils/errors");

// Get (GET) an event + responses
router.get("/event/:id/response", asyncMiddleware(async (req, res, next) => {

  const id = hashids.decode(req.params.id)[0];

  // Verify ID was decoded
  if (id === undefined)
    throw new RequestError("Event ID invalid");


  let event = await Event.findOne({ _id: id }).exec();

  // Verify there was an Event found
  if (!event)
    throw new RequestError("No event found", 404);

  // Grab only the necessary properties
  event = {
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    granularity: event.granularity,
    timesSelected: event.timesSelected.map(t => {
      return {
        start: t.startDate,
        end: t.endDate
      }
    })
  };

  res.render("event/response", {event});

}));

module.exports = router;
