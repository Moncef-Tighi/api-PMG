DROP TABLE produit

CREATE TABLE produit (
	id_produit INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	nom_produit NVARCHAR(100) NOT NULL UNIQUE,
	[description] TEXT NULL,
	stock INT default 0 NOT NULL,
	CHECK (stock>=0)
)

INSERT INTO produit(nom_produit, [description], stock) VALUES
('produit1', 'dolor sit amet ut rutrum diam aliquet. Maecenas in mauris sit ', 0),
('produit2', 'Nulla sed mauris condimentum, viverra ante at, accumsan quam.', 15),
('produit3', 'aaaa', 2),
('produit4', 'Praesent cursus nisl eget condimen', 7),
('produit5', 'uctor dictum. Aliquam dapibus nisl a metus sollicitudin, eget fermentum augue tincidunt.', 4),
('produit6', 'malesuada convallis, nibh elit elementum sapien, at vulputate justo ligula eu leo. ', 0),
('produit7', 'gravida volutpat massa', 6),
('produit8', 'Nam fermentum nisi ', 25),
('produit9', 'Donec lobortis leo ex', 13)


CREATE INDEX index_nom_produit ON produit( nom_produit );