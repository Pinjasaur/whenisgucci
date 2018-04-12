#!/usr/bin/env node

require("dotenv").config()

const Hashids = require("hashids");
const hashids = new Hashids(
  process.env.HASHIDS_EVENT_SALT,
  process.env.HASHIDS_EVENT_LENGTH,
  process.env.HASHIDS_EVENT_ALPHABET
);

if (process.argv[2])
  console.log(hashids.encode(process.argv[2]));
