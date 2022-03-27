CREATE TABLE produit (
	id_produit INT PRIMARY KEY NOT NULL,
	nom_produit NVARCHAR(100) NOT NULL,
	[description] TEXT NULL,
	stock INT default 0 NOT NULL,
	CHECK (stock>=0)
)




CREATE INDEX index_nom_produit ON produit( nom_produit );