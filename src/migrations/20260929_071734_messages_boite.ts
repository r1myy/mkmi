import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_messages" ADD COLUMN "important" boolean DEFAULT false;
  ALTER TABLE "contact_messages" ADD COLUMN "read_at" timestamp(3) with time zone;
  ALTER TABLE "contact_messages" ADD COLUMN "answered_at" timestamp(3) with time zone;
  ALTER TABLE "contact_messages" ADD COLUMN "internal_notes" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_messages" DROP COLUMN "important";
  ALTER TABLE "contact_messages" DROP COLUMN "read_at";
  ALTER TABLE "contact_messages" DROP COLUMN "answered_at";
  ALTER TABLE "contact_messages" DROP COLUMN "internal_notes";`)
}
