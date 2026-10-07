import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "title" varchar;
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "users" ADD COLUMN "active" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "title";
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "users" DROP COLUMN "active";
  ALTER TABLE "users" DROP COLUMN "last_login_at";`)
}
