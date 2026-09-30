import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'answered', 'archived');
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"newsletter" boolean DEFAULT false,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_content_eglise_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_content_decouvrir_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_content_decouvrir_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer
  );
  
  CREATE TABLE "pages_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eglise_hero_image_id" integer,
  	"eglise_welcome_image_id" integer,
  	"eglise_membership_image_id" integer,
  	"decouvrir_hero_image_id" integer,
  	"decouvrir_story_image_id" integer,
  	"decouvrir_faith_image_id" integer,
  	"ministeres_hero_image_id" integer,
  	"ministeres_serve_image_id" integer,
  	"messages_hero_image_id" integer,
  	"messages_spotify_url" varchar,
  	"messages_apple_podcasts_url" varchar,
  	"messages_youtube_channel_url" varchar,
  	"missions_hero_image_id" integer,
  	"missions_vision_image_id" integer,
  	"priere_hero_image_id" integer,
  	"priere_side_image_id" integer,
  	"contact_hero_image_id" integer,
  	"contact_visit_image_id" integer,
  	"contact_office_hours" varchar DEFAULT 'Heures à confirmer',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_messages_id" integer;
  ALTER TABLE "pages_content_eglise_faq" ADD CONSTRAINT "pages_content_eglise_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content_decouvrir_timeline" ADD CONSTRAINT "pages_content_decouvrir_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content_decouvrir_leaders" ADD CONSTRAINT "pages_content_decouvrir_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content_decouvrir_leaders" ADD CONSTRAINT "pages_content_decouvrir_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_eglise_hero_image_id_media_id_fk" FOREIGN KEY ("eglise_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_eglise_welcome_image_id_media_id_fk" FOREIGN KEY ("eglise_welcome_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_eglise_membership_image_id_media_id_fk" FOREIGN KEY ("eglise_membership_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_decouvrir_hero_image_id_media_id_fk" FOREIGN KEY ("decouvrir_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_decouvrir_story_image_id_media_id_fk" FOREIGN KEY ("decouvrir_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_decouvrir_faith_image_id_media_id_fk" FOREIGN KEY ("decouvrir_faith_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_ministeres_hero_image_id_media_id_fk" FOREIGN KEY ("ministeres_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_ministeres_serve_image_id_media_id_fk" FOREIGN KEY ("ministeres_serve_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_messages_hero_image_id_media_id_fk" FOREIGN KEY ("messages_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_missions_hero_image_id_media_id_fk" FOREIGN KEY ("missions_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_missions_vision_image_id_media_id_fk" FOREIGN KEY ("missions_vision_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_priere_hero_image_id_media_id_fk" FOREIGN KEY ("priere_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_priere_side_image_id_media_id_fk" FOREIGN KEY ("priere_side_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_contact_hero_image_id_media_id_fk" FOREIGN KEY ("contact_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_contact_visit_image_id_media_id_fk" FOREIGN KEY ("contact_visit_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "pages_content_eglise_faq_order_idx" ON "pages_content_eglise_faq" USING btree ("_order");
  CREATE INDEX "pages_content_eglise_faq_parent_id_idx" ON "pages_content_eglise_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_content_decouvrir_timeline_order_idx" ON "pages_content_decouvrir_timeline" USING btree ("_order");
  CREATE INDEX "pages_content_decouvrir_timeline_parent_id_idx" ON "pages_content_decouvrir_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_content_decouvrir_leaders_order_idx" ON "pages_content_decouvrir_leaders" USING btree ("_order");
  CREATE INDEX "pages_content_decouvrir_leaders_parent_id_idx" ON "pages_content_decouvrir_leaders" USING btree ("_parent_id");
  CREATE INDEX "pages_content_decouvrir_leaders_photo_idx" ON "pages_content_decouvrir_leaders" USING btree ("photo_id");
  CREATE INDEX "pages_content_eglise_eglise_hero_image_idx" ON "pages_content" USING btree ("eglise_hero_image_id");
  CREATE INDEX "pages_content_eglise_eglise_welcome_image_idx" ON "pages_content" USING btree ("eglise_welcome_image_id");
  CREATE INDEX "pages_content_eglise_eglise_membership_image_idx" ON "pages_content" USING btree ("eglise_membership_image_id");
  CREATE INDEX "pages_content_decouvrir_decouvrir_hero_image_idx" ON "pages_content" USING btree ("decouvrir_hero_image_id");
  CREATE INDEX "pages_content_decouvrir_decouvrir_story_image_idx" ON "pages_content" USING btree ("decouvrir_story_image_id");
  CREATE INDEX "pages_content_decouvrir_decouvrir_faith_image_idx" ON "pages_content" USING btree ("decouvrir_faith_image_id");
  CREATE INDEX "pages_content_ministeres_ministeres_hero_image_idx" ON "pages_content" USING btree ("ministeres_hero_image_id");
  CREATE INDEX "pages_content_ministeres_ministeres_serve_image_idx" ON "pages_content" USING btree ("ministeres_serve_image_id");
  CREATE INDEX "pages_content_messages_messages_hero_image_idx" ON "pages_content" USING btree ("messages_hero_image_id");
  CREATE INDEX "pages_content_missions_missions_hero_image_idx" ON "pages_content" USING btree ("missions_hero_image_id");
  CREATE INDEX "pages_content_missions_missions_vision_image_idx" ON "pages_content" USING btree ("missions_vision_image_id");
  CREATE INDEX "pages_content_priere_priere_hero_image_idx" ON "pages_content" USING btree ("priere_hero_image_id");
  CREATE INDEX "pages_content_priere_priere_side_image_idx" ON "pages_content" USING btree ("priere_side_image_id");
  CREATE INDEX "pages_content_contact_contact_hero_image_idx" ON "pages_content" USING btree ("contact_hero_image_id");
  CREATE INDEX "pages_content_contact_contact_visit_image_idx" ON "pages_content" USING btree ("contact_visit_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content_eglise_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content_decouvrir_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content_decouvrir_leaders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "pages_content_eglise_faq" CASCADE;
  DROP TABLE "pages_content_decouvrir_timeline" CASCADE;
  DROP TABLE "pages_content_decouvrir_leaders" CASCADE;
  DROP TABLE "pages_content" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_messages_fk";
  
  DROP INDEX "payload_locked_documents_rels_contact_messages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_messages_id";
  DROP TYPE "public"."enum_contact_messages_status";`)
}
