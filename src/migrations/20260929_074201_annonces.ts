import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_category" AS ENUM('evenement', 'priere', 'formation', 'missions', 'enseignement', 'familles', 'eglise');
  CREATE TYPE "public"."enum_announcements_status" AS ENUM('draft', 'pending', 'published', 'archived');
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"image_id" integer,
  	"link" varchar,
  	"link_label" varchar DEFAULT 'En savoir plus',
  	"category" "enum_announcements_category" DEFAULT 'eglise',
  	"status" "enum_announcements_status" DEFAULT 'draft',
  	"publish_at" timestamp(3) with time zone NOT NULL,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "announcements" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  
  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  DROP TYPE "public"."enum_announcements_category";
  DROP TYPE "public"."enum_announcements_status";`)
}
