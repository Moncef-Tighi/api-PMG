"use strict";
exports.up = function (a) {
    return a.schema.createTable("reports", function (b) {
        b.increments("id").primary(), b.text("status").notNullable(), b.integer("typeId").notNullable(),
        b.text("codeArticle").notNullable(), b.text("storeId").notNullable(),
        b.text("notes").notNullable().defaultTo(""),
        b.integer("createdById").notNullable(),
        b.datetime("createdAt").notNullable().defaultTo(a.fn.now()),
        b.integer("closedById").nullable(), b.datetime("closedAt").nullable()
    })
}, exports.down = function (a) {
    return a.schema.dropTableIfExists("reports")
};