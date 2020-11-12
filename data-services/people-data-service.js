const fsRaw = require('fs');
const path = require('path');
const fs = fsRaw.promises;

const dataFile = path.resolve('data-files/people.json');

let serverData;

async function _writeData() {
  try {
    await fs.writeFile(dataFile, JSON.stringify(serverData, null, 2));
  } catch (err) {
    console.error(`ERROR WRITING JSON: ${err}`);
  }
}

function _provision() {
  serverData = {
    people: []
  };
  _writeData();
}

function _get() {
  return serverData;
}

async function _initialize() {
  try {
    await fs.access(dataFile, fsRaw.constants.F_OK);
    serverData = require(dataFile);
  } catch (err) {
    _provision();
  }
  return _get();
}

async function _setPeople(people) {
  serverData.people = people;
  _writeData();
}

module.exports = {
  get: _get,
  initialize: _initialize,
  setPeople: _setPeople
}
