"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));function _createForOfIteratorHelper(i,j){var b="undefined"!=typeof Symbol&&i[Symbol.iterator]||i["@@iterator"];if(!b){if(Array.isArray(i)||(b=_unsupportedIterableToArray(i))||j&&i&&"number"==typeof i.length){b&&(i=b);var k=0,l=function(){};return{s:l,n:function(){return k>=i.length?{done:!0}:{done:!1,value:i[k++]}},e:function(b){throw b},f:l}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var e,m=!0,n=!1;return{s:function(){b=b.call(i)},n:function(){var c=b.next();return m=c.done,c},e:function(b){n=!0,e=b},f:function a(){try{m||null==b["return"]||b["return"]()}finally{if(n)throw a}}}}function _unsupportedIterableToArray(d,a){if(d){if("string"==typeof d)return _arrayLikeToArray(d,a);var b=Object.prototype.toString.call(d).slice(8,-1);return"Object"===b&&d.constructor&&(b=d.constructor.name),"Map"===b||"Set"===b?Array.from(d):"Arguments"===b||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(b)?_arrayLikeToArray(d,a):void 0}}function _arrayLikeToArray(e,a){(null==a||a>e.length)&&(a=e.length);for(var f=0,g=Array(a);f<a;f++)g[f]=e[f];return g}var _require=require("../lib/db"),localDb=_require.localDb,remoteDb=_require.remoteDb,_require2=require("../enums/accountType"),accountType=_require2.accountType,getSellerTurnover=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function d(e){var b;return _regenerator["default"].wrap(function(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,remoteDb.raw("\n    SELECT SUM(GP_TOTALTTC) as turnover\n    FROM PIECE \n    WHERE \n    convert(varchar(10), GP_DATECREATION, 102) = convert(varchar(10), getdate(), 102) AND\n    GP_NATUREPIECEG = 'FFO' AND\n    GP_REPRESENTANT = :sellerId  \n  ",{sellerId:e});case 2:return b=c.sent,c.abrupt("return",b[0].turnover);case 4:case"end":return c.stop();}},d)}));return function(){return b.apply(this,arguments)}}(),byStore=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function d(e){var b;return _regenerator["default"].wrap(function(c){for(;;)switch(c.prev=c.next){case 0:return b=remoteDb("ETABLISS").select({turnover:remoteDb.raw("SUM(CASE WHEN GP_TOTALTTC IS NOT NULL THEN GP_TOTALTTC ELSE 0 END)"),unboundTurnover:remoteDb.raw("SUM(CASE WHEN GP_REPRESENTANT = '' THEN GP_TOTALTTC ELSE 0 END)"),storeId:"ET_ETABLISSEMENT",storeName:"ET_LIBELLE"}).joinRaw("LEFT JOIN PIECE ON GP_ETABLISSEMENT = ET_ETABLISSEMENT AND convert(varchar(10), GP_DATECREATION, 102) = convert(varchar(10), getdate(), 102) AND GP_NATUREPIECEG = 'FFO'").groupBy("ET_ETABLISSEMENT","ET_LIBELLE").orderBy("ET_ETABLISSEMENT","ASC"),void 0!==e&&b.whereIn("ET_ETABLISSEMENT",e),c.next=4,b;case 4:return c.abrupt("return",c.sent);case 5:case"end":return c.stop();}},d)}));return function(){return b.apply(this,arguments)}}(),bySeller=function(){var b=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function j(k){var b,l,m,n,o,p,q;return _regenerator["default"].wrap(function(c){for(;;)switch(c.prev=c.next){case 0:return b=remoteDb("COMMERCIAL").select({turnover:remoteDb.raw("SUM(CASE WHEN GP_TOTALTTC IS NOT NULL THEN GP_TOTALTTC ELSE 0 END)"),sellerCegidId:"GCL_COMMERCIAL"}).leftJoin("PIECE",function(){this.on("GCL_COMMERCIAL","GP_REPRESENTANT"),this.on("GP_NATUREPIECEG",remoteDb.raw("'FFO'")),this.on(remoteDb.raw("convert(varchar(10), GP_DATECREATION, 102) = convert(varchar(10), getdate(), 102)"))}).groupBy("GCL_COMMERCIAL"),void 0!==k&&b.whereIn("GCL_ETABLISSEMENT",k),c.next=4,b;case 4:l=c.sent,m=_createForOfIteratorHelper(l),c.prev=6,m.s();case 8:if((n=m.n()).done){c.next=23;break}if(o=n.value,p=o.sellerCegidId,delete o.sellerCegidId,!p){c.next=20;break}return c.next=15,localDb("users").where("accountType",accountType.SellerAccount).where("cegidId",p).first();case 15:if(q=c.sent,!q){c.next=20;break}return o.name=q.username,o.id=q.id,c.abrupt("continue",21);case 20:o.name="<Non assign\xE9>";case 21:c.next=8;break;case 23:c.next=28;break;case 25:c.prev=25,c.t0=c["catch"](6),m.e(c.t0);case 28:return c.prev=28,m.f(),c.finish(28);case 31:return l=l.sort(function(b,c){return b.turnover>c.turnover?1:b.turnover<c.turnover?-1:0}),c.abrupt("return",l);case 33:case"end":return c.stop();}},j,null,[[6,25,28,31]])}));return function(){return b.apply(this,arguments)}}();module.exports={getSellerTurnover:getSellerTurnover,byStore:byStore,bySeller:bySeller};