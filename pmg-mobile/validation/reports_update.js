"use strict";var Joi=require("@hapi/joi"),_require=require("../enums/reportStatus"),reportStatus=_require.reportStatus;module.exports=Joi.object().keys({status:Joi.string().valid(reportStatus.Completed,reportStatus.Rejected).required()}).options({abortEarly:!1});