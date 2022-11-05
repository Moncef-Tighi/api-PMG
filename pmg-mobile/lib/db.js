"use strict";
var Knex = require("knex"),
    config = require("../config/config"),
    localDb = Knex(config.localDb),
    remoteDb = Knex(config.remoteDb);
module.exports = {
    localDb: localDb,
    remoteDb: remoteDb
};