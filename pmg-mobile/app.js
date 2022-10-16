"use strict";
var express = require("express"),
    morgan = require("morgan"),
    config = require("./config/config"),
    jwt = require("./middlware/jwt"),
    _require = require("./middlware/core"),
    core = _require.core,
    _require2 = require("./middlware/user"),
    userMiddlware = _require2.userMiddlware,
    _require3 = require("./middlware/errorHandler"),
    errorHandler = _require3.errorHandler,
    NotFoundError = _require3.NotFoundError,
    routesV1 = require("./config/routes");
require("express-async-errors"), require("./lib/morgan.decoded");
var app = express();
app.use(morgan("decoded")), app.use(express.json()), app.use(express.urlencoded({
    extended: !1
})), app.use(core), app.use(jwt.verify), app.use(userMiddlware), app.use(jwt.next), config.delay && app.use(function (a, b, c) {
    setTimeout(function () {
        return c()
    }, config.delay)
}), app.use("/api/v1", routesV1), app.use("/api", function (a, b, c) {
    c(new NotFoundError)
}), app.use("/", function (a, b) {
    var c = "".concat(__dirname, "/bin/sales_advisor-1.0.0.apk");
    b.download(c)
}), app.use(errorHandler), module.exports = app;