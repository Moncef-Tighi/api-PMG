import db from "./database.js";

export const getAllArticles = async function() {
    const data=await db.query`SELECT TOP 500 * FROM ARTICLE`;
    return data.recordset;
};

export const vérifierDisponibilitéArticle = async function() {
    //const data=await db.query`SELECT * FROM produit WHERE stock>=5`;
    return data.recordset;
};

export const emplacementArticle = async function(produit) {
    // const data=await db.query`SELECT * FROM produit WHERE nom_produit=${produit}`;
    return data.recordset;
};
