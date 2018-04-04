const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../../../middlewares/async");

const Hashids = require("hashids");
const hashids = new Hashids(process.env.HASHIDS_EVENT_SALT, process.env.HASHIDS_EVENT_LENGTH);

const Event = require("../../../models/event");
const Response = require("../../../models/response");

const { TestError } = require("../../../utils/errors");

// Create (POST) an event
router.get("/api/event/:id", asyncMiddleware(async (req, res, next) => {

  const id = hashids.decode(req.params.id)[0];

  console.log(id);

  const resp = {
    status: true,
    messages: [],
    result: {}
  };

  const event = await Event.findOne({ _id: id }).exec();

  const responses = await Event.find({ eventID: id }).exec();

  resp.result = { event, responses };

  res
    .status(200)
    .send(resp);
}));

module.exports = router;
