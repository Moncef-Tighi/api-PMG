SELECT sku, onsale, total_sales FROM wp_wc_product_meta_lookup



SELECT ID,post_title, post_name, post_content, post_status,meta_key, meta_value,sku, onsale, total_sales FROM `wp_posts` 
INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND 
	(wp_postmeta.meta_key="_stock_status" OR wp_postmeta.meta_key="_price" OR wp_postmeta.meta_key="_sku")
INNER JOIN wp_wc_product_meta_lookup ON wp_wc_product_meta_lookup.product_id=wp_posts.ID
WHERE post_type ="product" AND sku="CODE ARTICLE"
ORDER BY total_sales DESC