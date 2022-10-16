"use strict";
module.exports = function (a) {
    a.blamable = function () {
        a.integer("created_by").unsigned().notNullable(),
        a.integer("updated_by").unsigned().notNullable(),
        a.foreign("created_by").references("users.id"),
        a.foreign("updated_by").references("users.id")
    }, a.priceFields = function () {
        a.float("total_brut_ht", 10, 2).notNullable(),
        a.float("remise_percent", 4, 2).notNullable(), 
        a.float("remise", 10, 2).notNullable(), 
        a.float("total_net_ht", 10, 2).notNullable(), 
        a.float("total_brut_ttc", 10, 2).notNullable(), 
        a.float("total_ttc", 10, 2).notNullable(), 
        a.json("tva").notNullable()
    }, a.pricesFields = function () {
        a.float("quantite", 10, 2).notNullable(),
        a.float("pu", 10, 2).notNullable(), 
        a.float("remise_u", 10, 2).notNullable(),
        a.float("total_net_ht", 10, 2).notNullable(), 
        a.float("tva", 5, 2).notNullable()
    }, a.relation = function (b, c) {
        return a.integer(b).unsigned().notNullable(), a.foreign(b).references(c)
    }
};