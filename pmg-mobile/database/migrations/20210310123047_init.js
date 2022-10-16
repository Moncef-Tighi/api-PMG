"use strict";
var sqlCreateExtensions = "\nCREATE EXTENSION IF NOT EXISTS citext;\n";
exports.up = function (a) {
    return a.raw(sqlCreateExtensions)
};
var sqlDropExtensions = "\nDROP EXTENSION IF EXISTS citext;\n";
exports.down = function (a) {
    return a.raw(sqlDropExtensions)
};