"use strict";var Joi=require("@hapi/joi");module.exports=Joi.object().keys({title:Joi.string(),url:Joi.string(),visible:Joi.boolean()}).options({abortEarly:!1}).min(1);