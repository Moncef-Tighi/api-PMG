"use strict";
var _require = require("../../enums/accountType"),
    accountType = _require.accountType;
exports.up = function (a) {
    return a.schema.createTable("users", function (b) {
        b.increments("id").primary(), b.text("cegidId"), b.specificType("username", "citext").unique().notNullable(), b.text("password").notNullable(), b.text("accountType").notNullable().defaultTo(accountType.SellerAccount), b.specificType("accessStores", "text[]").defaultTo("{}"), b.specificType("accessZones", "text[]").defaultTo("{}"), b.dateTime("lastSeen"), b.dateTime("activeUntil"), b.boolean("disabled").notNullable().defaultTo(!1), b.integer("createdById").nullable(), b.integer("updatedById").nullable(), b.datetime("createdAt").notNullable().defaultTo(a.fn.now()), b.datetime("updatedAt").notNullable().defaultTo(a.fn.now())
    })
}, exports.down = function (a) {
    return a.schema.dropTableIfExists("users")
};