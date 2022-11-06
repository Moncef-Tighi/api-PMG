"use strict";exports.up=function(c){return c.schema.createTable("links",function(a){a.increments("id").primary(),a.text("title"),a.text("url"),a.boolean("visible").notNullable().defaultTo(!0),a.integer("createdById").nullable(),a.integer("updatedById").nullable(),a.datetime("createdAt").notNullable().defaultTo(c.fn.now()),a.datetime("updatedAt").notNullable().defaultTo(c.fn.now())})},exports.down=function(b){return b.schema.dropTableIfExists("links")};