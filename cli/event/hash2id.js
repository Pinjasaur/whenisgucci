#!/usr/bin/env node

require("dotenv").config()

const Hashids = require("hashids");
const hashids = new Hashids(process.env.HASHIDS_EVENT_SALT, process.env.HASHIDS_EVENT_LENGTH);

if (process.argv[2])
  console.log(hashids.decode(process.argv[2])[0]);
