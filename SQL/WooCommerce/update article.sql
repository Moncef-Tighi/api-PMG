UPDATE  wp_posts
INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_stock_status"
SET wp_postmeta.meta_value="dispo"
WHERE wp_posts.post_type ="product" AND wp_posts.ID="12"

UPDATE  wp_posts
INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND  wp_postmeta.meta_key="_price"
SET wp_postmeta.meta_value=2500
WHERE wp_posts.post_type ="product" AND wp_posts.ID="12"