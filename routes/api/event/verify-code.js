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

// Verify an Event ID is valid
router.get("/api/event/verify-code", asyncMiddleware(async (req, res, next) => {

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  // Validate ID
  if (/[^23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ]/g.test(req.query.id)) {
    resp.status = false;
    return res
      .status(400)
      .send(resp);
  }

  // Decode ID
  const id = hashids.decode(req.query.id)[0];

  // Redirect if decode unsuccessful
  if (id === undefined) {
    resp.status = false;
    return res
      .status(400)
      .send(resp);
  }

  // Find Event with ID
  const event = await Event.findOne({ _id: id }).exec();

  // Redirect if Event not found
  if (!event) {
    resp.status = false;
    return res
      .status(400)
      .send(resp);
  }

  return res
    .status(200)
    .send(resp);
}));

module.exports = router;
