"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),storesService=require("../../services/storesService"),_require=require("../../enums/modules"),modules=_require.modules,definition={cegidRole:"SELLER",name:"Commercial",group:"Commerciaux",priority:5,getInstance:getInstance};function getInstance(a){return{getModules:function getModules(){return[modules.ArticlesModule,modules.FeedbacksModule,modules.ReportsModule]},getStores:function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function b(){return _regenerator["default"].wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.abrupt("return",storesService.getAllStores(a.accessStores));case 1:case"end":return b.stop();}},b)}));return function getStores(){return b.apply(this,arguments)}}(),restrictFeedbacksQuery:function restrictFeedbacksQuery(a){a.where("visible",!0)},canManageFeedbacks:function canManageFeedbacks(){return!1},canManageUsers:function canManageUsers(){return!1},canManageReports:function canManageReports(){return!1}}}module.exports=definition;