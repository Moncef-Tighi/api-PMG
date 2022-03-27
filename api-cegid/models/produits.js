import db from "./database.js";

export const getAllProduits = async function() {
    const data=await db.query`SELECT * FROM produit`;
    return data.recordset;
};

export const getOneProduits = async function(produit) {
    const data=await db.query`SELECT * FROM produit WHERE nom_produit=${produit}`;
    return data.recordset[0];
};


export const getAllProduitsDisponibles = async function() {
    const data=await db.query`SELECT * FROM produit WHERE stock>=5`;
    return data.recordset;
};

export const updateStock= async function(quantité, produit) {
    const result = await db.query`
    UPDATE produit
    SET stock = stock - ${quantité}
    WHERE nom_produit=${produit} `;
    return result;
};
