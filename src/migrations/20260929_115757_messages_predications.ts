import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sermons" ADD COLUMN "duration" varchar;
  ALTER TABLE "_sermons_v" ADD COLUMN "version_duration" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sermons" DROP COLUMN "duration";
  ALTER TABLE "_sermons_v" DROP COLUMN "version_duration";`)
}
