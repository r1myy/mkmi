import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_donations_category" AS ENUM('general', 'tithe', 'missions', 'projects', 'building', 'social', 'youth', 'other');
  CREATE TYPE "public"."enum_donations_method" AS ENUM('card', 'interac', 'bank', 'cheque', 'cash', 'online');
  CREATE TYPE "public"."enum_donations_status" AS ENUM('confirmed', 'pending', 'refunded');
  CREATE TABLE "donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"amount" numeric NOT NULL,
  	"donor_name" varchar DEFAULT 'Anonyme' NOT NULL,
  	"email" varchar,
  	"category" "enum_donations_category" DEFAULT 'general' NOT NULL,
  	"method" "enum_donations_method" DEFAULT 'cash' NOT NULL,
  	"status" "enum_donations_status" DEFAULT 'confirmed',
  	"recurring" boolean DEFAULT false,
  	"receipt_sent" boolean DEFAULT false,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "donations_id" integer;
  CREATE INDEX "donations_updated_at_idx" ON "donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload_locked_documents_rels" USING btree ("donations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "donations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_donations_fk";
  
  DROP INDEX "payload_locked_documents_rels_donations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "donations_id";
  DROP TYPE "public"."enum_donations_category";
  DROP TYPE "public"."enum_donations_method";
  DROP TYPE "public"."enum_donations_status";`)
}
