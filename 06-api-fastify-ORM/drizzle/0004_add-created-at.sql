ALTER TABLE "links" DROP CONSTRAINT "links_legenda_unique";--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "clicks" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_codigo_unique" UNIQUE("codigo");