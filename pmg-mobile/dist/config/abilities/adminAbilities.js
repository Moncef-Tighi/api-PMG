"use strict";var _require=require("../../enums/modules"),modules=_require.modules,storesService=require("../../services/storesService"),definition={cegidRole:"ADM",name:"Administrateur",group:"Administrateurs",priority:1,getInstance:getInstance};function getInstance(){return{getModules:function(){return modules.values()},getStores:function(){return storesService.getAllStores()},restrictFeedbacksQuery:function(){},canManageFeedbacks:function(){return!0},canManageUsers:function(){return!0},canManageReports:function(){return!0}}}module.exports=definition;