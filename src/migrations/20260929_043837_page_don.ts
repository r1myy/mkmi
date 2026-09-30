import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_content" ADD COLUMN "don_hero_image_id" integer;
  ALTER TABLE "pages_content" ADD COLUMN "don_impact_image_id" integer;
  ALTER TABLE "pages_content" ADD COLUMN "don_interac_email" varchar;
  ALTER TABLE "pages_content" ADD COLUMN "don_interac_note" varchar;
  ALTER TABLE "pages_content" ADD COLUMN "don_mailing_address" varchar;
  ALTER TABLE "pages_content" ADD COLUMN "don_in_person_note" varchar DEFAULT 'Pendant le culte, lors du temps des offrandes.';
  ALTER TABLE "pages_content" ADD COLUMN "don_charity_number" varchar;
  ALTER TABLE "pages_content" ADD COLUMN "don_tax_receipts" boolean DEFAULT false;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_don_hero_image_id_media_id_fk" FOREIGN KEY ("don_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_don_impact_image_id_media_id_fk" FOREIGN KEY ("don_impact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_content_don_don_hero_image_idx" ON "pages_content" USING btree ("don_hero_image_id");
  CREATE INDEX "pages_content_don_don_impact_image_idx" ON "pages_content" USING btree ("don_impact_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_content" DROP CONSTRAINT "pages_content_don_hero_image_id_media_id_fk";
  
  ALTER TABLE "pages_content" DROP CONSTRAINT "pages_content_don_impact_image_id_media_id_fk";
  
  DROP INDEX "pages_content_don_don_hero_image_idx";
  DROP INDEX "pages_content_don_don_impact_image_idx";
  ALTER TABLE "pages_content" DROP COLUMN "don_hero_image_id";
  ALTER TABLE "pages_content" DROP COLUMN "don_impact_image_id";
  ALTER TABLE "pages_content" DROP COLUMN "don_interac_email";
  ALTER TABLE "pages_content" DROP COLUMN "don_interac_note";
  ALTER TABLE "pages_content" DROP COLUMN "don_mailing_address";
  ALTER TABLE "pages_content" DROP COLUMN "don_in_person_note";
  ALTER TABLE "pages_content" DROP COLUMN "don_charity_number";
  ALTER TABLE "pages_content" DROP COLUMN "don_tax_receipts";`)
}
