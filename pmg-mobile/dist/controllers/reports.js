"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));function ownKeys(e,a){var b=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);a&&(c=c.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),b.push.apply(b,c)}return b}function _objectSpread(d){for(var a,e=1;e<arguments.length;e++)a=null==arguments[e]?{}:arguments[e],e%2?ownKeys(Object(a),!0).forEach(function(b){(0,_defineProperty2["default"])(d,b,a[b])}):Object.getOwnPropertyDescriptors?Object.defineProperties(d,Object.getOwnPropertyDescriptors(a)):ownKeys(Object(a)).forEach(function(b){Object.defineProperty(d,b,Object.getOwnPropertyDescriptor(a,b))});return d}var indexRequest=require("../validation/reports_index"),storeRequest=require("../validation/reports_store"),updateRequest=require("../validation/reports_update"),getValidatorMiddleware=require("../middlware/validator"),_require=require("../middlware/errorHandler"),NotFoundError=_require.NotFoundError,ForbiddenError=_require.ForbiddenError,_require2=require("../enums/reportStatus"),reportStatus=_require2.reportStatus,_require3=require("../enums/modules"),modules=_require3.modules,_require4=require("../lib/db"),localDb=_require4.localDb,config=require("../config/config"),usersService=require("../services/usersService"),abilitiesManager=require("../services/abilitiesManager"),storesService=require("../services/storesService"),indexMethod=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function n(o,b,c){var d,p,q,r,s,t,u,v,w;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.abilities.getModules().includes(modules.ReportsModule);case 2:if(e.sent){e.next=4;break}return e.abrupt("return",c(new ForbiddenError));case 4:return d=o.validated,p=d.page,q=d.status,e.next=7,usersService.getSubordinatesFor(o.abilities);case 7:return r=e.sent,s=localDb({r:"reports"}).select({id:"r.id",status:"r.status",type:"rt.name",codeArticle:"r.codeArticle",notes:"r.notes",storeId:"r.storeId",createdAt:"r.createdAt",closedAt:"r.closedAt",createdBy:"uc.username",closedBy:"uu.username"}).leftJoin({rt:"report_types"},"rt.id","r.typeId").leftJoin({uc:"users"},"r.createdById","uc.id").leftJoin({uu:"users"},"r.closedById","uu.id").where(function(b){b.orWhere("r.createdById",o.user.id),b.orWhereIn("r.createdById",r.map(function(b){return b.id}))}).offset(p*config.results_per_page).limit(config.results_per_page).orderBy("r.createdAt","DESC"),q.length&&s.whereIn("status",q),t=s.clone().clear("select").clear("offset").clear("limit").clearOrder().count("* as total").first(),e.next=13,s;case 13:return u=e.sent,e.next=16,t;case 16:return v=e.sent.total,w=p*config.results_per_page<=v,e.t0=b,e.t1=parseInt(v),e.t2=p,e.t3=u,e.next=24,o.abilities.canManageReports();case 24:e.t4=e.sent,e.t5=w,e.t6={totalCount:e.t1,page:e.t2,data:e.t3,canManage:e.t4,hasMore:e.t5},e.t0.send.call(e.t0,e.t6);case 28:case"end":return e.stop();}},n)}));return function(){return b.apply(this,arguments)}}(),index=[getValidatorMiddleware(indexRequest),indexMethod],storeMethod=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function f(g,b,c){var d;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.abilities.getModules().includes(modules.ReportsModule);case 2:if(e.sent){e.next=4;break}return e.abrupt("return",c(new ForbiddenError));case 4:return e.next=6,localDb("reports").insert(_objectSpread(_objectSpread({},g.validated),{},{status:reportStatus.Pending,createdById:g.user.id})).returning("id");case 6:d=e.sent,b.send({id:d[0]});case 8:case"end":return e.stop();}},f)}));return function(){return b.apply(this,arguments)}}(),store=[getValidatorMiddleware(storeRequest,"body"),storeMethod],updateMethod=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function l(m,b,c){var d,n,o,p,q,r,s;return _regenerator["default"].wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m.abilities.canManageReports();case 2:if(e.sent){e.next=4;break}return e.abrupt("return",c(new ForbiddenError));case 4:return d=m.params.id,e.next=7,localDb("reports").where("id",d).first();case 7:if(n=e.sent,n){e.next=10;break}return e.abrupt("return",c(new NotFoundError));case 10:return e.next=12,usersService.getUserById(n.createdById);case 12:return o=e.sent,e.next=15,usersService.getSubordinatesFor(m.abilities);case 15:if(p=e.sent,!o||o.id===m.user.id||p.find(function(b){return b.id===o.id})){e.next=18;break}return e.abrupt("return",c(new ForbiddenError));case 18:return q=m.validated.status,r=[reportStatus.Completed,reportStatus.Rejected],e.next=22,localDb("reports").update({status:q,closedById:r?m.user.id:void 0,closedAt:r?localDb.fn.now():void 0}).where("id",d);case 22:if(s=e.sent,0!==s){e.next=25;break}return e.abrupt("return",c(new NotFoundError));case 25:b.send({result:s});case 26:case"end":return e.stop();}},l)}));return function(){return b.apply(this,arguments)}}(),update=[getValidatorMiddleware(updateRequest,"body"),updateMethod],getTypes=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function d(a,b){return _regenerator["default"].wrap(function(c){for(;;)switch(c.prev=c.next){case 0:return c.t0=b,c.next=3,localDb("report_types");case 3:c.t1=c.sent,c.t0.send.call(c.t0,c.t1);case 5:case"end":return c.stop();}},d)}));return function(){return b.apply(this,arguments)}}();module.exports={index:index,store:store,update:update,getTypes:getTypes};