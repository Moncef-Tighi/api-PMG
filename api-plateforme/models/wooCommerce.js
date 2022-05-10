import db from './mySql.js'

export const updateDisponibilite= async function(codeArticle, status) {
    try {
        const [rows, fields] = await db.execute(`
        UPDATE  wp_posts
        INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_stock_status"
        SET wp_postmeta.meta_value=?
        WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
            SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value=?
        )
        `, [status, codeArticle])
        return rows.changedRows
    } catch(error) {
        console.log(error);
    }
}

export const updatePrix = async function(codeArticle, prix) {
    try {
        const [rows, fields] = await db.execute(`
        UPDATE  wp_posts
        INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND (wp_postmeta.meta_key="_price" OR wp_postmeta.meta_key="_sale_price")
        SET wp_postmeta.meta_value=?
        WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
            SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value=?
        )
        `, [prix, codeArticle])

        return rows.changedRows
    } catch(error) {
        console.log(error);
    }

}

export const totalVentes = async function() {
    try {
        const [rows, fields] = await db.execute(`
        SELECT sku, onsale, total_sales FROM wp_wc_product_meta_lookup
        `)

        return rows
    } catch(error) {
        console.log(error);
    }

}