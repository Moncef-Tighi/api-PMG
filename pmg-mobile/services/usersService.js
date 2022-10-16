"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));function _createForOfIteratorHelper(a,b){var c="undefined"!=typeof Symbol&&a[Symbol.iterator]||a["@@iterator"];if(!c){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=c.call(a)},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){(0,_defineProperty2["default"])(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}var bcrypt=require("bcrypt"),abilitiesManager=require("../services/abilitiesManager"),_require=require("../lib/db"),localDb=_require.localDb,remoteDb=_require.remoteDb,_require2=require("../enums/accountType"),accountType=_require2.accountType,_require3=require("../lib/debug"),d_auth=_require3.d_auth,checkLogin=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b,c){var d,e;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,localDb("users").where("disabled",!1).whereRaw("UPPER(username) = ?",b.toUpperCase()).limit(1).first();case 2:if(d=a.sent,d){a.next=5;break}return a.abrupt("return",!1);case 5:if(e=bcrypt.compareSync(c,d.password),e){a.next=8;break}return a.abrupt("return",!1);case 8:return a.abrupt("return",d.id);case 9:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),getUserById=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,localDb("users").where("id",b).limit(1).first();case 2:if(c=a.sent,c){a.next=5;break}return a.abrupt("return");case 5:if(delete c.password,c.accountType!==accountType.SellerAccount){a.next=17;break}return a.next=9,remoteDb("dbo.COMMERCIAL").where("GCL_COMMERCIAL",c.cegidId).first();case 9:if(d=a.sent,d){a.next=13;break}return d_auth("Count not find cegid seller for the following local user %O",c),a.abrupt("return");case 13:c.defaultStore=d.GCL_ETABLISSEMENT,c.cegidRole="SELLER",a.next=25;break;case 17:return a.next=19,remoteDb("dbo.UTILISAT").where("US_UTILISATEUR",c.cegidId).first();case 19:if(e=a.sent,e){a.next=23;break}return d_auth("Could not find cegid user for the following local user %O",c),a.abrupt("return");case 23:c.defaultStore=e.US_ETABLISSEMENT,c.cegidRole=e.US_GROUPE;case 25:return c.defaultStore&&!c.accessStores.includes(c.defaultStore)&&c.accessStores.push(c.defaultStore),a.abrupt("return",c);case 27:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),updateLastSeen=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,localDb("users").update({lastSeen:localDb.fn.now()}).where("id",b);case 2:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),updateUser=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b,c){var d,e;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(!c.username){a.next=6;break}return a.next=3,localDb("users").where("username",c.username).where("id","<>",b).first();case 3:if(d=a.sent,!d){a.next=6;break}return a.abrupt("return",{error:"Le nom d'utilisateur est d\xE9ja pris"});case 6:if("string"==typeof c.password&&(c.password=bcrypt.hashSync(c.password,3)),!c.accessStores){a.next=12;break}return a.next=10,getUserById(b);case 10:e=a.sent,c.accessStores=c.accessStores.filter(function(a){return a!==e.defaultStore});case 12:return a.abrupt("return",localDb("users").update(c).where("id",b));case 13:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),importUser=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b,c,d){var e,f,g,h;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return d.accountType="SELLER"===c?accountType.SellerAccount:accountType.UserAccount,a.next=3,localDb("users").orWhere(function(a){a.where("cegidId",b).where("accountType",d.accountType)}).orWhere("username",d.username).limit(1).first();case 3:if(e=a.sent,!e){a.next=6;break}return a.abrupt("return",{error:e.username===d.username?"Le nom d'utilisateur est d\xE9ja pris":"Utilisateur d\xE9ja import\xE9"});case 6:if(d.password=bcrypt.hashSync(d.password,3),d.accountType!==accountType.SellerAccount){a.next=16;break}return a.next=10,remoteDb("COMMERCIAL").select("GCL_ETABLISSEMENT").where("GCL_COMMERCIAL",b).first();case 10:if(g=a.sent,g){a.next=13;break}return a.abrupt("return",{error:"Commercial (".concat(b,") introuvable sur la bdd cegid")});case 13:f=g.GCL_ETABLISSEMENT,a.next=24;break;case 16:return a.next=18,remoteDb("dbo.UTILISAT").select("US_ETABLISSEMENT","US_GROUPE").where("US_UTILISATEUR",b).first();case 18:if(h=a.sent,h){a.next=21;break}return a.abrupt("return",{error:"Utilisateur (".concat(b,") introuvable sur la bdd cegid")});case 21:if(abilitiesManager.canHandleCegidRole(h.US_GROUPE)){a.next=23;break}return a.abrupt("return",{error:"Role non g\xE9r\xE9 ".concat(h.US_GROUPE)});case 23:f=h.US_ETABLISSEMENT;case 24:return d.accessStores=d.accessStores.filter(function(a){return a!==f}),a.abrupt("return",localDb("users").insert(_objectSpread(_objectSpread({},d),{},{cegidId:b})));case 26:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),listLocalAndRemoteProfiles=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b,c,d,e;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b=[],a.next=3,localDb("users").select(localDb.raw("users.*"),localDb.raw("uc.username as \"createdBy\""),localDb.raw("uu.username as \"updatedBy\"")).joinRaw("LEFT JOIN users uc ON (\"users\".\"createdById\" = uc.id)").joinRaw("LEFT JOIN users uu ON (\"users\".\"updatedById\" = uu.id)");case 3:return c=a.sent.map(function(a){return _objectSpread(_objectSpread({},a),{},{password:void 0})}),a.next=6,remoteDb("UTILISAT").select("US_UTILISATEUR","US_ABREGE","US_ETABLISSEMENT","US_GROUPE").whereIn("US_GROUPE",abilitiesManager.getManagedCegidRoles());case 6:return d=a.sent,a.next=9,remoteDb("COMMERCIAL").select("GCL_COMMERCIAL","GCL_LIBELLE","GCL_ETABLISSEMENT");case 9:return e=a.sent,c=c.reduce(function(a,b){if(b.accountType===accountType.UserAccount){var c=d.find(function(a){return a.US_UTILISATEUR===b.cegidId});if(!c)return a;if(b.defaultStore=c.US_ETABLISSEMENT,b.cegidRole=c.US_GROUPE,!abilitiesManager.canHandleCegidRole(b.cegidRole))return a}else{var f=e.find(function(a){return a.GCL_COMMERCIAL===b.cegidId});if(!f)return a;b.defaultStore=f.GCL_ETABLISSEMENT,b.cegidRole="SELLER"}return b.defaultStore&&!b.accessStores.includes(b.defaultStore)&&b.accessStores.push(b.defaultStore),a.push(b),a},[]),b.push.apply(b,(0,_toConsumableArray2["default"])(c)),d=d.reduce(function(a,b){return c.find(function(a){return a.accountType===accountType.UserAccount&&a.cegidId===b.US_UTILISATEUR})?a:abilitiesManager.canHandleCegidRole(b.US_GROUPE)?(a.push({cegidId:b.US_UTILISATEUR,username:b.US_ABREGE,defaultStore:b.US_ETABLISSEMENT,cegidRole:b.US_GROUPE,disabled:!1,accessStores:[b.US_ETABLISSEMENT],accessZones:[]}),a):a},[]),b.push.apply(b,(0,_toConsumableArray2["default"])(d)),e=e.reduce(function(a,b){return c.find(function(a){return a.accountType===accountType.SellerAccount&&a.cegidId===b.GCL_COMMERCIAL})?a:(a.push({cegidId:b.GCL_COMMERCIAL,username:b.GCL_LIBELLE,defaultStore:b.GCL_ETABLISSEMENT,cegidRole:"SELLER",disabled:!1,accessStores:[b.GCL_ETABLISSEMENT],accessZones:[]}),a)},[]),b.push.apply(b,(0,_toConsumableArray2["default"])(e)),a.abrupt("return",b);case 17:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),listLocalSellers=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e,f,g,h,i;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return c=[],d=remoteDb("COMMERCIAL").select("GCL_COMMERCIAL","GCL_ETABLISSEMENT"),b&&d.whereIn("GCL_ETABLISSEMENT",b),a.next=5,d;case 5:return d=a.sent,a.next=8,localDb("users").where("accountType",accountType.SellerAccount).whereIn("cegidId",d.map(function(a){return a.GCL_COMMERCIAL}));case 8:e=a.sent,f=_createForOfIteratorHelper(e),a.prev=10,h=function(){var a=g.value,b=d.find(function(b){return b.GCL_COMMERCIAL===a.cegidId});return b?void(a.defaultStore=b.GCL_ETABLISSEMENT,a.cegidRole="SELLER",a.defaultStore&&!a.accessStores.includes(a.defaultStore)&&a.accessStores.push(a.defaultStore),c.push(_objectSpread(_objectSpread({},a),{},{password:void 0}))):"continue"},f.s();case 13:if((g=f.n()).done){a.next=19;break}if(i=h(),"continue"!==i){a.next=17;break}return a.abrupt("continue",17);case 17:a.next=13;break;case 19:a.next=24;break;case 21:a.prev=21,a.t0=a["catch"](10),f.e(a.t0);case 24:return a.prev=24,f.f(),a.finish(24);case 27:return a.abrupt("return",c);case 28:case"end":return a.stop();}},a,null,[[10,21,24,27]])}));return function(){return a.apply(this,arguments)}}(),_getLocalProfiles=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b,c,d,e,f,g,h,i,j,k;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b=[],a.next=3,localDb("users");case 3:return c=a.sent,d=c.filter(function(a){return a.accountType===accountType.SellerAccount}).map(function(a){return a.cegidId}),e=c.filter(function(a){return a.accountType===accountType.UserAccount}).map(function(a){return a.cegidId}),a.next=8,remoteDb("COMMERCIAL").select("GCL_COMMERCIAL","GCL_ETABLISSEMENT").whereIn("GCL_COMMERCIAL",d);case 8:return f=a.sent,a.next=11,remoteDb("UTILISAT").select("US_UTILISATEUR","US_ETABLISSEMENT","US_GROUPE").whereIn("US_UTILISATEUR",e);case 11:g=a.sent,h=_createForOfIteratorHelper(c),a.prev=13,j=function(){var a=i.value;if(a.accountType===accountType.SellerAccount){var c=f.find(function(b){return b.GCL_COMMERCIAL===a.cegidId});if(!c)return"continue";a.defaultStore=c.GCL_ETABLISSEMENT,a.cegidRole="SELLER"}else{var d=g.find(function(b){return b.US_UTILISATEUR===a.cegidId});if(!d)return"continue";a.defaultStore=d.US_ETABLISSEMENT,a.cegidRole=d.US_GROUPE}a.defaultStore&&!a.accessStores.includes(a.defaultStore)&&a.accessStores.push(a.defaultStore),a.role=abilitiesManager.getDefinitionFor(a.cegidRole,!1),b.push(_objectSpread(_objectSpread({},a),{},{password:void 0}))},h.s();case 16:if((i=h.n()).done){a.next=22;break}if(k=j(),"continue"!==k){a.next=20;break}return a.abrupt("continue",20);case 20:a.next=16;break;case 22:a.next=27;break;case 24:a.prev=24,a.t0=a["catch"](13),h.e(a.t0);case 27:return a.prev=27,h.f(),a.finish(27);case 30:return a.abrupt("return",b);case 31:case"end":return a.stop();}},a,null,[[13,24,27,30]])}));return function(){return a.apply(this,arguments)}}(),massUpdate=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b,c){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",localDb("users").update(c).whereIn("id",b));case 1:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}();function getSubordinatesFor(){return _getSubordinatesFor.apply(this,arguments)}function _getSubordinatesFor(){return _getSubordinatesFor=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return c=b.definition.priority,a.next=3,b.getStores();case 3:return d=a.sent.map(function(a){return a.id}),a.next=6,_getLocalProfiles();case 6:return e=a.sent.filter(function(a){return a.role&&c<a.role.priority&&d.some(function(b){return a.accessStores.includes(b)})}),a.abrupt("return",e);case 8:case"end":return a.stop();}},a)})),_getSubordinatesFor.apply(this,arguments)}module.exports={checkLogin:checkLogin,getUserById:getUserById,listLocalAndRemoteProfiles:listLocalAndRemoteProfiles,updateLastSeen:updateLastSeen,updateUser:updateUser,importUser:importUser,listLocalSellers:listLocalSellers,massUpdate:massUpdate,getSubordinatesFor:getSubordinatesFor};