"use strict";
const axios = require("axios");

function isOnline(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        const body = response.data;
        if (!body || (response.status !== 200 && response.status !== 201)) {
          return resolve({ [url]: false });
        }
        const isDatabase =
          body.couchdb === "Welcome" || body["express-pouchdb"] === "Welcome!";
        return resolve({ [url]: isDatabase });
      })
      .catch((err) => {
        if (err && (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND")) {
          return resolve({ [url]: false });
        } else {
          return reject(err);
        }
      });
  });
}

exports.api = isOnline;

function cli(url) {
  return new Promise((resolve, reject) => {
    isOnline(url).then((results) => {
      Object.keys(results).forEach((entry) => {
        let msg = "seems to be offline";
        if (results[entry]) {
          msg = "seems to be online";
        }
        console.log(entry, msg);
        resolve(results);
      });
    });
  });
}

exports.cli = cli;
