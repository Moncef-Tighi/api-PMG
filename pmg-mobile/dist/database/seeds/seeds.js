"use strict";var bcrypt=require("bcrypt"),_require=require("../../enums/accountType"),accountType=_require.accountType,password=bcrypt.hashSync("password",3),rows=[{id:1,cegidId:"CEG",username:"Admin",password:password,accountType:accountType.UserAccount,activeUntil:null,disabled:!1},{id:2,cegidId:"501",username:"VENDEUR F",password:password,accountType:accountType.SellerAccount,accessStores:["050"],activeUntil:null,disabled:!1}];exports.seed=function(b){return b("users").del().then(function(){return b.batchInsert("users",rows,10)})};