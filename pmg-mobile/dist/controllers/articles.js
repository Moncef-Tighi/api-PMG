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
        var b = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function m(n, b) {
            var c, o, p, q, r, s, t, u, v;
            return _regenerator["default"].wrap(function (d) {
                for (;;) switch (d.prev = d.next) {
                    case 0:
                        return c = n.validated, o = c.page, p = c.search, q = articlesService.listArticlesQuery().offset(o * config.results_per_page).limit(config.results_per_page).orderByRaw("LEN(GA_CODEARTICLE) asc"), p && (r = p.replace(/\*/g, "%").replace(/ /g, "%") + "%", q.whereRaw("COALESCE(GA_CODEARTICLE, '') LIKE ?", r)), s = q.clone().clear("select").clear("offset").clear("limit").clearOrder().count("* as total").first(), d.next = 6, q;
                    case 6:
                        return t = d.sent, d.next = 9, s;
                    case 9:
                        u = d.sent.total, v = o * config.results_per_page <= u, b.send({
                            totalCount: parseInt(u),
                            page: o,
                            data: t,
                            hasMore: v
                        });
                    case 12:
                    case "end":
                        return d.stop();
                }
            }, m)
        }));
        return function () {
            return b.apply(this, arguments)
        }
    }(),
    index = [getValidatorMiddleware(indexRequest), indexMethod],
    showMethod = function () {
        var b = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function k(l, b, c) {
            var d, m, n, o, p, q;
            return _regenerator["default"].wrap(function (e) {
                for (;;) switch (e.prev = e.next) {
                    case 0:
                        if (d = l.validated, m = d.codeArticle, n = d.barcode, n || m) {
                            e.next = 3;
                            break
                        }
                        return e.abrupt("return", c(new BadRequestError("")));
                    case 3:
                        if (!n) {
                            e.next = 12;
                            break
                        }
                        return e.next = 6, articlesService.getArticleByBarcode(n);
                    case 6:
                        if (p = e.sent, p) {
                            e.next = 9;
                            break
                        }
                        return e.abrupt("return", c(new NotFoundError("Codebare ".concat(n, " introuvable !"))));
                    case 9:
                        o = p.codeArticle, e.next = 13;
                        break;
                    case 12:
                        o = m;
                    case 13:
                        return e.next = 15, articlesService.getRootArticle(o);
                    case 15:
                        if (q = e.sent, q) {
                            e.next = 18;
                            break
                        }
                        return e.abrupt("return", c(new NotFoundError("Code Article ".concat(o, " introuvable !"))));
                    case 18:
                        return e.next = 20, articlesService.getDepotStockFor(o);
                    case 20:
                        return q.stockData = e.sent, e.next = 23, articlesService.getSalePricesTtcFor(q.article);
                    case 23:
                        q.pricings = e.sent, q.metadata = {
                            scannedBarcode: n
                        }, b.send(q);
                    case 26:
                    case "end":
                        return e.stop();
                }
            }, k)
        }));
        return function () {
            return b.apply(this, arguments)
        }
    }(),
    show = [getValidatorMiddleware(showRequest), showMethod];
module.exports = {
    index: index,
    show: show
};