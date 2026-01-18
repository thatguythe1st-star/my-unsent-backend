CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"to_name" text NOT NULL,
	"content" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
