UPDATE  wp_posts
INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_stock_status"
SET wp_postmeta.meta_value="outofstock"
WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
    SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value="CODE ARTICLE"
)
--C'est soit instock ou outofstock

UPDATE  wp_posts
INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND  wp_postmeta.meta_key="_price"
SET wp_postmeta.meta_value=2500
WHERE wp_posts.post_type ="product" AND wp_postmeta.post_id = (
    SELECT post_id from wp_postmeta WHERE wp_postmeta.meta_value="CODE ARTICLE"
)
