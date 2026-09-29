import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_category" AS ENUM('louange', 'enseignement', 'priere', 'conference', 'atelier', 'jeunesse', 'famille', 'rencontre');
  CREATE TYPE "public"."enum_events_format" AS ENUM('onsite', 'online', 'hybrid');
  CREATE TYPE "public"."enum__events_v_version_category" AS ENUM('louange', 'enseignement', 'priere', 'conference', 'atelier', 'jeunesse', 'famille', 'rencontre');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('onsite', 'online', 'hybrid');
  ALTER TABLE "events" ADD COLUMN "ends_at" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN "category" "enum_events_category" DEFAULT 'rencontre';
  ALTER TABLE "events" ADD COLUMN "format" "enum_events_format" DEFAULT 'onsite';
  ALTER TABLE "events" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "stream_url" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_ends_at" timestamp(3) with time zone;
  ALTER TABLE "_events_v" ADD COLUMN "version_category" "enum__events_v_version_category" DEFAULT 'rencontre';
  ALTER TABLE "_events_v" ADD COLUMN "version_format" "enum__events_v_version_format" DEFAULT 'onsite';
  ALTER TABLE "_events_v" ADD COLUMN "version_featured" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_stream_url" varchar;
  ALTER TABLE "pages_content" ADD COLUMN "evenements_hero_image_id" integer;
  ALTER TABLE "pages_content" ADD COLUMN "evenements_newsletter_image_id" integer;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_evenements_hero_image_id_media_id_fk" FOREIGN KEY ("evenements_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_evenements_newsletter_image_id_media_id_fk" FOREIGN KEY ("evenements_newsletter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_content_evenements_evenements_hero_image_idx" ON "pages_content" USING btree ("evenements_hero_image_id");
  CREATE INDEX "pages_content_evenements_evenements_newsletter_image_idx" ON "pages_content" USING btree ("evenements_newsletter_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_content" DROP CONSTRAINT "pages_content_evenements_hero_image_id_media_id_fk";
  
  ALTER TABLE "pages_content" DROP CONSTRAINT "pages_content_evenements_newsletter_image_id_media_id_fk";
  
  DROP INDEX "pages_content_evenements_evenements_hero_image_idx";
  DROP INDEX "pages_content_evenements_evenements_newsletter_image_idx";
  ALTER TABLE "events" DROP COLUMN "ends_at";
  ALTER TABLE "events" DROP COLUMN "category";
  ALTER TABLE "events" DROP COLUMN "format";
  ALTER TABLE "events" DROP COLUMN "featured";
  ALTER TABLE "events" DROP COLUMN "stream_url";
  ALTER TABLE "_events_v" DROP COLUMN "version_ends_at";
  ALTER TABLE "_events_v" DROP COLUMN "version_category";
  ALTER TABLE "_events_v" DROP COLUMN "version_format";
  ALTER TABLE "_events_v" DROP COLUMN "version_featured";
  ALTER TABLE "_events_v" DROP COLUMN "version_stream_url";
  ALTER TABLE "pages_content" DROP COLUMN "evenements_hero_image_id";
  ALTER TABLE "pages_content" DROP COLUMN "evenements_newsletter_image_id";
  DROP TYPE "public"."enum_events_category";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum__events_v_version_category";
  DROP TYPE "public"."enum__events_v_version_format";`)
}
