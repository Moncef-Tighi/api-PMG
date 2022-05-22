--SANS TAILLE 

INSERT INTO wp_posts( `post_author`, `post_date`,
 `post_content`, `post_title`, `post_excerpt`,
  `post_status`, `comment_status`, `ping_status`,
   `post_name`, `post_modified`, `post_modified_gmt`,
    `guid`, `menu_order`, `post_type`, `comment_count`) VALUES

(0, NOW(), '', 'TITRE', '', 'publish',
 'open', 'open', 'slug_du_post', NOW(),
  NOW(), 'https://pmg.dz/?post_type=product&p=39136', 0, 'product', 0);




--  VARIANT

INSERT INTO wp_posts( `post_author`, `post_date`, 
`post_content`, `post_title`, `post_excerpt`, 
`post_status`, `comment_status`, `ping_status`, 
`post_name`, `post_modified`, `post_modified_gmt`,
 `post_parent`, `guid`, `menu_order`, `post_type`,
  `comment_count`)
  
   VALUES

(0, NOW(), '', 'TITRE',
 'Taille: TAILLE', 'publish'
 , 'open', 'open', 'slug_du_post-taille'
 , NOW(), NOW(), 666,
  'https://pmg.dz/?post_type=product&p=39136', 
  0, 'product_variation', 0);





-- POST META PRODUIT SANS TAILLE

INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
VALUES


(19, '_wp_old_slug', 'SLUG'),
(19, '_sku', 'CODE ARTICLE'),
(19, '_product_version', '4.3.1'),
(19, '_regular_price', '2700'),
(19, 'total_sales', '0'),
(19, '_tax_status', 'taxable'),
(19, '_tax_class', ''),
(19, '_manage_stock', 'no'),
(19, '_backorders', 'no'),
(19, '_sold_individually', 'no'),
(19, '_virtual', 'no'),
(19, '_downloadable', 'no'),
(19, '_download_limit', '0'),
(19, '_download_expiry', '0'),
(19, '_stock', NULL),
(19, '_stock_status', 'instock'),
(19, '_wc_average_rating', '0'),
(19, '_wc_review_count', '0'),
(19, 'attribute_pa_taille', 'TAILLE'),
(19, '_price', '2000'),
(19, '_sale_price', '9999'),
--On a besoin de donnée sérialisé parce que ça signale à WooCommerce
--Que l'article a des variations qui s'appelle taille
(19, '_product_attributes', 'a:1:{s:9:"pa_taille";a:6:{s:4:"name";s:9:"pa_taille";s:5:"value";s:0:"";s:8:"position";s:1:"0";s:10:"is_visible";s:1:"1";s:12:"is_variation";s:1:"1";s:11:"is_taxonomy";s:1:"1";}}
');




--POST META VARIATION


INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
VALUES
(39715, '_product_version', '4.3.1'),
(39718, '_variation_description', ''),
(39719, '_regular_price', '2700'),
(39720, 'total_sales', '0'),
(39721, '_tax_status', 'taxable'),
(39722, '_tax_class', ''),
(39723, '_manage_stock', 'no'),
(39724, '_backorders', 'no'),
(3972, '_sold_individually', 'no'),
(39726, '_virtual', 'no'),
(39727, '_downloadable', 'no'),
(39728, '_download_limit', '0'),
(39729, '_download_expiry', '0'),
(39730, '_stock', NULL),
(39731, '_stock_status', 'instock'),
(39732, '_wc_average_rating', '0'),
(39733, '_wc_review_count', '0'),
(39735, '_price', '2000'),
--SALE PRICE DOIT ETRE INFERIEUR AU PRIX NORMAL
(39735, '_sale_price', '1999'),

(39734, 'attribute_pa_taille', 'TAILLE'),
-- POUR CHAQUE TAILLE
(39735 'attribute_TAILLE', 'TAILLE'); 


INSERT INTO wp_terms(name,slug,term_group)
VALUES
("TAILLE","TAILLE", 0)

INSERT INTO termmeta(term_id, meta_key, meta_value)
VALUES
(id du term créé juste avant, "order_pa_taille",0)

INSERT INTO wp_term_relationships(object_id, term_taxonomy_id,term_order)
VALUES
(post_id, term_id, 0)