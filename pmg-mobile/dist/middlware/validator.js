"use strict";var Joi=require("@hapi/joi"),_require=require("./errorHandler"),ValidationError=_require.ValidationError,_=require("lodash"),getValidatorMiddleware=function(d){var a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"query";return function(b,c,f){try{b.validated=Joi.attempt(b[a],d,{stripUnknown:!0}),f()}catch(b){return f(new ValidationError(b))}}};module.exports=getValidatorMiddleware;