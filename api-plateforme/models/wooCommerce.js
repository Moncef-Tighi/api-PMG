import db from './mySql.js'

const updateDisponibilite= async function(codeArticle) {
    try {
        const [rows, fields] = await db.execute(`
        UPDATE  wp_posts
        INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_stock_status"
        SET wp_postmeta.meta_value="outofstock"
        WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
            SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value=?
        )
        `, [codeArticle])
        console.log(rows, fields)
    } catch(error) {
        console.log(error);
    }
}

updateDisponibilite();

const updatePrix = async function() {
    
}

export default updateDisponibilite