#!/usr/bin/env node
"use strict";var app=require("../app"),debug=require("debug")("app:server"),https=require("https"),config=require("../config/config"),fs=require("fs"),path=require("path"),port=normalizePort(process.env.PORT||config.server.port);app.set("port",port);var server=https.createServer({key:fs.readFileSync(path.join(__dirname,"../ssl/private.key")),cert:fs.readFileSync(path.join(__dirname,"../ssl/public.cert"))},app);server.listen(port),server.on("error",onError),server.on("listening",onListening);function normalizePort(c){var a=parseInt(c,10);return isNaN(a)?c:!!(0<=a)&&a}function onError(c){if("listen"!==c.syscall)throw c;var a="string"==typeof port?"Pipe "+port:"Port "+port;switch(c.code){case"EACCES":console.error(a+" requires elevated privileges"),process.exit(1);break;case"EADDRINUSE":console.error(a+" is already in use"),process.exit(1);break;default:throw c;}}function onListening(){var c=server.address(),a="string"==typeof c?"pipe "+c:"port "+c.port;debug("Listening on "+a)}