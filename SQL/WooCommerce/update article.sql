
--MODIFICATION STOCK

    UPDATE  wp_posts
    INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_stock_status"
    SET wp_postmeta.meta_value="outofstock"
    WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
        SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value="CODE ARTICLE"
    )
    --C'est soit instock ou outofstock MAIS Y A AUSSI UN "onbackorder"



    --MODIFICATION DU STOCK PAR DIMENSION

    UPDATE  wp_posts
    INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_stock_status"
    SET wp_postmeta.meta_value="outofstock"
    WHERE wp_posts.post_type ="product_variation" AND wp_posts.post_excerpt="Taille: L" AND wp_posts.post_parent IN (
        SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value="DH9653-MWU"
    )




-- MODIFICATION PRIX 

    UPDATE  wp_posts
    INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND  wp_postmeta.meta_key="_price"
    SET wp_postmeta.meta_value=2500
    WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
        SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value="CODE ARTICLE"
    )

    --Query de rechange dans le cas ou le code article n'est pas stocké dans meta_value
    --mais il faudrait réccupérer le post_name qu'on a pas côté Plateforme
    --Quoi que, WooCommerce donne l'ID directement aussi

    UPDATE  wp_posts
    INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND  wp_postmeta.meta_key="_price"
    SET wp_postmeta.meta_value=2500
    WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
        SELECT post_id from wp_posts WHERE wp_posts.post_name="boys-knit-pants-60-cotton-40-polyester"
    )

