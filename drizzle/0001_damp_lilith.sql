CREATE TYPE "public"."provider" AS ENUM('email', 'google');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" "provider" DEFAULT 'email' NOT NULL;