"use strict";var Joi=require("@hapi/joi"),_require=require("./errorHandler"),ValidationError=_require.ValidationError,_=require("lodash"),getValidatorMiddleware=function(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:"query";return function(c,d,e){try{c.validated=Joi.attempt(c[b],a,{stripUnknown:!0}),e()}catch(a){return e(new ValidationError(a))}}};module.exports=getValidatorMiddleware;