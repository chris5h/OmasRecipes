BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `recipes` (
	`id`	INTEGER NOT NULL UNIQUE,
	`name`	TEXT,
	`author`	TEXT,
	`directions`	TEXT,
	`type_id`	id INTEGER NOT NULL,
	PRIMARY KEY(`id` AUTO_INCREMENT),
	FOREIGN KEY(`type_id`) REFERENCES `types`(`id`)
);
CREATE TABLE IF NOT EXISTS `types` (
	`id`	INTEGER NOT NULL UNIQUE,
	`type`	TEXT NOT NULL UNIQUE,
	PRIMARY KEY(`id` AUTO_INCREMENT)
);
CREATE TABLE IF NOT EXISTS `ingredients` (
	`id`	INTEGER NOT NULL UNIQUE,
	`recipe_id`	INTEGER NOT NULL,
	`ordinal`	INTEGER NOT NULL,
	`ingredient`	TEXT NOT NULL,
	PRIMARY KEY(`id` AUTO_INCREMENT),
	FOREIGN KEY(`recipe_id`) REFERENCES `recipes`(`id`)
);
CREATE TABLE IF NOT EXISTS `notes` (
	`id`	INTEGER NOT NULL UNIQUE,
	`recipe_id`	NUMERIC NOT NULL,
	`note`	TEXT NOT NULL,
	PRIMARY KEY(`id` AUTO_INCREMENT),
	FOREIGN KEY(`recipe_id`) REFERENCES `recipes`(`id`)
);
CREATE TABLE IF NOT EXISTS `images` (
	`id`	INTEGER NOT NULL UNIQUE,
	`recipe_id`	INTEGER NOT NULL,
	`description`	text,
	`filename`	text NOT NULL UNIQUE,
	PRIMARY KEY(`id` AUTO_INCREMENT),
	FOREIGN KEY(`recipe_id`) REFERENCES `recipes`(`id`)
);
COMMIT;