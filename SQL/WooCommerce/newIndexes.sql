ALTER TABLE `wp_postmeta` ADD UNIQUE KEY meta_id (meta_id);
ALTER TABLE `wp_postmeta` DROP PRIMARY KEY;
ALTER TABLE `wp_postmeta` ADD PRIMARY KEY (post_id, meta_key, meta_id);
ALTER TABLE `wp_postmeta` DROP KEY post_id;
ALTER TABLE `wp_postmeta` DROP KEY meta_key;
ALTER TABLE `wp_postmeta` ADD KEY meta_key (meta_key, post_id);

ALTER TABLE `wp_posts` ADD INDEX `wp_posts_index_post_type_statu_date` (`post_type`,`post_status`,`post_date`);
ALTER TABLE `wp_usermeta` ADD INDEX `wp_usermeta_index_user_id` (`user_id`);

ALTER TABLE `wp_woocommerce_order_itemmeta` ADD INDEX `order_itemmeta_id_meta_key` (`meta_key`, `order_item_id`)
ALTER TABLE `wp_woocommerce_order_itemmeta` ADD INDEX `order_itemmeta_key_value` (`meta_key`, `meta_value`(300))

ALTER TABLE `wp_woocommerce_order_items` ADD INDEX `order_item_id_type` (`order_id`, `order_item_type`)
ALTER TABLE `wp_woocommerce_order_items` ADD INDEX `order_item_name_type` (`order_item_name`(100), `order_item_type`)

-- knownfilelist ça inclut les noms de fichiers, d'ou le fait que les indexer est important

ALTER TABLE `wp_wfknownfilelist` ADD INDEX `wp_wfknownfilelist_id_path` (`id`, `path`(300))
