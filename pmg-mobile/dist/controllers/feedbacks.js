"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));function ownKeys(e,a){var b=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);a&&(c=c.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),b.push.apply(b,c)}return b}function _objectSpread(d){for(var a,e=1;e<arguments.length;e++)a=null==arguments[e]?{}:arguments[e],e%2?ownKeys(Object(a),!0).forEach(function(b){(0,_defineProperty2["default"])(d,b,a[b])}):Object.getOwnPropertyDescriptors?Object.defineProperties(d,Object.getOwnPropertyDescriptors(a)):ownKeys(Object(a)).forEach(function(b){Object.defineProperty(d,b,Object.getOwnPropertyDescriptor(a,b))});return d}var storeRequest=require("../validation/feedback_store"),updateRequest=require("../validation/feedback_update"),getValidatorMiddleware=require("../middlware/validator"),_require=require("../middlware/errorHandler"),ForbiddenError=_require.ForbiddenError,NotFoundError=_require.NotFoundError,_require2=require("../lib/db"),localDb=_require2.localDb,_require3=require("../enums/modules"),modules=_require3.modules,index=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function f(g,b,c){var d;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.abilities.getModules().includes(modules.FeedbacksModule);case 2:if(e.sent){e.next=4;break}return e.abrupt("return",c(new ForbiddenError));case 4:return d=localDb("links").select(localDb.raw("links.*"),localDb.raw("uc.username as \"createdBy\""),localDb.raw("uu.username as \"updatedBy\"")).joinRaw("LEFT JOIN users uc ON (\"links\".\"createdById\" = uc.id)").joinRaw("LEFT JOIN users uu ON (\"links\".\"updatedById\" = uu.id)").orderByRaw("\"links\".\"createdAt\" DESC"),e.next=7,g.abilities.restrictFeedbacksQuery(d);case 7:return e.t0=b,e.next=10,d;case 10:return e.t1=e.sent,e.next=13,g.abilities.canManageFeedbacks();case 13:e.t2=e.sent,e.t3={canManage:e.t2},e.t4={data:e.t1,metadata:e.t3},e.t0.send.call(e.t0,e.t4);case 17:case"end":return e.stop();}},f)}));return function(){return b.apply(this,arguments)}}(),storeMethod=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function f(g,b,c){var d;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.abilities.canManageFeedbacks();case 2:if(e.sent){e.next=4;break}return e.abrupt("return",c(new ForbiddenError));case 4:return e.next=6,localDb("links").insert(_objectSpread(_objectSpread({},g.validated),{},{createdById:g.user.id})).returning("id");case 6:d=e.sent,b.send({id:d[0]});case 8:case"end":return e.stop();}},f)}));return function(){return b.apply(this,arguments)}}(),store=[getValidatorMiddleware(storeRequest,"body"),storeMethod],updateMethod=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function g(h,b,c){var d,i;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return d=h.params.id,e.next=3,h.abilities.canManageFeedbacks();case 3:if(e.sent){e.next=5;break}return e.abrupt("return",c(new ForbiddenError));case 5:return e.next=7,localDb("links").update(_objectSpread(_objectSpread({},h.validated),{},{updatedById:h.user.id,updatedAt:localDb.fn.now()})).where("id",d);case 7:if(i=e.sent,0!==i){e.next=10;break}return e.abrupt("return",c(new NotFoundError));case 10:b.send({result:i});case 11:case"end":return e.stop();}},g)}));return function(){return b.apply(this,arguments)}}(),update=[getValidatorMiddleware(updateRequest,"body"),updateMethod],destroy=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function g(h,b,c){var d,i;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return d=h.params.id,e.next=3,h.abilities.canManageFeedbacks();case 3:if(e.sent){e.next=5;break}return e.abrupt("return",c(new ForbiddenError));case 5:return e.next=7,localDb("links")["delete"]().where("id",d);case 7:if(i=e.sent,0!==i){e.next=10;break}return e.abrupt("return",c(new NotFoundError));case 10:b.send({result:i});case 11:case"end":return e.stop();}},g)}));return function(){return b.apply(this,arguments)}}();module.exports={index:index,store:store,update:update,destroy:destroy};