"use strict";
exports.up = function (a) {
    return a.schema.createTable("links", function (b) {
        b.increments("id").primary(), b.text("title"), b.text("url"), b.boolean("visible").notNullable().defaultTo(!0), b.integer("createdById").nullable(), b.integer("updatedById").nullable(), b.datetime("createdAt").notNullable().defaultTo(a.fn.now()), b.datetime("updatedAt").notNullable().defaultTo(a.fn.now())
    })
}, exports.down = function (a) {
    return a.schema.dropTableIfExists("links")
};