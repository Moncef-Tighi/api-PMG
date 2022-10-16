"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")),
    _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),
    bcrypt = require("bcrypt"),
    abilitiesManager = require("../../services/abilitiesManager"),
    _require = require("../../lib/db"),
    remoteDb = _require.remoteDb,
    _require2 = require("../../lib/db"),
    localDb = _require2.localDb,
    _require3 = require("../../enums/accountType"),
    accountType = _require3.accountType,
    password = bcrypt.hashSync("password", 3),
    importUsers = function () {
        var a = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function a() {
            var b, c, d, e;
            return _regenerator["default"].wrap(function (a) {
                for (;;) switch (a.prev = a.next) {
                    case 0:
                        return b = [], a.next = 3, remoteDb("dbo.COMMERCIAL");
                    case 3:
                        return c = a.sent, a.next = 6, remoteDb("UTILISAT").whereIn("US_GROUPE", abilitiesManager.getManagedCegidRoles());
                    case 6:
                        return d = a.sent, b.push.apply(b, (0, _toConsumableArray2["default"])(d.map(function (a) {
                            return {
                                cegidId: a.US_UTILISATEUR,
                                username: a.US_ABREGE,
                                password: password,
                                accountType: accountType.UserAccount,
                                accessStores: [a.US_ETABLISSEMENT],
                                activeUntil: null,
                                disabled: !1
                            }
                        }))), b.push.apply(b, (0, _toConsumableArray2["default"])(c.map(function (a) {
                            return {
                                cegidId: a.GCL_COMMERCIAL,
                                username: a.GCL_LIBELLE,
                                password: password,
                                accountType: accountType.SellerAccount,
                                accessStores: [a.GCL_ETABLISSEMENT],
                                activeUntil: null,
                                disabled: !1
                            }
                        }))), a.next = 11, localDb("users").del();
                    case 11:
                        e = 0;
                    case 12:
                        if (!(e < b.length)) {
                            a.next = 18;
                            break
                        }
                        return a.next = 15, localDb("users").insert(b.slice(e, e + 100)).onConflict("username").ignore();
                    case 15:
                        e += 100, a.next = 12;
                        break;
                    case 18:
                        return a.abrupt("return", b.length);
                    case 19:
                    case "end":
                        return a.stop();
                }
            }, a)
        }));
        return function () {
            return a.apply(this, arguments)
        }
    }();
importUsers().then(function (a) {
    console.log("Imported (".concat(a, ") users")), localDb.destroy(), remoteDb.destroy()
});