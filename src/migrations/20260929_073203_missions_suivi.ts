import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_missions_scope" AS ENUM('quebec', 'canada', 'international');
  CREATE TYPE "public"."enum__missions_v_version_scope" AS ENUM('quebec', 'canada', 'international');
  ALTER TABLE "missions" ADD COLUMN "scope" "enum_missions_scope" DEFAULT 'international';
  ALTER TABLE "missions" ADD COLUMN "start_date" timestamp(3) with time zone;
  ALTER TABLE "missions" ADD COLUMN "end_date" timestamp(3) with time zone;
  ALTER TABLE "missions" ADD COLUMN "progress" numeric DEFAULT 0;
  ALTER TABLE "missions" ADD COLUMN "leader" varchar;
  ALTER TABLE "missions" ADD COLUMN "ministry_id" integer;
  ALTER TABLE "_missions_v" ADD COLUMN "version_scope" "enum__missions_v_version_scope" DEFAULT 'international';
  ALTER TABLE "_missions_v" ADD COLUMN "version_start_date" timestamp(3) with time zone;
  ALTER TABLE "_missions_v" ADD COLUMN "version_end_date" timestamp(3) with time zone;
  ALTER TABLE "_missions_v" ADD COLUMN "version_progress" numeric DEFAULT 0;
  ALTER TABLE "_missions_v" ADD COLUMN "version_leader" varchar;
  ALTER TABLE "_missions_v" ADD COLUMN "version_ministry_id" integer;
  ALTER TABLE "missions" ADD CONSTRAINT "missions_ministry_id_ministries_id_fk" FOREIGN KEY ("ministry_id") REFERENCES "public"."ministries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_missions_v" ADD CONSTRAINT "_missions_v_version_ministry_id_ministries_id_fk" FOREIGN KEY ("version_ministry_id") REFERENCES "public"."ministries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "missions_ministry_idx" ON "missions" USING btree ("ministry_id");
  CREATE INDEX "_missions_v_version_version_ministry_idx" ON "_missions_v" USING btree ("version_ministry_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "missions" DROP CONSTRAINT "missions_ministry_id_ministries_id_fk";
  
  ALTER TABLE "_missions_v" DROP CONSTRAINT "_missions_v_version_ministry_id_ministries_id_fk";
  
  DROP INDEX "missions_ministry_idx";
  DROP INDEX "_missions_v_version_version_ministry_idx";
  ALTER TABLE "missions" DROP COLUMN "scope";
  ALTER TABLE "missions" DROP COLUMN "start_date";
  ALTER TABLE "missions" DROP COLUMN "end_date";
  ALTER TABLE "missions" DROP COLUMN "progress";
  ALTER TABLE "missions" DROP COLUMN "leader";
  ALTER TABLE "missions" DROP COLUMN "ministry_id";
  ALTER TABLE "_missions_v" DROP COLUMN "version_scope";
  ALTER TABLE "_missions_v" DROP COLUMN "version_start_date";
  ALTER TABLE "_missions_v" DROP COLUMN "version_end_date";
  ALTER TABLE "_missions_v" DROP COLUMN "version_progress";
  ALTER TABLE "_missions_v" DROP COLUMN "version_leader";
  ALTER TABLE "_missions_v" DROP COLUMN "version_ministry_id";
  DROP TYPE "public"."enum_missions_scope";
  DROP TYPE "public"."enum__missions_v_version_scope";`)
}
