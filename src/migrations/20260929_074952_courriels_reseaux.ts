import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_email_campaigns_audience" AS ENUM('newsletter', 'event', 'contacts');
  CREATE TYPE "public"."enum_email_campaigns_status" AS ENUM('draft', 'scheduled', 'sent');
  CREATE TYPE "public"."enum_social_posts_platforms" AS ENUM('facebook', 'instagram', 'youtube', 'tiktok', 'whatsapp');
  CREATE TYPE "public"."enum_social_posts_format" AS ENUM('photo', 'video', 'carousel', 'story', 'live', 'link');
  CREATE TYPE "public"."enum_social_posts_status" AS ENUM('draft', 'scheduled', 'published');
  CREATE TABLE "email_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar NOT NULL,
  	"preheader" varchar,
  	"body" jsonb NOT NULL,
  	"audience" "enum_email_campaigns_audience" DEFAULT 'newsletter' NOT NULL,
  	"event_id" integer,
  	"status" "enum_email_campaigns_status" DEFAULT 'draft',
  	"scheduled_at" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"recipients" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_posts_platforms" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_social_posts_platforms",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "social_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"caption" varchar,
  	"image_id" integer,
  	"format" "enum_social_posts_format" DEFAULT 'photo',
  	"link" varchar,
  	"status" "enum_social_posts_status" DEFAULT 'draft',
  	"scheduled_at" timestamp(3) with time zone,
  	"post_url" varchar,
  	"reach" numeric,
  	"likes" numeric,
  	"comments" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_campaigns_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_posts_id" integer;
  ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_posts_platforms" ADD CONSTRAINT "social_posts_platforms_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "email_campaigns_event_idx" ON "email_campaigns" USING btree ("event_id");
  CREATE INDEX "email_campaigns_updated_at_idx" ON "email_campaigns" USING btree ("updated_at");
  CREATE INDEX "email_campaigns_created_at_idx" ON "email_campaigns" USING btree ("created_at");
  CREATE INDEX "social_posts_platforms_order_idx" ON "social_posts_platforms" USING btree ("order");
  CREATE INDEX "social_posts_platforms_parent_idx" ON "social_posts_platforms" USING btree ("parent_id");
  CREATE INDEX "social_posts_image_idx" ON "social_posts" USING btree ("image_id");
  CREATE INDEX "social_posts_updated_at_idx" ON "social_posts" USING btree ("updated_at");
  CREATE INDEX "social_posts_created_at_idx" ON "social_posts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_campaigns_fk" FOREIGN KEY ("email_campaigns_id") REFERENCES "public"."email_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_posts_fk" FOREIGN KEY ("social_posts_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_email_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("email_campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_social_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("social_posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_posts_platforms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_posts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "email_campaigns" CASCADE;
  DROP TABLE "social_posts_platforms" CASCADE;
  DROP TABLE "social_posts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_campaigns_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_posts_fk";
  
  DROP INDEX "payload_locked_documents_rels_email_campaigns_id_idx";
  DROP INDEX "payload_locked_documents_rels_social_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_campaigns_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "social_posts_id";
  DROP TYPE "public"."enum_email_campaigns_audience";
  DROP TYPE "public"."enum_email_campaigns_status";
  DROP TYPE "public"."enum_social_posts_platforms";
  DROP TYPE "public"."enum_social_posts_format";
  DROP TYPE "public"."enum_social_posts_status";`)
}
