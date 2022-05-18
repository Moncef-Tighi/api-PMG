SELECT ID,post_title, post_name, post_content, post_status,meta_key, meta_value FROM `wp_posts` 
INNER JOIN wp_postmeta ON wp_postmeta.post_id=wp_posts.ID AND 
	(wp_postmeta.meta_key="_stock_status" OR wp_postmeta.meta_key="_price" OR wp_postmeta.meta_key="_sku")
WHERE post_type ="product"

--ATTENTION ça ne marche pas avec les variations parce que les variations n'ont pas de code article, 
--Il faut une subquerry
-- AND ID="12"


--Pour chaque article on aura deux ligne : une qui aura le status du stock dans meta_value, une autre qui aura le prix dans meta_value