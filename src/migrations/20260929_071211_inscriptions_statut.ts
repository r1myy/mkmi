import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_event_registrations_status" AS ENUM('confirmed', 'pending', 'cancelled');
  ALTER TABLE "event_registrations" ADD COLUMN "status" "enum_event_registrations_status" DEFAULT 'confirmed';
  ALTER TABLE "event_registrations" ADD COLUMN "notes" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "event_registrations" DROP COLUMN "status";
  ALTER TABLE "event_registrations" DROP COLUMN "notes";
  DROP TYPE "public"."enum_event_registrations_status";`)
}
