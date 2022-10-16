"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")),
    _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),
    bcrypt = require("bcrypt"),
    _require = require("../../lib/db"),
    remoteDb = _require.remoteDb,
    _require2 = require("../../lib/db"),
    localDb = _require2.localDb,
    _require3 = require("../../enums/accountType"),
    accountType = _require3.accountType,
    password = bcrypt.hashSync("password", 3),
    importUsers = function () {
        var a = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function a() {
            var b, c;
            return _regenerator["default"].wrap(function (a) {
                for (;;) switch (a.prev = a.next) {
                    case 0:
                        return b = [], a.next = 3, remoteDb("UTILISAT").where("US_GROUPE", "ADM");
                    case 3:
                        return c = a.sent, b.push.apply(b, (0, _toConsumableArray2["default"])(c.map(function (a) {
                            return {
                                cegidId: a.US_UTILISATEUR,
                                username: a.US_ABREGE,
                                password: password,
                                accountType: accountType.UserAccount,
                                accessStores: [a.US_ETABLISSEMENT],
                                activeUntil: null,
                                disabled: !1
                            }
                        }))), a.next = 7, localDb("users").del();
                    case 7:
                        return a.next = 9, localDb.batchInsert("users", b, 10);
                    case 9:
                        console.log("Successfully imported (".concat(b.length, ") admins")), console.log(b.map(function (a) {
                            return a.username
                        }));
                    case 11:
                    case "end":
                        return a.stop();
                }
            }, a)
        }));
        return function () {
            return a.apply(this, arguments)
        }
    }();
importUsers().then(function () {
    localDb.destroy(), remoteDb.destroy()
});