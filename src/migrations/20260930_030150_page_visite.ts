import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_page_visite_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_visite_expect_steps_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_visite_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_visite_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_visite_v_version_expect_steps_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_visite_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "page_visite_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_visite_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_visite_expect_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_visite_expect_steps_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_visite_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "page_visite" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Planifier ma visite',
  	"hero_title" varchar DEFAULT 'Votre première visite,
  *on vous attend.*',
  	"hero_text" varchar DEFAULT 'Venir dans une nouvelle église peut sembler intimidant. Dites-nous quand vous comptez venir : une personne de l’équipe d’accueil sera là pour vous recevoir et répondre à vos questions.',
  	"hero_primary" varchar DEFAULT 'Planifier ma visite',
  	"hero_secondary" varchar DEFAULT 'À quoi s’attendre',
  	"hero_image_id" integer,
  	"expect_eyebrow" varchar DEFAULT 'À quoi s’attendre ?',
  	"expect_title" varchar DEFAULT 'Le déroulement *d’un culte.*',
  	"expect_text" varchar DEFAULT 'Nos cultes sont chaleureux, vivants et centrés sur Jésus. Voici comment se passe une rencontre, pour que vous sachiez à quoi vous attendre avant d’arriver.',
  	"expect_image_id" integer,
  	"plan_eyebrow" varchar DEFAULT 'Planifier ma visite',
  	"plan_title" varchar DEFAULT 'Dites-nous *quand vous venez.*',
  	"plan_text" varchar DEFAULT 'Remplissez ce court formulaire : nous vous attendrons et nous vous écrirons si nous avons des précisions à vous donner avant votre visite.',
  	"plan_form_title" varchar DEFAULT 'Je planifie ma visite',
  	"plan_parking" varchar DEFAULT 'Les informations sur le stationnement seront publiées prochainement.',
  	"plan_kids" varchar DEFAULT 'Les familles sont les bienvenues. Écrivez-nous pour savoir ce qui est prévu pour les enfants.',
  	"plan_access" varchar DEFAULT 'Informations sur l’accessibilité des lieux à venir.',
  	"faq_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"faq_title" varchar DEFAULT 'Avant de venir',
  	"faq_text" varchar DEFAULT 'Les réponses aux questions que l’on nous pose le plus souvent avant une première visite.',
  	"cta_eyebrow" varchar DEFAULT 'Au plaisir de vous rencontrer',
  	"cta_title" varchar DEFAULT 'Une place vous attend.',
  	"cta_text" varchar DEFAULT 'Vous avez une question avant de venir ? Notre équipe est là pour vous répondre.',
  	"cta_primary" varchar DEFAULT 'Nous écrire',
  	"cta_secondary" varchar DEFAULT 'Découvrir MKMI',
  	"cta_image_id" integer,
  	"_status" "enum_page_visite_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_visite_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_visite_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_visite_v_version_expect_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_visite_v_version_expect_steps_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_visite_v_version_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_visite_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Planifier ma visite',
  	"version_hero_title" varchar DEFAULT 'Votre première visite,
  *on vous attend.*',
  	"version_hero_text" varchar DEFAULT 'Venir dans une nouvelle église peut sembler intimidant. Dites-nous quand vous comptez venir : une personne de l’équipe d’accueil sera là pour vous recevoir et répondre à vos questions.',
  	"version_hero_primary" varchar DEFAULT 'Planifier ma visite',
  	"version_hero_secondary" varchar DEFAULT 'À quoi s’attendre',
  	"version_hero_image_id" integer,
  	"version_expect_eyebrow" varchar DEFAULT 'À quoi s’attendre ?',
  	"version_expect_title" varchar DEFAULT 'Le déroulement *d’un culte.*',
  	"version_expect_text" varchar DEFAULT 'Nos cultes sont chaleureux, vivants et centrés sur Jésus. Voici comment se passe une rencontre, pour que vous sachiez à quoi vous attendre avant d’arriver.',
  	"version_expect_image_id" integer,
  	"version_plan_eyebrow" varchar DEFAULT 'Planifier ma visite',
  	"version_plan_title" varchar DEFAULT 'Dites-nous *quand vous venez.*',
  	"version_plan_text" varchar DEFAULT 'Remplissez ce court formulaire : nous vous attendrons et nous vous écrirons si nous avons des précisions à vous donner avant votre visite.',
  	"version_plan_form_title" varchar DEFAULT 'Je planifie ma visite',
  	"version_plan_parking" varchar DEFAULT 'Les informations sur le stationnement seront publiées prochainement.',
  	"version_plan_kids" varchar DEFAULT 'Les familles sont les bienvenues. Écrivez-nous pour savoir ce qui est prévu pour les enfants.',
  	"version_plan_access" varchar DEFAULT 'Informations sur l’accessibilité des lieux à venir.',
  	"version_faq_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"version_faq_title" varchar DEFAULT 'Avant de venir',
  	"version_faq_text" varchar DEFAULT 'Les réponses aux questions que l’on nous pose le plus souvent avant une première visite.',
  	"version_cta_eyebrow" varchar DEFAULT 'Au plaisir de vous rencontrer',
  	"version_cta_title" varchar DEFAULT 'Une place vous attend.',
  	"version_cta_text" varchar DEFAULT 'Vous avez une question avant de venir ? Notre équipe est là pour vous répondre.',
  	"version_cta_primary" varchar DEFAULT 'Nous écrire',
  	"version_cta_secondary" varchar DEFAULT 'Découvrir MKMI',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_visite_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "visit_plans" ADD COLUMN "message" varchar;
  ALTER TABLE "page_visite_features_items" ADD CONSTRAINT "page_visite_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_visite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_visite_expect_steps" ADD CONSTRAINT "page_visite_expect_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_visite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_visite_faq_questions" ADD CONSTRAINT "page_visite_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_visite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_visite" ADD CONSTRAINT "page_visite_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_visite" ADD CONSTRAINT "page_visite_expect_image_id_media_id_fk" FOREIGN KEY ("expect_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_visite" ADD CONSTRAINT "page_visite_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_visite_v_version_features_items" ADD CONSTRAINT "_page_visite_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_visite_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_visite_v_version_expect_steps" ADD CONSTRAINT "_page_visite_v_version_expect_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_visite_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_visite_v_version_faq_questions" ADD CONSTRAINT "_page_visite_v_version_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_visite_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_visite_v" ADD CONSTRAINT "_page_visite_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_visite_v" ADD CONSTRAINT "_page_visite_v_version_expect_image_id_media_id_fk" FOREIGN KEY ("version_expect_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_visite_v" ADD CONSTRAINT "_page_visite_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_visite_features_items_order_idx" ON "page_visite_features_items" USING btree ("_order");
  CREATE INDEX "page_visite_features_items_parent_id_idx" ON "page_visite_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_visite_expect_steps_order_idx" ON "page_visite_expect_steps" USING btree ("_order");
  CREATE INDEX "page_visite_expect_steps_parent_id_idx" ON "page_visite_expect_steps" USING btree ("_parent_id");
  CREATE INDEX "page_visite_faq_questions_order_idx" ON "page_visite_faq_questions" USING btree ("_order");
  CREATE INDEX "page_visite_faq_questions_parent_id_idx" ON "page_visite_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "page_visite_hero_hero_image_idx" ON "page_visite" USING btree ("hero_image_id");
  CREATE INDEX "page_visite_expect_expect_image_idx" ON "page_visite" USING btree ("expect_image_id");
  CREATE INDEX "page_visite_cta_cta_image_idx" ON "page_visite" USING btree ("cta_image_id");
  CREATE INDEX "page_visite__status_idx" ON "page_visite" USING btree ("_status");
  CREATE INDEX "_page_visite_v_version_features_items_order_idx" ON "_page_visite_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_visite_v_version_features_items_parent_id_idx" ON "_page_visite_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_visite_v_version_expect_steps_order_idx" ON "_page_visite_v_version_expect_steps" USING btree ("_order");
  CREATE INDEX "_page_visite_v_version_expect_steps_parent_id_idx" ON "_page_visite_v_version_expect_steps" USING btree ("_parent_id");
  CREATE INDEX "_page_visite_v_version_faq_questions_order_idx" ON "_page_visite_v_version_faq_questions" USING btree ("_order");
  CREATE INDEX "_page_visite_v_version_faq_questions_parent_id_idx" ON "_page_visite_v_version_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_page_visite_v_version_hero_version_hero_image_idx" ON "_page_visite_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_visite_v_version_expect_version_expect_image_idx" ON "_page_visite_v" USING btree ("version_expect_image_id");
  CREATE INDEX "_page_visite_v_version_cta_version_cta_image_idx" ON "_page_visite_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_visite_v_version_version__status_idx" ON "_page_visite_v" USING btree ("version__status");
  CREATE INDEX "_page_visite_v_created_at_idx" ON "_page_visite_v" USING btree ("created_at");
  CREATE INDEX "_page_visite_v_updated_at_idx" ON "_page_visite_v" USING btree ("updated_at");
  CREATE INDEX "_page_visite_v_latest_idx" ON "_page_visite_v" USING btree ("latest");
  CREATE INDEX "_page_visite_v_autosave_idx" ON "_page_visite_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_visite_features_items" CASCADE;
  DROP TABLE "page_visite_expect_steps" CASCADE;
  DROP TABLE "page_visite_faq_questions" CASCADE;
  DROP TABLE "page_visite" CASCADE;
  DROP TABLE "_page_visite_v_version_features_items" CASCADE;
  DROP TABLE "_page_visite_v_version_expect_steps" CASCADE;
  DROP TABLE "_page_visite_v_version_faq_questions" CASCADE;
  DROP TABLE "_page_visite_v" CASCADE;
  ALTER TABLE "visit_plans" DROP COLUMN "message";
  DROP TYPE "public"."enum_page_visite_features_items_icon";
  DROP TYPE "public"."enum_page_visite_expect_steps_icon";
  DROP TYPE "public"."enum_page_visite_status";
  DROP TYPE "public"."enum__page_visite_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_visite_v_version_expect_steps_icon";
  DROP TYPE "public"."enum__page_visite_v_version_status";`)
}
