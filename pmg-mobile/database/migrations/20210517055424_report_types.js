"use strict";
exports.up = function (a) {
    return a.schema.createTable("report_types", function (a) {
        a.increments("id").primary(), a.text("name")
    }).raw("\n      INSERT INTO report_types (name) VALUES \n      ('Rupture de stock'),\n      ('Ecart de stock'),\n      ('Article d\xE9f\xE9ctieux')\n    ")
}, exports.down = function (a) {
    return a.schema.dropTableIfExists("report_types")
};