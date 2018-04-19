const express = require("express");
const router = express.Router();
const Hashids = require("hashids");
const hashids = new Hashids(
  process.env.HASHIDS_EVENT_SALT,
  process.env.HASHIDS_EVENT_LENGTH,
  process.env.HASHIDS_EVENT_ALPHABET
);

const Event = require("../../models/event");
const Response = require("../../models/response");

const asyncMiddleware = require("../../middlewares/async");

const { isValidEvent } = require("../../utils/validators");
const { RequestError } = require("../../utils/errors");

// Get (GET) an event + responses
router.get("/event/:id/results", asyncMiddleware(async (req, res, next) => {

  const id = hashids.decode(req.params.id)[0];

  // Verify ID was decoded
  if (id === undefined)
    throw new RequestError("Event ID invalid");

  let event = await Event.findOne({ _id: id }).exec();

  // Verify there was an Event found
  if (!event)
    throw new RequestError("No event found", 404);

  if (!isValidEvent(event))
    throw new RequestError("Event not valid");

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

  let responses = await Response.find({ eventID: id }).exec();

  // Grab only the necessary properties
  responses = responses.map(r => {
    return {
      name: r.name,
      email: r.email,
      timesSelected: r.timesSelected.map(t => {
        return {
          start: t.startDate,
          end: t.endDate
        }
      })
    }
  });

  res.render("event/results", {event, responses});

}));

module.exports = router;
