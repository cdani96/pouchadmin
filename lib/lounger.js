"use strict";

const fs = require("fs");
const pkg = require("../package.json");

const lounger = { loaded: false };
lounger.version = pkg.version;
const api = {},
  cli = {};

Object.defineProperties(lounger, {
  commands: {
    get: () => {
      if (lounger.loaded === false) {
        throw new Error("run lounger.load before");
      }
      return api;
    },
  },
  cli: {
    get: () => {
      if (lounger.loaded === false) {
        throw new Error("run lounger.load before");
      }
      return cli;
    },
  },
});

lounger.load = function load() {
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      files.forEach((file) => {
        if (!/\.js$/.test(file) || file === "lounger.js") {
          return;
        }
        const cmd = file.match(/(.*)\.js$/)[1];
        const mod = require("./" + file);
        if (mod.cli) {
          cli[cmd] = mod.cli;
        }
        if (mod.api) {
          api[cmd] = mod.api;
        }
      });
      lounger.loaded = true;
      resolve(lounger);
    });
  });
};

module.exports = lounger;
