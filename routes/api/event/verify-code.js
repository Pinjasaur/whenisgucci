const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../../../middlewares/async");

const Hashids = require("hashids");
const hashids = new Hashids(
  process.env.HASHIDS_EVENT_SALT,
  process.env.HASHIDS_EVENT_LENGTH,
  process.env.HASHIDS_EVENT_ALPHABET
);

const Event = require("../../../models/event");
const { RequestError } = require("../../../utils/errors");

// Verify an Event ID is valid
router.get("/api/event/verify-code", asyncMiddleware(async (req, res, next) => {

  // Validate ID
  if (/[^23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ]/g.test(req.query.id))
    throw new RequestError("Invalid ID.");

  // Decode ID
  const id = hashids.decode(req.query.id)[0];

  // Throw error if decode unsuccessful
  if (id === undefined)
    throw new RequestError("Unsuccessful ID decode.");

  // Find Event with ID
  const event = await Event.findOne({ _id: id }).exec();

  // Throw error if Event not found
  if (!event)
    throw new RequestError("Event not found.");

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  return res
    .status(200)
    .send(resp);
}));

module.exports = router;
