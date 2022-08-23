CREATE TABLE "types" (
	"id"	INTEGER NOT NULL UNIQUE,
	"type"	TEXT NOT NULL UNIQUE
);

CREATE TABLE "recipes" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT,
	"author"	TEXT,
	"directions"	TEXT,
	"type_id" "id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY (type_id) REFERENCES types(id)
);

CREATE TABLE ingredients ( 
	"id"	INTEGER NOT NULL UNIQUE,
	"recipe_id" INTEGER NOT NULL,
	"ordinal" INTEGER  NOT NULL UNIQUE,
	"ingredient" TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);