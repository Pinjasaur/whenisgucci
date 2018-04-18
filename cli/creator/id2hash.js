#!/usr/bin/env node

require("dotenv").config()

const Hashids = require("hashids");
const hashids = new Hashids(
  process.env.HASHIDS_CREATOR_SALT,
  process.env.HASHIDS_CREATOR_LENGTH
);

if (process.argv[2])
  console.log(hashids.encode(process.argv[2]));
