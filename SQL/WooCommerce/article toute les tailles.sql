SELECT ID,post_title, post_name, post_content, post_status
, a.meta_value as "code_article"
, b.meta_value as "stock"
, c.meta_value as "prix_de_vente"
,CAST(d.meta_value AS INT) as "Ventes total" 
FROM `wp_posts` 
LEFT JOIN wp_postmeta as a ON a.post_id=wp_posts.ID AND a.meta_key="_sku"
LEFT JOIN wp_postmeta as b ON b.post_id=wp_posts.ID AND b.meta_key="_stock_status"
LEFT JOIN wp_postmeta as c ON c.post_id=wp_posts.ID AND c.meta_key="_price"
LEFT JOIN wp_postmeta as d ON d.post_id=wp_posts.ID AND d.meta_key="total_sales"
WHERE post_type ="product" AND a.meta_value="64507U-ERA"
UNION 

SELECT ID,post_title, post_name, post_content, post_status
, a.meta_value as "code_article"
, b.meta_value as "stock"
, c.meta_value as "prix_de_vente"
,CAST(d.meta_value AS INT) as "Ventes total" 
FROM `wp_posts` 
LEFT JOIN wp_postmeta as a ON a.post_id=wp_posts.ID AND a.meta_key="_sku"
INNER JOIN wp_postmeta as b ON b.post_id=wp_posts.ID AND b.meta_key="_stock_status"
INNER JOIN wp_postmeta as c ON c.post_id=wp_posts.ID AND c.meta_key="_price"
INNER JOIN wp_postmeta as d ON d.post_id=wp_posts.ID AND d.meta_key="total_sales"
WHERE post_type="product_variation" AND post_parent IN (
	
    SELECT ID FROM `wp_posts` 
    INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND wp_postmeta.meta_key="_sku"
    WHERE post_type ="product" AND wp_postmeta.meta_value="64507U-ERA"
    
)
