import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sermons" ADD COLUMN "likes" numeric;
  ALTER TABLE "sermons" ADD COLUMN "comments" numeric;
  ALTER TABLE "_sermons_v" ADD COLUMN "version_likes" numeric;
  ALTER TABLE "_sermons_v" ADD COLUMN "version_comments" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sermons" DROP COLUMN "likes";
  ALTER TABLE "sermons" DROP COLUMN "comments";
  ALTER TABLE "_sermons_v" DROP COLUMN "version_likes";
  ALTER TABLE "_sermons_v" DROP COLUMN "version_comments";`)
}
