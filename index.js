#! /usr/bin/env node

const fs = require("fs");
const encode = require("./encode.js");

const [, , path] = process.argv;

if (!path) {
  process.stderr.write("Please specify path to json file.");
  process.exit(1);
}

let data;
try {
  data = Uint8Array.from(JSON.parse(fs.readFileSync(path)));
  process.stdout.write(encode(data));
  process.exit(0);
} catch (err) {
  process.stderr.write(`Failed to read file ${path}, please try again.\n`);
  process.exit(1);
}
