"use strict";exports.up=function(b){return b.schema.createTable("report_types",function(b){b.increments("id").primary(),b.text("name")}).raw("\n      INSERT INTO report_types (name) VALUES \n      ('Rupture de stock'),\n      ('Ecart de stock'),\n      ('Article d\xE9f\xE9ctieux')\n    ")},exports.down=function(b){return b.schema.dropTableIfExists("report_types")};