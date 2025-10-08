CREATE TABLE "links" (
	"id" uuid PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"legenda" text,
	"codigo" text NOT NULL,
	CONSTRAINT "links_url_unique" UNIQUE("url"),
	CONSTRAINT "links_legenda_unique" UNIQUE("legenda")
);
--> statement-breakpoint
DROP TABLE "contatos" CASCADE;--> statement-breakpoint
DROP TABLE "usuario" CASCADE;