"use strict";var jwt=require("jsonwebtoken"),config=require("../config/config");module.exports={sign:function sign(a){return jwt.sign(a,config.secret)},verify:function verify(a){return jwt.verify(a,config.secret,{maxAge:config.token_exp})}};