"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),
    articlesService = require("../services/articles"),
    indexRequest = require("../validation/articles_index"),
    showRequest = require("../validation/articles_show"),
    getValidatorMiddleware = require("../middlware/validator"),
    config = require("../config/config"),
    _require = require("../middlware/errorHandler"),
    BadRequestError = _require.BadRequestError,
    _require2 = require("../middlware/errorHandler"),
    NotFoundError = _require2.NotFoundError,
    indexMethod = function () {
        var a = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b, c) {
            var d, e, f, g, h, i, j, k, l;
            return _regenerator["default"].wrap(function (a) {
                for (;;) switch (a.prev = a.next) {
                    case 0:
                        return d = b.validated, e = d.page, f = d.search, g = articlesService.listArticlesQuery().offset(e * config.results_per_page).limit(config.results_per_page).orderByRaw("LEN(GA_CODEARTICLE) asc"), f && (h = f.replace(/\*/g, "%").replace(/ /g, "%") + "%", g.whereRaw("COALESCE(GA_CODEARTICLE, '') LIKE ?", h)), i = g.clone().clear("select").clear("offset").clear("limit").clearOrder().count("* as total").first(), a.next = 6, g;
                    case 6:
                        return j = a.sent, a.next = 9, i;
                    case 9:
                        k = a.sent.total, l = e * config.results_per_page <= k, c.send({
                            totalCount: parseInt(k),
                            page: e,
                            data: j,
                            hasMore: l
                        });
                    case 12:
                    case "end":
                        return a.stop();
                }
            }, a)
        }));
        return function () {
            return a.apply(this, arguments)
        }
    }(),
    index = [getValidatorMiddleware(indexRequest), indexMethod],
    showMethod = function () {
        var a = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b, c, d) {
            var e, f, g, h, i, j;
            return _regenerator["default"].wrap(function (a) {
                for (;;) switch (a.prev = a.next) {
                    case 0:
                        if (e = b.validated, f = e.codeArticle, g = e.barcode, g || f) {
                            a.next = 3;
                            break
                        }
                        return a.abrupt("return", d(new BadRequestError("")));
                    case 3:
                        if (!g) {
                            a.next = 12;
                            break
                        }
                        return a.next = 6, articlesService.getArticleByBarcode(g);
                    case 6:
                        if (i = a.sent, i) {
                            a.next = 9;
                            break
                        }
                        return a.abrupt("return", d(new NotFoundError("Codebare ".concat(g, " introuvable !"))));
                    case 9:
                        h = i.codeArticle, a.next = 13;
                        break;
                    case 12:
                        h = f;
                    case 13:
                        return a.next = 15, articlesService.getRootArticle(h);
                    case 15:
                        if (j = a.sent, j) {
                            a.next = 18;
                            break
                        }
                        return a.abrupt("return", d(new NotFoundError("Code Article ".concat(h, " introuvable !"))));
                    case 18:
                        return a.next = 20, articlesService.getDepotStockFor(h);
                    case 20:
                        return j.stockData = a.sent, a.next = 23, articlesService.getSalePricesTtcFor(j.article);
                    case 23:
                        j.pricings = a.sent, j.metadata = {
                            scannedBarcode: g
                        }, c.send(j);
                    case 26:
                    case "end":
                        return a.stop();
                }
            }, a)
        }));
        return function () {
            return a.apply(this, arguments)
        }
    }(),
    show = [getValidatorMiddleware(showRequest), showMethod];
module.exports = {
    index: index,
    show: show
};