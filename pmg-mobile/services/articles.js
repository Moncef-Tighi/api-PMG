"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),
    _require = require("../lib/db"),
    remoteDb = _require.remoteDb,
    articleQuery = function () {
        return remoteDb("ARTICLE_MODE").
        where("GA_ESTPROFIL", "<>", "X").
        where("GA_TYPEARTICLE", "MAR").
        where("GA_FERME", "<>", "X")
    },
    listArticlesQuery = function () {
        return articleQuery().select({
            codeArticle: "GA_CODEARTICLE",
            libelle: "GA_LIBELLE",
            marque: "CC2.CC_LIBELLE"
        }).joinRaw("LEFT OUTER JOIN CHOIXCOD CC2 ON GA_FAMILLENIV1=CC2.CC_CODE AND CC2.CC_TYPE='FN1'")
        .whereIn("GA_STATUTART", ["GEN", "UNI"])
    },
    getArticleByBarcode = function (a) {
        return articleQuery().select({
            codeArticle: "GA_CODEARTICLE"
        }).where("GA_CODEBARRE", a).limit(1).first()
    },
    getRootArticle = function (a) {
        return articleQuery().select({
            article: "GA_ARTICLE",
            codeArticle: "GA_CODEARTICLE",
            libelle: "GA_LIBELLE",
            marque: "CC2.CC_LIBELLE",
            statutArt: "GA_STATUTART",
            codeBarre: "GA_CODEBARRE",
            prixUnitaireTtc: "GA_PVTTC"
        }).where("GA_CODEARTICLE", a).
        joinRaw("LEFT OUTER JOIN CHOIXCOD CC2 ON GA_FAMILLENIV1=CC2.CC_CODE AND CC2.CC_TYPE='FN1'")
        .whereIn("GA_STATUTART", ["GEN", "UNI"]).limit(1).first()
    },
    getDepotStockFor = function (a) {
        return remoteDb("DISPO").select({
            libelle: "GA_LIBELLE",
            codeBarre: "GA_CODEBARRE",
            codeDepot: "GQ_DEPOT",
            libelleDepot: "GDE_LIBELLE",
            gdiLibelle1: "GDI1.GDI_LIBELLE",
            gdiLibelle2: "GDI2.GDI_LIBELLE",
            gdiCodeDim1: remoteDb.raw("NULLIF(GA_CODEDIM1, '')"),
            gdiCodeDim2: remoteDb.raw("NULLIF(GA_CODEDIM2, '')"),
            gdiRang1: "GDI1.GDI_RANG",
            gdiRang2: "GDI2.GDI_RANG",
            stockPhysique: "GQ_PHYSIQUE",
            stockNet: remoteDb.raw("GQ_PHYSIQUE+GQ_RESERVEFOU+GQ_ANNONCELIV-GQ_RESERVECLI-GQ_PREPACLI-GQ_DISPOCLI"),
            stockDispo: remoteDb.raw("GQ_PHYSIQUE-GQ_RESERVECLI-GQ_PREPACLI")
        }).joinRaw("LEFT OUTER JOIN ARTICLE ON GQ_ARTICLE=GA_ARTICLE")
        .joinRaw("LEFT OUTER JOIN DEPOTS ON GDE_DEPOT=GQ_DEPOT")
        .joinRaw("LEFT OUTER JOIN DIMENSION GDI1 ON GDI1.GDI_TYPEDIM='DI1' AND GDI1.GDI_GRILLEDIM=GA_GRILLEDIM1 AND GDI1.GDI_CODEDIM=GA_CODEDIM1")
        .joinRaw("LEFT OUTER JOIN DIMENSION GDI2 ON GDI2.GDI_TYPEDIM='DI2' AND GDI2.GDI_GRILLEDIM=GA_GRILLEDIM2 AND GDI2.GDI_CODEDIM=GA_CODEDIM2")
        .where("GQ_CLOTURE", "-").whereIn("GA_STATUTART", ["DIM", "UNI"]).where("GA_CODEARTICLE", a)
    },
    getSalePricesTtcFor = function () {
        var a = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b, c, d) {
            var e;
            return _regenerator["default"].wrap(function (a) {
                for (;;) switch (a.prev = a.next) {
                    case 0:
                        return e = remoteDb("TARIF").select({
                            libelle: "GF_LIBELLE",
                            prixUnitaireTtc: "GF_PRIXUNITAIRE",
                            dateDebut: "GF_DATEDEBUT",
                            dateFin: remoteDb.raw("DATEADD(day, 1, GF_DATEFIN)"),
                            typeTarif: "GFM_TYPETARIF"
                        }).joinRaw("LEFT JOIN TARIFMODE ON GF_TARFMODE=GFM_TARFMODE")
                        .where("GF_FERME", "-")
                        .where("GF_REGIMEPRIX", "TTC")
                        .where("GF_NATUREAUXI", "CLI")
                        .where("GFM_NATURETYPE", "VTE")
                        .orderBy("GF_TARIF", "DESC"),
                        b && e.where("GF_ARTICLE", b),
                        c && e.where("GFM_TYPETARIF", c),
                        d && e.where("GF_DATEDEBUT", "<=", d)
                            .where("GF_DATEFIN", ">", d), 
                        a.abrupt("return", e);
                    case 5:
                    case "end":
                        return a.stop();
                }
            }, a)
        }));
        return function () {
            return a.apply(this, arguments)
        }
    }();
module.exports = {
    listArticlesQuery: listArticlesQuery,
    getArticleByBarcode: getArticleByBarcode,
    getRootArticle: getRootArticle,
    getDepotStockFor: getDepotStockFor,
    getSalePricesTtcFor: getSalePricesTtcFor
};