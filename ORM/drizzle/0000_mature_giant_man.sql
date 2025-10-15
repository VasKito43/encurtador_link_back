CREATE TABLE "contatos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text,
	"cpf" text,
	CONSTRAINT "contatos_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"senha" text NOT NULL
);
