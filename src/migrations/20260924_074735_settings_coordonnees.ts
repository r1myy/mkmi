import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT '4635, 1re Avenue, local 20';
  ALTER TABLE "site_settings" ALTER COLUMN "directions_url" SET DEFAULT 'https://www.google.com/maps/search/?api=1&query=MKMI+Quebec+4635+1re+Avenue+Quebec+QC+G1H+2T1';
  ALTER TABLE "site_settings" ALTER COLUMN "phone" SET DEFAULT '(418) 261-4988';
  ALTER TABLE "site_settings" ADD COLUMN "description" varchar DEFAULT 'MKMI (Messianic Kingdom Miracles International) Québec est une église chrétienne charismatique fondée sur la foi, située à Charlesbourg. Un espace de communion, de prière et de croissance spirituelle.';
  ALTER TABLE "site_settings" ADD COLUMN "postal_code" varchar DEFAULT 'G1H 2T1';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT '(Adresse à confirmer)';
  ALTER TABLE "site_settings" ALTER COLUMN "directions_url" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "phone" SET DEFAULT 'Téléphone à confirmer';
  ALTER TABLE "site_settings" DROP COLUMN "description";
  ALTER TABLE "site_settings" DROP COLUMN "postal_code";`)
}
