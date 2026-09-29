import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_welcome_cards_icon" AS ENUM('church', 'book', 'users');
  CREATE TYPE "public"."enum__home_page_v_version_pillars_items_icon" AS ENUM('megaphone', 'book', 'users', 'heart');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_eglise_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_eglise_groups_cards_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_eglise_membership_steps_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_eglise_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_eglise_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_eglise_v_version_groups_cards_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_eglise_v_version_membership_steps_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_eglise_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_decouvrir_about_highlights_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_decouvrir_pillars_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_decouvrir_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_decouvrir_v_version_about_highlights_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_decouvrir_v_version_pillars_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_decouvrir_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_ministeres_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_ministeres_serve_steps_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_ministeres_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_ministeres_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_ministeres_v_version_serve_steps_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_ministeres_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_messages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_messages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_evenements_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_evenements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_evenements_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_evenements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_missions_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_missions_involve_ways_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_missions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_missions_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_missions_v_version_involve_ways_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_missions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_priere_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_priere_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_priere_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_priere_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_don_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_don_impact_uses_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_don_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_don_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_don_v_version_impact_uses_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_don_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_contact_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_contact_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_home_page_v_version_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_welcome_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"href" varchar,
  	"icon" "enum__home_page_v_version_welcome_cards_icon",
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"icon" "enum__home_page_v_version_pillars_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_missions_zones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'MKMI Québec',
  	"version_hero_subtitle" varchar DEFAULT 'Une communauté chrétienne où nous grandissons dans la foi, vivons la communion fraternelle et annonçons l’Évangile à notre génération.',
  	"version_hero_image_id" integer,
  	"version_hero_video_id" integer,
  	"version_welcome_eyebrow" varchar DEFAULT 'Nouveau ici ?',
  	"version_welcome_title" varchar DEFAULT 'Vous êtes les bienvenus.',
  	"version_welcome_text" varchar DEFAULT 'Que vous découvriez la foi chrétienne, que vous soyez nouveau à Québec ou que vous cherchiez simplement une communauté où grandir, vous avez votre place parmi nous.',
  	"version_pillars_eyebrow" varchar DEFAULT 'Notre ADN',
  	"version_pillars_title" varchar DEFAULT 'Quatre piliers pour une génération',
  	"version_pillars_text" varchar DEFAULT 'Nous sommes une église passionnée par Jésus, centrée sur la Parole, attachée à la communauté et engagée pour notre monde.',
  	"version_pillars_background_id" integer,
  	"version_prayer_eyebrow" varchar DEFAULT 'Prière',
  	"version_prayer_title" varchar DEFAULT 'Vous n’avez pas à traverser cela seul.',
  	"version_prayer_text" varchar DEFAULT 'Notre équipe est disponible pour prier avec vous.
  Peu importe ce que vous vivez, Dieu écoute et se soucie de vous.',
  	"version_prayer_image_id" integer,
  	"version_missions_eyebrow" varchar DEFAULT 'Missions',
  	"version_missions_title" varchar DEFAULT 'Au-delà de Québec',
  	"version_missions_subtitle" varchar DEFAULT 'L’Évangile ne connaît pas de frontières.',
  	"version_missions_text" varchar DEFAULT 'Nous croyons à une église qui impacte sa ville, son pays et les nations. Ensemble, nous soutenons des initiatives locales et internationales pour partager l’amour de Christ.',
  	"version_final_cta_title" varchar DEFAULT 'Prêt à faire un pas de plus ?',
  	"version_final_cta_text" varchar DEFAULT 'Nous serions heureux de vous accueillir et de marcher avec vous sur votre cheminement de foi.',
  	"version_final_cta_background_id" integer,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_home_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "page_eglise_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_eglise_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_eglise_groups_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_eglise_groups_cards_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "page_eglise_membership_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_eglise_membership_steps_icon" DEFAULT 'heart',
  	"title" varchar
  );
  
  CREATE TABLE "page_eglise_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "page_eglise" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Notre église',
  	"hero_title" varchar DEFAULT 'Une maison
  *pour tous.*',
  	"hero_text" varchar DEFAULT 'Une communauté vivante où nous adorons Dieu ensemble, grandissons dans sa Parole, vivons la communion fraternelle et servons notre génération.',
  	"hero_primary" varchar DEFAULT 'Planifier ma visite',
  	"hero_secondary" varchar DEFAULT 'Découvrir MKMI',
  	"hero_image_id" integer,
  	"welcome_eyebrow" varchar DEFAULT 'À quoi s’attendre ?',
  	"welcome_title" varchar DEFAULT 'Venez comme vous êtes, vous êtes les bienvenus.',
  	"welcome_text" varchar DEFAULT 'Que ce soit votre première visite ou que vous cherchiez une nouvelle église locale, nous vous accueillons avec joie. Découvrez à quoi vous attendre lors d’un de nos cultes et comment vous pouvez vous impliquer.',
  	"welcome_button" varchar DEFAULT 'Découvrir à quoi s’attendre',
  	"welcome_image_id" integer,
  	"services_eyebrow" varchar DEFAULT 'Nos cultes',
  	"services_title" varchar DEFAULT 'Rejoignez-nous ce dimanche',
  	"services_text" varchar DEFAULT 'Un temps de louange, de prière et d’enseignement pour toute la famille.',
  	"services_service_label" varchar DEFAULT 'Culte principal',
  	"services_primary" varchar DEFAULT 'Planifier ma visite',
  	"services_secondary" varchar DEFAULT 'Nous contacter',
  	"groups_eyebrow" varchar DEFAULT 'Pour chaque génération',
  	"groups_title" varchar DEFAULT 'Une place pour chacun.',
  	"membership_eyebrow" varchar DEFAULT 'Devenir membre',
  	"membership_title" varchar DEFAULT 'Une famille engagée pour aller plus loin.',
  	"membership_text" varchar DEFAULT 'Explorez ce que signifie devenir membre, les engagements et les prochaines étapes.',
  	"membership_button" varchar DEFAULT 'En savoir plus sur la membership',
  	"membership_image_id" integer,
  	"faq_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"faq_title" varchar DEFAULT 'Tout ce que vous devez savoir avant votre première visite.',
  	"faq_text" varchar DEFAULT 'Nous avons rassemblé les réponses aux questions les plus courantes pour vous aider à planifier votre visite en toute confiance.',
  	"faq_button" varchar DEFAULT 'Poser une autre question',
  	"cta_eyebrow" varchar DEFAULT 'Une église dans sa ville',
  	"cta_title" varchar DEFAULT 'Ensemble pour un plus grand impact.',
  	"cta_text" varchar DEFAULT 'Nous croyons qu’une église locale doit être une lumière dans sa ville, au service des gens et engagée dans sa communauté.',
  	"cta_primary" varchar DEFAULT 'Découvrir nos initiatives',
  	"cta_image_id" integer,
  	"_status" "enum_page_eglise_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_eglise_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_eglise_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_eglise_v_version_groups_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_eglise_v_version_groups_cards_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_eglise_v_version_membership_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_eglise_v_version_membership_steps_icon" DEFAULT 'heart',
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_eglise_v_version_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_eglise_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Notre église',
  	"version_hero_title" varchar DEFAULT 'Une maison
  *pour tous.*',
  	"version_hero_text" varchar DEFAULT 'Une communauté vivante où nous adorons Dieu ensemble, grandissons dans sa Parole, vivons la communion fraternelle et servons notre génération.',
  	"version_hero_primary" varchar DEFAULT 'Planifier ma visite',
  	"version_hero_secondary" varchar DEFAULT 'Découvrir MKMI',
  	"version_hero_image_id" integer,
  	"version_welcome_eyebrow" varchar DEFAULT 'À quoi s’attendre ?',
  	"version_welcome_title" varchar DEFAULT 'Venez comme vous êtes, vous êtes les bienvenus.',
  	"version_welcome_text" varchar DEFAULT 'Que ce soit votre première visite ou que vous cherchiez une nouvelle église locale, nous vous accueillons avec joie. Découvrez à quoi vous attendre lors d’un de nos cultes et comment vous pouvez vous impliquer.',
  	"version_welcome_button" varchar DEFAULT 'Découvrir à quoi s’attendre',
  	"version_welcome_image_id" integer,
  	"version_services_eyebrow" varchar DEFAULT 'Nos cultes',
  	"version_services_title" varchar DEFAULT 'Rejoignez-nous ce dimanche',
  	"version_services_text" varchar DEFAULT 'Un temps de louange, de prière et d’enseignement pour toute la famille.',
  	"version_services_service_label" varchar DEFAULT 'Culte principal',
  	"version_services_primary" varchar DEFAULT 'Planifier ma visite',
  	"version_services_secondary" varchar DEFAULT 'Nous contacter',
  	"version_groups_eyebrow" varchar DEFAULT 'Pour chaque génération',
  	"version_groups_title" varchar DEFAULT 'Une place pour chacun.',
  	"version_membership_eyebrow" varchar DEFAULT 'Devenir membre',
  	"version_membership_title" varchar DEFAULT 'Une famille engagée pour aller plus loin.',
  	"version_membership_text" varchar DEFAULT 'Explorez ce que signifie devenir membre, les engagements et les prochaines étapes.',
  	"version_membership_button" varchar DEFAULT 'En savoir plus sur la membership',
  	"version_membership_image_id" integer,
  	"version_faq_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"version_faq_title" varchar DEFAULT 'Tout ce que vous devez savoir avant votre première visite.',
  	"version_faq_text" varchar DEFAULT 'Nous avons rassemblé les réponses aux questions les plus courantes pour vous aider à planifier votre visite en toute confiance.',
  	"version_faq_button" varchar DEFAULT 'Poser une autre question',
  	"version_cta_eyebrow" varchar DEFAULT 'Une église dans sa ville',
  	"version_cta_title" varchar DEFAULT 'Ensemble pour un plus grand impact.',
  	"version_cta_text" varchar DEFAULT 'Nous croyons qu’une église locale doit être une lumière dans sa ville, au service des gens et engagée dans sa communauté.',
  	"version_cta_primary" varchar DEFAULT 'Découvrir nos initiatives',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_eglise_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_decouvrir_about_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_decouvrir_about_highlights_icon" DEFAULT 'heart',
  	"title" varchar
  );
  
  CREATE TABLE "page_decouvrir_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_decouvrir_pillars_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_decouvrir_story_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_decouvrir_team_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "page_decouvrir" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Découvrir MKMI Québec',
  	"hero_title" varchar DEFAULT 'Une histoire
  *plus grande*
  que nous.',
  	"hero_text" varchar DEFAULT 'Une communauté chrétienne passionnée par Jésus, engagée à voir des vies transformées, des familles restaurées et notre génération impactée.',
  	"hero_primary" varchar DEFAULT 'Notre vision',
  	"hero_secondary" varchar DEFAULT 'Notre église',
  	"hero_image_id" integer,
  	"about_eyebrow" varchar DEFAULT 'Qui sommes-nous ?',
  	"about_title" varchar DEFAULT 'Une famille pour tous les peuples.',
  	"about_text" varchar DEFAULT 'MKMI Québec fait partie du réseau international Messianic Kingdom Miracles International. Nous sommes une église locale, multiculturelle et intergénérationnelle, unie par la foi en Jésus-Christ et animée par la mission d’annoncer l’Évangile, de former des disciples et de servir notre communauté.',
  	"about_image_id" integer,
  	"about_quote_text" varchar DEFAULT 'Ici, nous avons trouvé une famille, des amis et un lieu où notre foi grandit.',
  	"about_quote_source" varchar DEFAULT 'Membre de MKMI Québec',
  	"story_eyebrow" varchar DEFAULT 'Notre histoire',
  	"story_title" varchar DEFAULT 'Un appel qui porte du fruit.',
  	"story_text" varchar DEFAULT 'Depuis ses débuts, MKMI est animé par une vision simple : voir le Royaume de Dieu se manifester par des vies transformées à travers le monde. Aujourd’hui, MKMI Québec poursuit cette vision dans notre ville, en lien avec la famille internationale.',
  	"vision_eyebrow" varchar DEFAULT 'Notre vision',
  	"vision_title" varchar DEFAULT 'Bâtir des vies qui font la différence.',
  	"vision_text" varchar DEFAULT 'Nous croyons qu’une église est plus qu’un bâtiment. C’est une famille qui grandit ensemble, qui vit l’amour de Dieu et qui impacte son environnement.',
  	"vision_button" varchar DEFAULT 'Découvrir notre église',
  	"vision_quote_text" varchar DEFAULT 'Une génération transformée pour transformer son monde.',
  	"vision_quote_source" varchar DEFAULT 'Vision de MKMI',
  	"team_eyebrow" varchar DEFAULT 'Notre leadership',
  	"team_title" varchar DEFAULT 'Une équipe au service de la vision.',
  	"team_text" varchar DEFAULT 'Nos pasteurs et leaders servent avec un cœur passionné pour Dieu et pour les personnes. Ils accompagnent notre communauté dans la croissance spirituelle et dans la réalisation de la mission de MKMI Québec.',
  	"faith_eyebrow" varchar DEFAULT 'Notre foi',
  	"faith_title" varchar DEFAULT 'Une foi enracinée dans la Parole.',
  	"faith_text" varchar DEFAULT 'Nous croyons en la Bible comme la Parole inspirée de Dieu, en Jésus-Christ comme Seigneur et Sauveur, en l’œuvre du Saint-Esprit et en la puissance de la prière. Notre foi se traduit par une vie transformée et un service actif.',
  	"faith_button" varchar DEFAULT 'Découvrir la foi',
  	"faith_image_id" integer,
  	"network_eyebrow" varchar DEFAULT 'Notre famille internationale',
  	"network_title" varchar DEFAULT 'Un réseau, une même mission.',
  	"network_text" varchar DEFAULT 'MKMI est présent dans plusieurs pays à travers le monde. Ensemble, nous partageons la même vision : voir le Royaume de Dieu se manifester et impacter les nations.',
  	"network_button" varchar DEFAULT 'Découvrir nos missions',
  	"cta_eyebrow" varchar DEFAULT 'Vous avez des questions ?',
  	"cta_title" varchar DEFAULT 'Nous sommes là pour vous.',
  	"cta_text" varchar DEFAULT 'Contactez-nous ou venez nous rencontrer lors de notre prochain culte.',
  	"cta_primary" varchar DEFAULT 'Planifier ma visite',
  	"cta_secondary" varchar DEFAULT 'Nous contacter',
  	"cta_image_id" integer,
  	"_status" "enum_page_decouvrir_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_decouvrir_v_version_about_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_decouvrir_v_version_about_highlights_icon" DEFAULT 'heart',
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_decouvrir_v_version_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_decouvrir_v_version_pillars_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_decouvrir_v_version_story_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_decouvrir_v_version_team_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_decouvrir_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Découvrir MKMI Québec',
  	"version_hero_title" varchar DEFAULT 'Une histoire
  *plus grande*
  que nous.',
  	"version_hero_text" varchar DEFAULT 'Une communauté chrétienne passionnée par Jésus, engagée à voir des vies transformées, des familles restaurées et notre génération impactée.',
  	"version_hero_primary" varchar DEFAULT 'Notre vision',
  	"version_hero_secondary" varchar DEFAULT 'Notre église',
  	"version_hero_image_id" integer,
  	"version_about_eyebrow" varchar DEFAULT 'Qui sommes-nous ?',
  	"version_about_title" varchar DEFAULT 'Une famille pour tous les peuples.',
  	"version_about_text" varchar DEFAULT 'MKMI Québec fait partie du réseau international Messianic Kingdom Miracles International. Nous sommes une église locale, multiculturelle et intergénérationnelle, unie par la foi en Jésus-Christ et animée par la mission d’annoncer l’Évangile, de former des disciples et de servir notre communauté.',
  	"version_about_image_id" integer,
  	"version_about_quote_text" varchar DEFAULT 'Ici, nous avons trouvé une famille, des amis et un lieu où notre foi grandit.',
  	"version_about_quote_source" varchar DEFAULT 'Membre de MKMI Québec',
  	"version_story_eyebrow" varchar DEFAULT 'Notre histoire',
  	"version_story_title" varchar DEFAULT 'Un appel qui porte du fruit.',
  	"version_story_text" varchar DEFAULT 'Depuis ses débuts, MKMI est animé par une vision simple : voir le Royaume de Dieu se manifester par des vies transformées à travers le monde. Aujourd’hui, MKMI Québec poursuit cette vision dans notre ville, en lien avec la famille internationale.',
  	"version_vision_eyebrow" varchar DEFAULT 'Notre vision',
  	"version_vision_title" varchar DEFAULT 'Bâtir des vies qui font la différence.',
  	"version_vision_text" varchar DEFAULT 'Nous croyons qu’une église est plus qu’un bâtiment. C’est une famille qui grandit ensemble, qui vit l’amour de Dieu et qui impacte son environnement.',
  	"version_vision_button" varchar DEFAULT 'Découvrir notre église',
  	"version_vision_quote_text" varchar DEFAULT 'Une génération transformée pour transformer son monde.',
  	"version_vision_quote_source" varchar DEFAULT 'Vision de MKMI',
  	"version_team_eyebrow" varchar DEFAULT 'Notre leadership',
  	"version_team_title" varchar DEFAULT 'Une équipe au service de la vision.',
  	"version_team_text" varchar DEFAULT 'Nos pasteurs et leaders servent avec un cœur passionné pour Dieu et pour les personnes. Ils accompagnent notre communauté dans la croissance spirituelle et dans la réalisation de la mission de MKMI Québec.',
  	"version_faith_eyebrow" varchar DEFAULT 'Notre foi',
  	"version_faith_title" varchar DEFAULT 'Une foi enracinée dans la Parole.',
  	"version_faith_text" varchar DEFAULT 'Nous croyons en la Bible comme la Parole inspirée de Dieu, en Jésus-Christ comme Seigneur et Sauveur, en l’œuvre du Saint-Esprit et en la puissance de la prière. Notre foi se traduit par une vie transformée et un service actif.',
  	"version_faith_button" varchar DEFAULT 'Découvrir la foi',
  	"version_faith_image_id" integer,
  	"version_network_eyebrow" varchar DEFAULT 'Notre famille internationale',
  	"version_network_title" varchar DEFAULT 'Un réseau, une même mission.',
  	"version_network_text" varchar DEFAULT 'MKMI est présent dans plusieurs pays à travers le monde. Ensemble, nous partageons la même vision : voir le Royaume de Dieu se manifester et impacter les nations.',
  	"version_network_button" varchar DEFAULT 'Découvrir nos missions',
  	"version_cta_eyebrow" varchar DEFAULT 'Vous avez des questions ?',
  	"version_cta_title" varchar DEFAULT 'Nous sommes là pour vous.',
  	"version_cta_text" varchar DEFAULT 'Contactez-nous ou venez nous rencontrer lors de notre prochain culte.',
  	"version_cta_primary" varchar DEFAULT 'Planifier ma visite',
  	"version_cta_secondary" varchar DEFAULT 'Nous contacter',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_decouvrir_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_ministeres_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_ministeres_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_ministeres_serve_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_ministeres_serve_steps_icon" DEFAULT 'heart',
  	"title" varchar
  );
  
  CREATE TABLE "page_ministeres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Ministères',
  	"hero_title" varchar DEFAULT 'Des talents au service
  *du Royaume.*',
  	"hero_text" varchar DEFAULT 'Nos ministères sont des espaces où chacun peut grandir, servir et faire une différence. Découvrez comment vous pouvez vous impliquer et utiliser vos dons pour l’édification de notre communauté et l’avancement de l’Évangile.',
  	"hero_primary" varchar DEFAULT 'Découvrir nos ministères',
  	"hero_secondary" varchar DEFAULT 'Commencer à servir',
  	"hero_image_id" integer,
  	"hero_quote_text" varchar DEFAULT 'Chacun selon le don qu’il a reçu, mettez-le au service des autres, comme de bons gestionnaires de la grâce de Dieu.',
  	"hero_quote_source" varchar DEFAULT '1 Pierre 4:10',
  	"list_eyebrow" varchar DEFAULT 'Nos ministères',
  	"list_title" varchar DEFAULT 'Découvrez nos ministères.',
  	"list_text" varchar DEFAULT 'Cliquez sur un ministère pour en savoir plus et découvrir comment vous impliquer.',
  	"serve_eyebrow" varchar DEFAULT 'S’impliquer',
  	"serve_title" varchar DEFAULT 'Vous avez un don. Il y a une place pour vous.',
  	"serve_text" varchar DEFAULT 'Quel que soit votre âge, votre expérience ou vos talents, vous pouvez vous impliquer dans l’un de nos ministères et contribuer à l’œuvre de Dieu.',
  	"serve_button" varchar DEFAULT 'Commencer à servir',
  	"serve_image_id" integer,
  	"spotlight_eyebrow" varchar DEFAULT 'À la une',
  	"spotlight_button" varchar DEFAULT 'En savoir plus',
  	"spotlight_ministry_name" varchar DEFAULT 'Jeunesse',
  	"spotlight_activities_title" varchar DEFAULT 'Prochaines activités',
  	"cta_eyebrow" varchar DEFAULT 'Ensemble pour un plus grand impact',
  	"cta_title" varchar DEFAULT 'Rejoignez un ministère aujourd’hui.',
  	"cta_text" varchar DEFAULT 'Servir, c’est faire partie de quelque chose de plus grand.',
  	"cta_primary" varchar DEFAULT 'M’impliquer maintenant',
  	"cta_image_id" integer,
  	"_status" "enum_page_ministeres_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_ministeres_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_ministeres_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_ministeres_v_version_serve_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_ministeres_v_version_serve_steps_icon" DEFAULT 'heart',
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_ministeres_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Ministères',
  	"version_hero_title" varchar DEFAULT 'Des talents au service
  *du Royaume.*',
  	"version_hero_text" varchar DEFAULT 'Nos ministères sont des espaces où chacun peut grandir, servir et faire une différence. Découvrez comment vous pouvez vous impliquer et utiliser vos dons pour l’édification de notre communauté et l’avancement de l’Évangile.',
  	"version_hero_primary" varchar DEFAULT 'Découvrir nos ministères',
  	"version_hero_secondary" varchar DEFAULT 'Commencer à servir',
  	"version_hero_image_id" integer,
  	"version_hero_quote_text" varchar DEFAULT 'Chacun selon le don qu’il a reçu, mettez-le au service des autres, comme de bons gestionnaires de la grâce de Dieu.',
  	"version_hero_quote_source" varchar DEFAULT '1 Pierre 4:10',
  	"version_list_eyebrow" varchar DEFAULT 'Nos ministères',
  	"version_list_title" varchar DEFAULT 'Découvrez nos ministères.',
  	"version_list_text" varchar DEFAULT 'Cliquez sur un ministère pour en savoir plus et découvrir comment vous impliquer.',
  	"version_serve_eyebrow" varchar DEFAULT 'S’impliquer',
  	"version_serve_title" varchar DEFAULT 'Vous avez un don. Il y a une place pour vous.',
  	"version_serve_text" varchar DEFAULT 'Quel que soit votre âge, votre expérience ou vos talents, vous pouvez vous impliquer dans l’un de nos ministères et contribuer à l’œuvre de Dieu.',
  	"version_serve_button" varchar DEFAULT 'Commencer à servir',
  	"version_serve_image_id" integer,
  	"version_spotlight_eyebrow" varchar DEFAULT 'À la une',
  	"version_spotlight_button" varchar DEFAULT 'En savoir plus',
  	"version_spotlight_ministry_name" varchar DEFAULT 'Jeunesse',
  	"version_spotlight_activities_title" varchar DEFAULT 'Prochaines activités',
  	"version_cta_eyebrow" varchar DEFAULT 'Ensemble pour un plus grand impact',
  	"version_cta_title" varchar DEFAULT 'Rejoignez un ministère aujourd’hui.',
  	"version_cta_text" varchar DEFAULT 'Servir, c’est faire partie de quelque chose de plus grand.',
  	"version_cta_primary" varchar DEFAULT 'M’impliquer maintenant',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_ministeres_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Messages',
  	"hero_title" varchar DEFAULT 'Des enseignements pour *aujourd’hui* et pour *demain.*',
  	"hero_text" varchar DEFAULT 'Découvrez nos prédications, études bibliques et enseignements qui vous encouragent à grandir dans la foi et à vivre la Parole au quotidien.',
  	"hero_primary" varchar DEFAULT 'Regarder le dernier message',
  	"hero_secondary" varchar DEFAULT 'Écouter le balado',
  	"hero_image_id" integer,
  	"hero_quote_text" varchar DEFAULT 'Ta Parole est une lampe à mes pieds et une lumière sur mon sentier.',
  	"hero_quote_source" varchar DEFAULT 'Psaume 119:105',
  	"featured_eyebrow" varchar DEFAULT 'Message de la semaine',
  	"library_title" varchar DEFAULT 'Tous les messages',
  	"podcast_eyebrow" varchar DEFAULT 'Balado',
  	"podcast_title" varchar DEFAULT 'Emportez la Parole avec vous.',
  	"podcast_text" varchar DEFAULT 'Écoutez nos messages partout : en voiture, au travail ou à la maison.',
  	"podcast_spotify_url" varchar,
  	"podcast_apple_podcasts_url" varchar,
  	"podcast_youtube_channel_url" varchar,
  	"newsletter_eyebrow" varchar DEFAULT 'Restez informé',
  	"newsletter_title" varchar DEFAULT 'Recevez nos nouveaux messages',
  	"newsletter_text" varchar DEFAULT 'Inscrivez-vous pour être informé lorsqu’un nouveau message est publié.',
  	"_status" "enum_page_messages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_messages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Messages',
  	"version_hero_title" varchar DEFAULT 'Des enseignements pour *aujourd’hui* et pour *demain.*',
  	"version_hero_text" varchar DEFAULT 'Découvrez nos prédications, études bibliques et enseignements qui vous encouragent à grandir dans la foi et à vivre la Parole au quotidien.',
  	"version_hero_primary" varchar DEFAULT 'Regarder le dernier message',
  	"version_hero_secondary" varchar DEFAULT 'Écouter le balado',
  	"version_hero_image_id" integer,
  	"version_hero_quote_text" varchar DEFAULT 'Ta Parole est une lampe à mes pieds et une lumière sur mon sentier.',
  	"version_hero_quote_source" varchar DEFAULT 'Psaume 119:105',
  	"version_featured_eyebrow" varchar DEFAULT 'Message de la semaine',
  	"version_library_title" varchar DEFAULT 'Tous les messages',
  	"version_podcast_eyebrow" varchar DEFAULT 'Balado',
  	"version_podcast_title" varchar DEFAULT 'Emportez la Parole avec vous.',
  	"version_podcast_text" varchar DEFAULT 'Écoutez nos messages partout : en voiture, au travail ou à la maison.',
  	"version_podcast_spotify_url" varchar,
  	"version_podcast_apple_podcasts_url" varchar,
  	"version_podcast_youtube_channel_url" varchar,
  	"version_newsletter_eyebrow" varchar DEFAULT 'Restez informé',
  	"version_newsletter_title" varchar DEFAULT 'Recevez nos nouveaux messages',
  	"version_newsletter_text" varchar DEFAULT 'Inscrivez-vous pour être informé lorsqu’un nouveau message est publié.',
  	"version__status" "enum__page_messages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_evenements_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_evenements_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_evenements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Événements',
  	"hero_title" varchar DEFAULT 'Des rencontres
  qui *transforment.*',
  	"hero_text" varchar DEFAULT 'Rejoignez-nous pour des moments de louange, d’enseignement, de prière et de communion. Nos événements sont des occasions de grandir dans la foi, de développer des relations et d’impacter notre communauté.',
  	"hero_primary" varchar DEFAULT 'Voir les prochains événements',
  	"hero_secondary" varchar DEFAULT 'Planifier ma visite',
  	"hero_image_id" integer,
  	"hero_quote_text" varchar DEFAULT 'Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux.',
  	"hero_quote_source" varchar DEFAULT 'Matthieu 18:20',
  	"featured_eyebrow" varchar DEFAULT 'Événement à la une',
  	"list_title" varchar DEFAULT 'Tous les événements',
  	"newsletter_eyebrow" varchar DEFAULT 'Restez informé',
  	"newsletter_title" varchar DEFAULT 'Ne manquez aucun événement.',
  	"newsletter_text" varchar DEFAULT 'Inscrivez-vous pour recevoir nos prochains événements, infos et rappels directement dans votre boîte courriel.',
  	"newsletter_image_id" integer,
  	"_status" "enum_page_evenements_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_evenements_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_evenements_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_evenements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Événements',
  	"version_hero_title" varchar DEFAULT 'Des rencontres
  qui *transforment.*',
  	"version_hero_text" varchar DEFAULT 'Rejoignez-nous pour des moments de louange, d’enseignement, de prière et de communion. Nos événements sont des occasions de grandir dans la foi, de développer des relations et d’impacter notre communauté.',
  	"version_hero_primary" varchar DEFAULT 'Voir les prochains événements',
  	"version_hero_secondary" varchar DEFAULT 'Planifier ma visite',
  	"version_hero_image_id" integer,
  	"version_hero_quote_text" varchar DEFAULT 'Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux.',
  	"version_hero_quote_source" varchar DEFAULT 'Matthieu 18:20',
  	"version_featured_eyebrow" varchar DEFAULT 'Événement à la une',
  	"version_list_title" varchar DEFAULT 'Tous les événements',
  	"version_newsletter_eyebrow" varchar DEFAULT 'Restez informé',
  	"version_newsletter_title" varchar DEFAULT 'Ne manquez aucun événement.',
  	"version_newsletter_text" varchar DEFAULT 'Inscrivez-vous pour recevoir nos prochains événements, infos et rappels directement dans votre boîte courriel.',
  	"version_newsletter_image_id" integer,
  	"version__status" "enum__page_evenements_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_missions_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_missions_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_missions_involve_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_missions_involve_ways_icon" DEFAULT 'heart',
  	"title" varchar,
  	"link" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_missions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Missions',
  	"hero_title" varchar DEFAULT 'L’Évangile
  *sans frontières.*',
  	"hero_text" varchar DEFAULT 'Nous croyons qu’une église locale fait partie d’une vision plus grande. Ensemble, nous soutenons des initiatives qui transforment des vies au Québec, au Canada et dans le monde.',
  	"hero_primary" varchar DEFAULT 'Découvrir nos missions',
  	"hero_secondary" varchar DEFAULT 'M’impliquer',
  	"hero_image_id" integer,
  	"vision_eyebrow" varchar DEFAULT 'Notre vision',
  	"vision_title" varchar DEFAULT 'Une Église en mouvement pour un monde transformé.',
  	"vision_text" varchar DEFAULT 'MKMI Québec s’inscrit dans le réseau international MKMI et soutient des initiatives missionnaires locales et internationales. Nous croyons que l’Évangile transforme les individus, les familles, les communautés et les nations.',
  	"vision_image_id" integer,
  	"vision_quote_text" varchar DEFAULT 'Allez par tout le monde et prêchez la bonne nouvelle à toute la création.',
  	"vision_quote_source" varchar DEFAULT 'Marc 16:15',
  	"fields_eyebrow" varchar DEFAULT 'Nos champs d’action',
  	"fields_title" varchar DEFAULT 'Des missions ici et ailleurs.',
  	"presence_eyebrow" varchar DEFAULT 'Notre empreinte',
  	"presence_title" varchar DEFAULT 'Une présence qui fait la différence.',
  	"presence_text" varchar DEFAULT 'À travers nos partenaires et nos initiatives, nous contribuons à l’avancement de l’Évangile dans plusieurs régions du monde.',
  	"involve_eyebrow" varchar DEFAULT 'Comment vous impliquer ?',
  	"involve_title" varchar DEFAULT 'Faites partie de la mission.',
  	"involve_text" varchar DEFAULT 'Il existe plusieurs façons de contribuer et de faire une différence dans l’avancement de l’Évangile.',
  	"testimonials_eyebrow" varchar DEFAULT 'Témoignages',
  	"testimonials_title" varchar DEFAULT 'Des vies transformées.',
  	"cta_eyebrow" varchar DEFAULT 'Ensemble pour plus d’impact',
  	"cta_title" varchar DEFAULT 'Soutenons la mission.',
  	"cta_text" varchar DEFAULT 'Votre générosité et votre engagement permettent de transformer des vies et d’étendre l’Évangile plus loin.',
  	"cta_primary" varchar DEFAULT 'Faire un don',
  	"cta_secondary" varchar DEFAULT 'En savoir plus',
  	"cta_image_id" integer,
  	"_status" "enum_page_missions_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_missions_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_missions_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_missions_v_version_involve_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_missions_v_version_involve_ways_icon" DEFAULT 'heart',
  	"title" varchar,
  	"link" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_missions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Missions',
  	"version_hero_title" varchar DEFAULT 'L’Évangile
  *sans frontières.*',
  	"version_hero_text" varchar DEFAULT 'Nous croyons qu’une église locale fait partie d’une vision plus grande. Ensemble, nous soutenons des initiatives qui transforment des vies au Québec, au Canada et dans le monde.',
  	"version_hero_primary" varchar DEFAULT 'Découvrir nos missions',
  	"version_hero_secondary" varchar DEFAULT 'M’impliquer',
  	"version_hero_image_id" integer,
  	"version_vision_eyebrow" varchar DEFAULT 'Notre vision',
  	"version_vision_title" varchar DEFAULT 'Une Église en mouvement pour un monde transformé.',
  	"version_vision_text" varchar DEFAULT 'MKMI Québec s’inscrit dans le réseau international MKMI et soutient des initiatives missionnaires locales et internationales. Nous croyons que l’Évangile transforme les individus, les familles, les communautés et les nations.',
  	"version_vision_image_id" integer,
  	"version_vision_quote_text" varchar DEFAULT 'Allez par tout le monde et prêchez la bonne nouvelle à toute la création.',
  	"version_vision_quote_source" varchar DEFAULT 'Marc 16:15',
  	"version_fields_eyebrow" varchar DEFAULT 'Nos champs d’action',
  	"version_fields_title" varchar DEFAULT 'Des missions ici et ailleurs.',
  	"version_presence_eyebrow" varchar DEFAULT 'Notre empreinte',
  	"version_presence_title" varchar DEFAULT 'Une présence qui fait la différence.',
  	"version_presence_text" varchar DEFAULT 'À travers nos partenaires et nos initiatives, nous contribuons à l’avancement de l’Évangile dans plusieurs régions du monde.',
  	"version_involve_eyebrow" varchar DEFAULT 'Comment vous impliquer ?',
  	"version_involve_title" varchar DEFAULT 'Faites partie de la mission.',
  	"version_involve_text" varchar DEFAULT 'Il existe plusieurs façons de contribuer et de faire une différence dans l’avancement de l’Évangile.',
  	"version_testimonials_eyebrow" varchar DEFAULT 'Témoignages',
  	"version_testimonials_title" varchar DEFAULT 'Des vies transformées.',
  	"version_cta_eyebrow" varchar DEFAULT 'Ensemble pour plus d’impact',
  	"version_cta_title" varchar DEFAULT 'Soutenons la mission.',
  	"version_cta_text" varchar DEFAULT 'Votre générosité et votre engagement permettent de transformer des vies et d’étendre l’Évangile plus loin.',
  	"version_cta_primary" varchar DEFAULT 'Faire un don',
  	"version_cta_secondary" varchar DEFAULT 'En savoir plus',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_missions_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_priere_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_priere_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_priere_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_priere" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Prière',
  	"hero_title" varchar DEFAULT 'Vous n’êtes pas seul. *Nous prions avec vous.*',
  	"hero_text" varchar DEFAULT 'Peu importe ce que vous traversez, notre équipe et notre communauté sont là pour vous soutenir dans la prière. Dieu écoute et il agit aujourd’hui.',
  	"hero_primary" varchar DEFAULT 'Envoyer une demande de prière',
  	"hero_secondary" varchar DEFAULT 'Comment ça fonctionne',
  	"hero_image_id" integer,
  	"hero_quote_text" varchar DEFAULT 'Invoque-moi, et je te répondrai ; je te ferai connaître de grandes choses, des choses cachées que tu ne connais pas.',
  	"hero_quote_source" varchar DEFAULT 'Jérémie 33:3',
  	"request_eyebrow" varchar DEFAULT 'Demande de prière',
  	"request_title" varchar DEFAULT 'Nous voulons prier avec vous.',
  	"request_text" varchar DEFAULT 'Remplissez le formulaire et notre équipe priera pour votre situation. Vous pouvez nous partager votre sujet de prière en toute confiance.',
  	"request_image_id" integer,
  	"request_form_title" varchar DEFAULT 'Envoyez votre demande de prière',
  	"request_quote_text" varchar DEFAULT 'Là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux.',
  	"request_quote_source" varchar DEFAULT 'Matthieu 18:20',
  	"others_title" varchar DEFAULT 'Autres façons de prier avec nous',
  	"process_eyebrow" varchar DEFAULT 'Notre processus',
  	"process_title" varchar DEFAULT 'Comment ça fonctionne ?',
  	"testimonials_eyebrow" varchar DEFAULT 'Témoignages',
  	"testimonials_title" varchar DEFAULT 'Des vies transformées par la prière.',
  	"testimonials_text" varchar DEFAULT 'Découvrez comment Dieu répond encore aujourd’hui aux prières de son peuple.',
  	"testimonials_button" varchar DEFAULT 'Partager votre témoignage',
  	"cta_eyebrow" varchar DEFAULT 'Ne cessez de prier',
  	"cta_title" varchar DEFAULT 'Une communauté qui tient devant Dieu ensemble.',
  	"cta_text" varchar DEFAULT 'Joignez-vous à nos temps de prière et expérimentez la puissance d’une foi unie.',
  	"cta_primary" varchar DEFAULT 'Voir nos temps de prière',
  	"cta_image_id" integer,
  	"_status" "enum_page_priere_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_priere_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_priere_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_priere_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_priere_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Prière',
  	"version_hero_title" varchar DEFAULT 'Vous n’êtes pas seul. *Nous prions avec vous.*',
  	"version_hero_text" varchar DEFAULT 'Peu importe ce que vous traversez, notre équipe et notre communauté sont là pour vous soutenir dans la prière. Dieu écoute et il agit aujourd’hui.',
  	"version_hero_primary" varchar DEFAULT 'Envoyer une demande de prière',
  	"version_hero_secondary" varchar DEFAULT 'Comment ça fonctionne',
  	"version_hero_image_id" integer,
  	"version_hero_quote_text" varchar DEFAULT 'Invoque-moi, et je te répondrai ; je te ferai connaître de grandes choses, des choses cachées que tu ne connais pas.',
  	"version_hero_quote_source" varchar DEFAULT 'Jérémie 33:3',
  	"version_request_eyebrow" varchar DEFAULT 'Demande de prière',
  	"version_request_title" varchar DEFAULT 'Nous voulons prier avec vous.',
  	"version_request_text" varchar DEFAULT 'Remplissez le formulaire et notre équipe priera pour votre situation. Vous pouvez nous partager votre sujet de prière en toute confiance.',
  	"version_request_image_id" integer,
  	"version_request_form_title" varchar DEFAULT 'Envoyez votre demande de prière',
  	"version_request_quote_text" varchar DEFAULT 'Là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux.',
  	"version_request_quote_source" varchar DEFAULT 'Matthieu 18:20',
  	"version_others_title" varchar DEFAULT 'Autres façons de prier avec nous',
  	"version_process_eyebrow" varchar DEFAULT 'Notre processus',
  	"version_process_title" varchar DEFAULT 'Comment ça fonctionne ?',
  	"version_testimonials_eyebrow" varchar DEFAULT 'Témoignages',
  	"version_testimonials_title" varchar DEFAULT 'Des vies transformées par la prière.',
  	"version_testimonials_text" varchar DEFAULT 'Découvrez comment Dieu répond encore aujourd’hui aux prières de son peuple.',
  	"version_testimonials_button" varchar DEFAULT 'Partager votre témoignage',
  	"version_cta_eyebrow" varchar DEFAULT 'Ne cessez de prier',
  	"version_cta_title" varchar DEFAULT 'Une communauté qui tient devant Dieu ensemble.',
  	"version_cta_text" varchar DEFAULT 'Joignez-vous à nos temps de prière et expérimentez la puissance d’une foi unie.',
  	"version_cta_primary" varchar DEFAULT 'Voir nos temps de prière',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_priere_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_don_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_don_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_don_impact_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_don_impact_uses_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_don" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Donner',
  	"hero_title" varchar DEFAULT 'Donner *avec joie.*',
  	"hero_text" varchar DEFAULT 'Chaque don, petit ou grand, permet à MKMI Québec d’accueillir, d’enseigner, d’aider les familles et de porter l’Évangile plus loin. Merci de faire partie de cette mission.',
  	"hero_primary" varchar DEFAULT 'Faire un don en ligne',
  	"hero_secondary" varchar DEFAULT 'À quoi sert votre don',
  	"hero_image_id" integer,
  	"hero_quote_text" varchar DEFAULT 'Que chacun donne comme il l’a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie.',
  	"hero_quote_source" varchar DEFAULT '2 Corinthiens 9:7',
  	"ways_eyebrow" varchar DEFAULT 'Façons de donner',
  	"ways_title" varchar DEFAULT 'Choisissez la façon qui vous convient.',
  	"ways_text" varchar DEFAULT 'Simple, rapide et sécurisé : donnez là où vous êtes.',
  	"ways_online_text" varchar DEFAULT 'Par carte, en quelques clics, depuis votre téléphone ou votre ordinateur.',
  	"ways_interac_email" varchar,
  	"ways_interac_note" varchar,
  	"ways_mailing_address" varchar,
  	"ways_in_person_note" varchar DEFAULT 'Pendant le culte, lors du temps des offrandes.',
  	"impact_eyebrow" varchar DEFAULT 'Votre don fait la différence',
  	"impact_title" varchar DEFAULT 'À quoi sert votre générosité.',
  	"impact_text" varchar DEFAULT 'Vos dons sont investis là où ils portent du fruit, pour notre ville et au-delà.',
  	"impact_image_id" integer,
  	"trust_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"trust_title" varchar DEFAULT 'Donner en toute confiance.',
  	"trust_text" varchar DEFAULT 'Vos dons sont reçus avec reconnaissance et gérés avec intégrité.',
  	"trust_charity_number" varchar,
  	"trust_tax_receipts" boolean DEFAULT false,
  	"cta_eyebrow" varchar DEFAULT 'Merci',
  	"cta_title" varchar DEFAULT 'Ensemble, nous allons plus loin.',
  	"cta_text" varchar DEFAULT 'Votre générosité rend possible chaque rencontre, chaque projet et chaque vie touchée.',
  	"cta_primary" varchar DEFAULT 'Faire un don',
  	"cta_secondary" varchar DEFAULT 'Nous contacter',
  	"cta_image_id" integer,
  	"_status" "enum_page_don_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_don_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_don_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_don_v_version_impact_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_don_v_version_impact_uses_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_don_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Donner',
  	"version_hero_title" varchar DEFAULT 'Donner *avec joie.*',
  	"version_hero_text" varchar DEFAULT 'Chaque don, petit ou grand, permet à MKMI Québec d’accueillir, d’enseigner, d’aider les familles et de porter l’Évangile plus loin. Merci de faire partie de cette mission.',
  	"version_hero_primary" varchar DEFAULT 'Faire un don en ligne',
  	"version_hero_secondary" varchar DEFAULT 'À quoi sert votre don',
  	"version_hero_image_id" integer,
  	"version_hero_quote_text" varchar DEFAULT 'Que chacun donne comme il l’a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie.',
  	"version_hero_quote_source" varchar DEFAULT '2 Corinthiens 9:7',
  	"version_ways_eyebrow" varchar DEFAULT 'Façons de donner',
  	"version_ways_title" varchar DEFAULT 'Choisissez la façon qui vous convient.',
  	"version_ways_text" varchar DEFAULT 'Simple, rapide et sécurisé : donnez là où vous êtes.',
  	"version_ways_online_text" varchar DEFAULT 'Par carte, en quelques clics, depuis votre téléphone ou votre ordinateur.',
  	"version_ways_interac_email" varchar,
  	"version_ways_interac_note" varchar,
  	"version_ways_mailing_address" varchar,
  	"version_ways_in_person_note" varchar DEFAULT 'Pendant le culte, lors du temps des offrandes.',
  	"version_impact_eyebrow" varchar DEFAULT 'Votre don fait la différence',
  	"version_impact_title" varchar DEFAULT 'À quoi sert votre générosité.',
  	"version_impact_text" varchar DEFAULT 'Vos dons sont investis là où ils portent du fruit, pour notre ville et au-delà.',
  	"version_impact_image_id" integer,
  	"version_trust_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"version_trust_title" varchar DEFAULT 'Donner en toute confiance.',
  	"version_trust_text" varchar DEFAULT 'Vos dons sont reçus avec reconnaissance et gérés avec intégrité.',
  	"version_trust_charity_number" varchar,
  	"version_trust_tax_receipts" boolean DEFAULT false,
  	"version_cta_eyebrow" varchar DEFAULT 'Merci',
  	"version_cta_title" varchar DEFAULT 'Ensemble, nous allons plus loin.',
  	"version_cta_text" varchar DEFAULT 'Votre générosité rend possible chaque rencontre, chaque projet et chaque vie touchée.',
  	"version_cta_primary" varchar DEFAULT 'Faire un don',
  	"version_cta_secondary" varchar DEFAULT 'Nous contacter',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_don_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_contact_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "page_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Nous contacter',
  	"hero_title" varchar DEFAULT 'Nous serions heureux
  de *vous rencontrer.*',
  	"hero_text" varchar DEFAULT 'Que vous ayez une question, un besoin de prière ou désiriez en savoir plus sur notre église, notre équipe est là pour vous.',
  	"hero_primary" varchar DEFAULT 'Nous écrire',
  	"hero_secondary" varchar DEFAULT 'Planifier ma visite',
  	"hero_image_id" integer,
  	"info_office_hours" varchar DEFAULT 'Heures à confirmer',
  	"visit_eyebrow" varchar DEFAULT 'Visitez-nous',
  	"visit_title" varchar DEFAULT 'Nous avons hâte de vous accueillir.',
  	"visit_text" varchar DEFAULT 'Venez vivre un temps de louange, de prière et d’enseignement dans une atmosphère chaleureuse et familiale.',
  	"visit_button" varchar DEFAULT 'Planifier ma première visite',
  	"visit_image_id" integer,
  	"form_eyebrow" varchar DEFAULT 'Écrivez-nous',
  	"form_title" varchar DEFAULT 'Une question ? Un besoin de prière ?',
  	"form_text" varchar DEFAULT 'Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.',
  	"others_eyebrow" varchar DEFAULT 'Autres moyens de nous joindre',
  	"others_title" varchar DEFAULT 'Restons en contact.',
  	"faq_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"faq_title" varchar DEFAULT 'Vous avez une question ?',
  	"faq_text" varchar DEFAULT 'Voici les réponses aux questions les plus courantes. Si vous ne trouvez pas l’information recherchée, n’hésitez pas à nous écrire.',
  	"cta_eyebrow" varchar DEFAULT 'Une église proche de vous',
  	"cta_title" varchar DEFAULT 'Vous n’êtes pas seul.',
  	"cta_text" varchar DEFAULT 'Nous sommes là pour vous écouter, vous accompagner et marcher avec vous.',
  	"cta_primary" varchar DEFAULT 'Demander une prière',
  	"cta_secondary" varchar DEFAULT 'Nous écrire',
  	"cta_image_id" integer,
  	"_status" "enum_page_contact_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_contact_v_version_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Nous contacter',
  	"version_hero_title" varchar DEFAULT 'Nous serions heureux
  de *vous rencontrer.*',
  	"version_hero_text" varchar DEFAULT 'Que vous ayez une question, un besoin de prière ou désiriez en savoir plus sur notre église, notre équipe est là pour vous.',
  	"version_hero_primary" varchar DEFAULT 'Nous écrire',
  	"version_hero_secondary" varchar DEFAULT 'Planifier ma visite',
  	"version_hero_image_id" integer,
  	"version_info_office_hours" varchar DEFAULT 'Heures à confirmer',
  	"version_visit_eyebrow" varchar DEFAULT 'Visitez-nous',
  	"version_visit_title" varchar DEFAULT 'Nous avons hâte de vous accueillir.',
  	"version_visit_text" varchar DEFAULT 'Venez vivre un temps de louange, de prière et d’enseignement dans une atmosphère chaleureuse et familiale.',
  	"version_visit_button" varchar DEFAULT 'Planifier ma première visite',
  	"version_visit_image_id" integer,
  	"version_form_eyebrow" varchar DEFAULT 'Écrivez-nous',
  	"version_form_title" varchar DEFAULT 'Une question ? Un besoin de prière ?',
  	"version_form_text" varchar DEFAULT 'Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.',
  	"version_others_eyebrow" varchar DEFAULT 'Autres moyens de nous joindre',
  	"version_others_title" varchar DEFAULT 'Restons en contact.',
  	"version_faq_eyebrow" varchar DEFAULT 'Questions fréquentes',
  	"version_faq_title" varchar DEFAULT 'Vous avez une question ?',
  	"version_faq_text" varchar DEFAULT 'Voici les réponses aux questions les plus courantes. Si vous ne trouvez pas l’information recherchée, n’hésitez pas à nous écrire.',
  	"version_cta_eyebrow" varchar DEFAULT 'Une église proche de vous',
  	"version_cta_title" varchar DEFAULT 'Vous n’êtes pas seul.',
  	"version_cta_text" varchar DEFAULT 'Nous sommes là pour vous écouter, vous accompagner et marcher avec vous.',
  	"version_cta_primary" varchar DEFAULT 'Demander une prière',
  	"version_cta_secondary" varchar DEFAULT 'Nous écrire',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_contact_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "pages_content_eglise_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content_decouvrir_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content_decouvrir_leaders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_content" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_content_eglise_faq" CASCADE;
  DROP TABLE "pages_content_decouvrir_timeline" CASCADE;
  DROP TABLE "pages_content_decouvrir_leaders" CASCADE;
  DROP TABLE "pages_content" CASCADE;
  ALTER TABLE "home_page_welcome_cards" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "home_page_pillars_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "home_page_missions_zones" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "_status" "enum_home_page_status" DEFAULT 'draft';
  ALTER TABLE "_home_page_v_version_hero_lines" ADD CONSTRAINT "_home_page_v_version_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_welcome_cards" ADD CONSTRAINT "_home_page_v_version_welcome_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_welcome_cards" ADD CONSTRAINT "_home_page_v_version_welcome_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_pillars_items" ADD CONSTRAINT "_home_page_v_version_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_missions_zones" ADD CONSTRAINT "_home_page_v_version_missions_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_pillars_background_id_media_id_fk" FOREIGN KEY ("version_pillars_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_prayer_image_id_media_id_fk" FOREIGN KEY ("version_prayer_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_final_cta_background_id_media_id_fk" FOREIGN KEY ("version_final_cta_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_eglise_features_items" ADD CONSTRAINT "page_eglise_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_eglise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_eglise_groups_cards" ADD CONSTRAINT "page_eglise_groups_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_eglise_groups_cards" ADD CONSTRAINT "page_eglise_groups_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_eglise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_eglise_membership_steps" ADD CONSTRAINT "page_eglise_membership_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_eglise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_eglise_faq_questions" ADD CONSTRAINT "page_eglise_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_eglise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_eglise" ADD CONSTRAINT "page_eglise_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_eglise" ADD CONSTRAINT "page_eglise_welcome_image_id_media_id_fk" FOREIGN KEY ("welcome_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_eglise" ADD CONSTRAINT "page_eglise_membership_image_id_media_id_fk" FOREIGN KEY ("membership_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_eglise" ADD CONSTRAINT "page_eglise_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_eglise_v_version_features_items" ADD CONSTRAINT "_page_eglise_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_eglise_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_eglise_v_version_groups_cards" ADD CONSTRAINT "_page_eglise_v_version_groups_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_eglise_v_version_groups_cards" ADD CONSTRAINT "_page_eglise_v_version_groups_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_eglise_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_eglise_v_version_membership_steps" ADD CONSTRAINT "_page_eglise_v_version_membership_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_eglise_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_eglise_v_version_faq_questions" ADD CONSTRAINT "_page_eglise_v_version_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_eglise_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_eglise_v" ADD CONSTRAINT "_page_eglise_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_eglise_v" ADD CONSTRAINT "_page_eglise_v_version_welcome_image_id_media_id_fk" FOREIGN KEY ("version_welcome_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_eglise_v" ADD CONSTRAINT "_page_eglise_v_version_membership_image_id_media_id_fk" FOREIGN KEY ("version_membership_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_eglise_v" ADD CONSTRAINT "_page_eglise_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_decouvrir_about_highlights" ADD CONSTRAINT "page_decouvrir_about_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_decouvrir"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_decouvrir_pillars_items" ADD CONSTRAINT "page_decouvrir_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_decouvrir"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_decouvrir_story_timeline" ADD CONSTRAINT "page_decouvrir_story_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_decouvrir"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_decouvrir_team_leaders" ADD CONSTRAINT "page_decouvrir_team_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_decouvrir_team_leaders" ADD CONSTRAINT "page_decouvrir_team_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_decouvrir"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_decouvrir" ADD CONSTRAINT "page_decouvrir_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_decouvrir" ADD CONSTRAINT "page_decouvrir_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_decouvrir" ADD CONSTRAINT "page_decouvrir_faith_image_id_media_id_fk" FOREIGN KEY ("faith_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_decouvrir" ADD CONSTRAINT "page_decouvrir_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v_version_about_highlights" ADD CONSTRAINT "_page_decouvrir_v_version_about_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_decouvrir_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v_version_pillars_items" ADD CONSTRAINT "_page_decouvrir_v_version_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_decouvrir_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v_version_story_timeline" ADD CONSTRAINT "_page_decouvrir_v_version_story_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_decouvrir_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v_version_team_leaders" ADD CONSTRAINT "_page_decouvrir_v_version_team_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v_version_team_leaders" ADD CONSTRAINT "_page_decouvrir_v_version_team_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_decouvrir_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v" ADD CONSTRAINT "_page_decouvrir_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v" ADD CONSTRAINT "_page_decouvrir_v_version_about_image_id_media_id_fk" FOREIGN KEY ("version_about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v" ADD CONSTRAINT "_page_decouvrir_v_version_faith_image_id_media_id_fk" FOREIGN KEY ("version_faith_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_decouvrir_v" ADD CONSTRAINT "_page_decouvrir_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_ministeres_features_items" ADD CONSTRAINT "page_ministeres_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_ministeres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_ministeres_serve_steps" ADD CONSTRAINT "page_ministeres_serve_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_ministeres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_ministeres" ADD CONSTRAINT "page_ministeres_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_ministeres" ADD CONSTRAINT "page_ministeres_serve_image_id_media_id_fk" FOREIGN KEY ("serve_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_ministeres" ADD CONSTRAINT "page_ministeres_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_ministeres_v_version_features_items" ADD CONSTRAINT "_page_ministeres_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_ministeres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_ministeres_v_version_serve_steps" ADD CONSTRAINT "_page_ministeres_v_version_serve_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_ministeres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_ministeres_v" ADD CONSTRAINT "_page_ministeres_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_ministeres_v" ADD CONSTRAINT "_page_ministeres_v_version_serve_image_id_media_id_fk" FOREIGN KEY ("version_serve_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_ministeres_v" ADD CONSTRAINT "_page_ministeres_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_messages" ADD CONSTRAINT "page_messages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_messages_v" ADD CONSTRAINT "_page_messages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_evenements_features_items" ADD CONSTRAINT "page_evenements_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_evenements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_evenements" ADD CONSTRAINT "page_evenements_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_evenements" ADD CONSTRAINT "page_evenements_newsletter_image_id_media_id_fk" FOREIGN KEY ("newsletter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_evenements_v_version_features_items" ADD CONSTRAINT "_page_evenements_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_evenements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_evenements_v" ADD CONSTRAINT "_page_evenements_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_evenements_v" ADD CONSTRAINT "_page_evenements_v_version_newsletter_image_id_media_id_fk" FOREIGN KEY ("version_newsletter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_missions_features_items" ADD CONSTRAINT "page_missions_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_missions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_missions_involve_ways" ADD CONSTRAINT "page_missions_involve_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_missions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_missions" ADD CONSTRAINT "page_missions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_missions" ADD CONSTRAINT "page_missions_vision_image_id_media_id_fk" FOREIGN KEY ("vision_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_missions" ADD CONSTRAINT "page_missions_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_missions_v_version_features_items" ADD CONSTRAINT "_page_missions_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_missions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_missions_v_version_involve_ways" ADD CONSTRAINT "_page_missions_v_version_involve_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_missions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_missions_v" ADD CONSTRAINT "_page_missions_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_missions_v" ADD CONSTRAINT "_page_missions_v_version_vision_image_id_media_id_fk" FOREIGN KEY ("version_vision_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_missions_v" ADD CONSTRAINT "_page_missions_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_priere_features_items" ADD CONSTRAINT "page_priere_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_priere"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_priere_process_steps" ADD CONSTRAINT "page_priere_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_priere"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_priere" ADD CONSTRAINT "page_priere_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_priere" ADD CONSTRAINT "page_priere_request_image_id_media_id_fk" FOREIGN KEY ("request_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_priere" ADD CONSTRAINT "page_priere_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_priere_v_version_features_items" ADD CONSTRAINT "_page_priere_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_priere_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_priere_v_version_process_steps" ADD CONSTRAINT "_page_priere_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_priere_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_priere_v" ADD CONSTRAINT "_page_priere_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_priere_v" ADD CONSTRAINT "_page_priere_v_version_request_image_id_media_id_fk" FOREIGN KEY ("version_request_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_priere_v" ADD CONSTRAINT "_page_priere_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_don_features_items" ADD CONSTRAINT "page_don_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_don"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_don_impact_uses" ADD CONSTRAINT "page_don_impact_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_don"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_don" ADD CONSTRAINT "page_don_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_don" ADD CONSTRAINT "page_don_impact_image_id_media_id_fk" FOREIGN KEY ("impact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_don" ADD CONSTRAINT "page_don_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_don_v_version_features_items" ADD CONSTRAINT "_page_don_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_don_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_don_v_version_impact_uses" ADD CONSTRAINT "_page_don_v_version_impact_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_don_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_don_v" ADD CONSTRAINT "_page_don_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_don_v" ADD CONSTRAINT "_page_don_v_version_impact_image_id_media_id_fk" FOREIGN KEY ("version_impact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_don_v" ADD CONSTRAINT "_page_don_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_contact_faq_questions" ADD CONSTRAINT "page_contact_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_contact" ADD CONSTRAINT "page_contact_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_contact" ADD CONSTRAINT "page_contact_visit_image_id_media_id_fk" FOREIGN KEY ("visit_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_contact" ADD CONSTRAINT "page_contact_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_contact_v_version_faq_questions" ADD CONSTRAINT "_page_contact_v_version_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_contact_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_contact_v" ADD CONSTRAINT "_page_contact_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_contact_v" ADD CONSTRAINT "_page_contact_v_version_visit_image_id_media_id_fk" FOREIGN KEY ("version_visit_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_contact_v" ADD CONSTRAINT "_page_contact_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_home_page_v_version_hero_lines_order_idx" ON "_home_page_v_version_hero_lines" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_lines_parent_id_idx" ON "_home_page_v_version_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_welcome_cards_order_idx" ON "_home_page_v_version_welcome_cards" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_welcome_cards_parent_id_idx" ON "_home_page_v_version_welcome_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_welcome_cards_image_idx" ON "_home_page_v_version_welcome_cards" USING btree ("image_id");
  CREATE INDEX "_home_page_v_version_pillars_items_order_idx" ON "_home_page_v_version_pillars_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_pillars_items_parent_id_idx" ON "_home_page_v_version_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_missions_zones_order_idx" ON "_home_page_v_version_missions_zones" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_missions_zones_parent_id_idx" ON "_home_page_v_version_missions_zones" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_hero_version_hero_image_idx" ON "_home_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_home_page_v_version_hero_version_hero_video_idx" ON "_home_page_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_home_page_v_version_pillars_version_pillars_background_idx" ON "_home_page_v" USING btree ("version_pillars_background_id");
  CREATE INDEX "_home_page_v_version_prayer_version_prayer_image_idx" ON "_home_page_v" USING btree ("version_prayer_image_id");
  CREATE INDEX "_home_page_v_version_final_cta_version_final_cta_backgro_idx" ON "_home_page_v" USING btree ("version_final_cta_background_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_autosave_idx" ON "_home_page_v" USING btree ("autosave");
  CREATE INDEX "_home_page_v_rels_order_idx" ON "_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON "_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON "_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_media_id_idx" ON "_home_page_v_rels" USING btree ("media_id");
  CREATE INDEX "page_eglise_features_items_order_idx" ON "page_eglise_features_items" USING btree ("_order");
  CREATE INDEX "page_eglise_features_items_parent_id_idx" ON "page_eglise_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_eglise_groups_cards_order_idx" ON "page_eglise_groups_cards" USING btree ("_order");
  CREATE INDEX "page_eglise_groups_cards_parent_id_idx" ON "page_eglise_groups_cards" USING btree ("_parent_id");
  CREATE INDEX "page_eglise_groups_cards_image_idx" ON "page_eglise_groups_cards" USING btree ("image_id");
  CREATE INDEX "page_eglise_membership_steps_order_idx" ON "page_eglise_membership_steps" USING btree ("_order");
  CREATE INDEX "page_eglise_membership_steps_parent_id_idx" ON "page_eglise_membership_steps" USING btree ("_parent_id");
  CREATE INDEX "page_eglise_faq_questions_order_idx" ON "page_eglise_faq_questions" USING btree ("_order");
  CREATE INDEX "page_eglise_faq_questions_parent_id_idx" ON "page_eglise_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "page_eglise_hero_hero_image_idx" ON "page_eglise" USING btree ("hero_image_id");
  CREATE INDEX "page_eglise_welcome_welcome_image_idx" ON "page_eglise" USING btree ("welcome_image_id");
  CREATE INDEX "page_eglise_membership_membership_image_idx" ON "page_eglise" USING btree ("membership_image_id");
  CREATE INDEX "page_eglise_cta_cta_image_idx" ON "page_eglise" USING btree ("cta_image_id");
  CREATE INDEX "page_eglise__status_idx" ON "page_eglise" USING btree ("_status");
  CREATE INDEX "_page_eglise_v_version_features_items_order_idx" ON "_page_eglise_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_eglise_v_version_features_items_parent_id_idx" ON "_page_eglise_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_eglise_v_version_groups_cards_order_idx" ON "_page_eglise_v_version_groups_cards" USING btree ("_order");
  CREATE INDEX "_page_eglise_v_version_groups_cards_parent_id_idx" ON "_page_eglise_v_version_groups_cards" USING btree ("_parent_id");
  CREATE INDEX "_page_eglise_v_version_groups_cards_image_idx" ON "_page_eglise_v_version_groups_cards" USING btree ("image_id");
  CREATE INDEX "_page_eglise_v_version_membership_steps_order_idx" ON "_page_eglise_v_version_membership_steps" USING btree ("_order");
  CREATE INDEX "_page_eglise_v_version_membership_steps_parent_id_idx" ON "_page_eglise_v_version_membership_steps" USING btree ("_parent_id");
  CREATE INDEX "_page_eglise_v_version_faq_questions_order_idx" ON "_page_eglise_v_version_faq_questions" USING btree ("_order");
  CREATE INDEX "_page_eglise_v_version_faq_questions_parent_id_idx" ON "_page_eglise_v_version_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_page_eglise_v_version_hero_version_hero_image_idx" ON "_page_eglise_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_eglise_v_version_welcome_version_welcome_image_idx" ON "_page_eglise_v" USING btree ("version_welcome_image_id");
  CREATE INDEX "_page_eglise_v_version_membership_version_membership_ima_idx" ON "_page_eglise_v" USING btree ("version_membership_image_id");
  CREATE INDEX "_page_eglise_v_version_cta_version_cta_image_idx" ON "_page_eglise_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_eglise_v_version_version__status_idx" ON "_page_eglise_v" USING btree ("version__status");
  CREATE INDEX "_page_eglise_v_created_at_idx" ON "_page_eglise_v" USING btree ("created_at");
  CREATE INDEX "_page_eglise_v_updated_at_idx" ON "_page_eglise_v" USING btree ("updated_at");
  CREATE INDEX "_page_eglise_v_latest_idx" ON "_page_eglise_v" USING btree ("latest");
  CREATE INDEX "_page_eglise_v_autosave_idx" ON "_page_eglise_v" USING btree ("autosave");
  CREATE INDEX "page_decouvrir_about_highlights_order_idx" ON "page_decouvrir_about_highlights" USING btree ("_order");
  CREATE INDEX "page_decouvrir_about_highlights_parent_id_idx" ON "page_decouvrir_about_highlights" USING btree ("_parent_id");
  CREATE INDEX "page_decouvrir_pillars_items_order_idx" ON "page_decouvrir_pillars_items" USING btree ("_order");
  CREATE INDEX "page_decouvrir_pillars_items_parent_id_idx" ON "page_decouvrir_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "page_decouvrir_story_timeline_order_idx" ON "page_decouvrir_story_timeline" USING btree ("_order");
  CREATE INDEX "page_decouvrir_story_timeline_parent_id_idx" ON "page_decouvrir_story_timeline" USING btree ("_parent_id");
  CREATE INDEX "page_decouvrir_team_leaders_order_idx" ON "page_decouvrir_team_leaders" USING btree ("_order");
  CREATE INDEX "page_decouvrir_team_leaders_parent_id_idx" ON "page_decouvrir_team_leaders" USING btree ("_parent_id");
  CREATE INDEX "page_decouvrir_team_leaders_photo_idx" ON "page_decouvrir_team_leaders" USING btree ("photo_id");
  CREATE INDEX "page_decouvrir_hero_hero_image_idx" ON "page_decouvrir" USING btree ("hero_image_id");
  CREATE INDEX "page_decouvrir_about_about_image_idx" ON "page_decouvrir" USING btree ("about_image_id");
  CREATE INDEX "page_decouvrir_faith_faith_image_idx" ON "page_decouvrir" USING btree ("faith_image_id");
  CREATE INDEX "page_decouvrir_cta_cta_image_idx" ON "page_decouvrir" USING btree ("cta_image_id");
  CREATE INDEX "page_decouvrir__status_idx" ON "page_decouvrir" USING btree ("_status");
  CREATE INDEX "_page_decouvrir_v_version_about_highlights_order_idx" ON "_page_decouvrir_v_version_about_highlights" USING btree ("_order");
  CREATE INDEX "_page_decouvrir_v_version_about_highlights_parent_id_idx" ON "_page_decouvrir_v_version_about_highlights" USING btree ("_parent_id");
  CREATE INDEX "_page_decouvrir_v_version_pillars_items_order_idx" ON "_page_decouvrir_v_version_pillars_items" USING btree ("_order");
  CREATE INDEX "_page_decouvrir_v_version_pillars_items_parent_id_idx" ON "_page_decouvrir_v_version_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "_page_decouvrir_v_version_story_timeline_order_idx" ON "_page_decouvrir_v_version_story_timeline" USING btree ("_order");
  CREATE INDEX "_page_decouvrir_v_version_story_timeline_parent_id_idx" ON "_page_decouvrir_v_version_story_timeline" USING btree ("_parent_id");
  CREATE INDEX "_page_decouvrir_v_version_team_leaders_order_idx" ON "_page_decouvrir_v_version_team_leaders" USING btree ("_order");
  CREATE INDEX "_page_decouvrir_v_version_team_leaders_parent_id_idx" ON "_page_decouvrir_v_version_team_leaders" USING btree ("_parent_id");
  CREATE INDEX "_page_decouvrir_v_version_team_leaders_photo_idx" ON "_page_decouvrir_v_version_team_leaders" USING btree ("photo_id");
  CREATE INDEX "_page_decouvrir_v_version_hero_version_hero_image_idx" ON "_page_decouvrir_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_decouvrir_v_version_about_version_about_image_idx" ON "_page_decouvrir_v" USING btree ("version_about_image_id");
  CREATE INDEX "_page_decouvrir_v_version_faith_version_faith_image_idx" ON "_page_decouvrir_v" USING btree ("version_faith_image_id");
  CREATE INDEX "_page_decouvrir_v_version_cta_version_cta_image_idx" ON "_page_decouvrir_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_decouvrir_v_version_version__status_idx" ON "_page_decouvrir_v" USING btree ("version__status");
  CREATE INDEX "_page_decouvrir_v_created_at_idx" ON "_page_decouvrir_v" USING btree ("created_at");
  CREATE INDEX "_page_decouvrir_v_updated_at_idx" ON "_page_decouvrir_v" USING btree ("updated_at");
  CREATE INDEX "_page_decouvrir_v_latest_idx" ON "_page_decouvrir_v" USING btree ("latest");
  CREATE INDEX "_page_decouvrir_v_autosave_idx" ON "_page_decouvrir_v" USING btree ("autosave");
  CREATE INDEX "page_ministeres_features_items_order_idx" ON "page_ministeres_features_items" USING btree ("_order");
  CREATE INDEX "page_ministeres_features_items_parent_id_idx" ON "page_ministeres_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_ministeres_serve_steps_order_idx" ON "page_ministeres_serve_steps" USING btree ("_order");
  CREATE INDEX "page_ministeres_serve_steps_parent_id_idx" ON "page_ministeres_serve_steps" USING btree ("_parent_id");
  CREATE INDEX "page_ministeres_hero_hero_image_idx" ON "page_ministeres" USING btree ("hero_image_id");
  CREATE INDEX "page_ministeres_serve_serve_image_idx" ON "page_ministeres" USING btree ("serve_image_id");
  CREATE INDEX "page_ministeres_cta_cta_image_idx" ON "page_ministeres" USING btree ("cta_image_id");
  CREATE INDEX "page_ministeres__status_idx" ON "page_ministeres" USING btree ("_status");
  CREATE INDEX "_page_ministeres_v_version_features_items_order_idx" ON "_page_ministeres_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_ministeres_v_version_features_items_parent_id_idx" ON "_page_ministeres_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_ministeres_v_version_serve_steps_order_idx" ON "_page_ministeres_v_version_serve_steps" USING btree ("_order");
  CREATE INDEX "_page_ministeres_v_version_serve_steps_parent_id_idx" ON "_page_ministeres_v_version_serve_steps" USING btree ("_parent_id");
  CREATE INDEX "_page_ministeres_v_version_hero_version_hero_image_idx" ON "_page_ministeres_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_ministeres_v_version_serve_version_serve_image_idx" ON "_page_ministeres_v" USING btree ("version_serve_image_id");
  CREATE INDEX "_page_ministeres_v_version_cta_version_cta_image_idx" ON "_page_ministeres_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_ministeres_v_version_version__status_idx" ON "_page_ministeres_v" USING btree ("version__status");
  CREATE INDEX "_page_ministeres_v_created_at_idx" ON "_page_ministeres_v" USING btree ("created_at");
  CREATE INDEX "_page_ministeres_v_updated_at_idx" ON "_page_ministeres_v" USING btree ("updated_at");
  CREATE INDEX "_page_ministeres_v_latest_idx" ON "_page_ministeres_v" USING btree ("latest");
  CREATE INDEX "_page_ministeres_v_autosave_idx" ON "_page_ministeres_v" USING btree ("autosave");
  CREATE INDEX "page_messages_hero_hero_image_idx" ON "page_messages" USING btree ("hero_image_id");
  CREATE INDEX "page_messages__status_idx" ON "page_messages" USING btree ("_status");
  CREATE INDEX "_page_messages_v_version_hero_version_hero_image_idx" ON "_page_messages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_messages_v_version_version__status_idx" ON "_page_messages_v" USING btree ("version__status");
  CREATE INDEX "_page_messages_v_created_at_idx" ON "_page_messages_v" USING btree ("created_at");
  CREATE INDEX "_page_messages_v_updated_at_idx" ON "_page_messages_v" USING btree ("updated_at");
  CREATE INDEX "_page_messages_v_latest_idx" ON "_page_messages_v" USING btree ("latest");
  CREATE INDEX "_page_messages_v_autosave_idx" ON "_page_messages_v" USING btree ("autosave");
  CREATE INDEX "page_evenements_features_items_order_idx" ON "page_evenements_features_items" USING btree ("_order");
  CREATE INDEX "page_evenements_features_items_parent_id_idx" ON "page_evenements_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_evenements_hero_hero_image_idx" ON "page_evenements" USING btree ("hero_image_id");
  CREATE INDEX "page_evenements_newsletter_newsletter_image_idx" ON "page_evenements" USING btree ("newsletter_image_id");
  CREATE INDEX "page_evenements__status_idx" ON "page_evenements" USING btree ("_status");
  CREATE INDEX "_page_evenements_v_version_features_items_order_idx" ON "_page_evenements_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_evenements_v_version_features_items_parent_id_idx" ON "_page_evenements_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_evenements_v_version_hero_version_hero_image_idx" ON "_page_evenements_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_evenements_v_version_newsletter_version_newsletter_idx" ON "_page_evenements_v" USING btree ("version_newsletter_image_id");
  CREATE INDEX "_page_evenements_v_version_version__status_idx" ON "_page_evenements_v" USING btree ("version__status");
  CREATE INDEX "_page_evenements_v_created_at_idx" ON "_page_evenements_v" USING btree ("created_at");
  CREATE INDEX "_page_evenements_v_updated_at_idx" ON "_page_evenements_v" USING btree ("updated_at");
  CREATE INDEX "_page_evenements_v_latest_idx" ON "_page_evenements_v" USING btree ("latest");
  CREATE INDEX "_page_evenements_v_autosave_idx" ON "_page_evenements_v" USING btree ("autosave");
  CREATE INDEX "page_missions_features_items_order_idx" ON "page_missions_features_items" USING btree ("_order");
  CREATE INDEX "page_missions_features_items_parent_id_idx" ON "page_missions_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_missions_involve_ways_order_idx" ON "page_missions_involve_ways" USING btree ("_order");
  CREATE INDEX "page_missions_involve_ways_parent_id_idx" ON "page_missions_involve_ways" USING btree ("_parent_id");
  CREATE INDEX "page_missions_hero_hero_image_idx" ON "page_missions" USING btree ("hero_image_id");
  CREATE INDEX "page_missions_vision_vision_image_idx" ON "page_missions" USING btree ("vision_image_id");
  CREATE INDEX "page_missions_cta_cta_image_idx" ON "page_missions" USING btree ("cta_image_id");
  CREATE INDEX "page_missions__status_idx" ON "page_missions" USING btree ("_status");
  CREATE INDEX "_page_missions_v_version_features_items_order_idx" ON "_page_missions_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_missions_v_version_features_items_parent_id_idx" ON "_page_missions_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_missions_v_version_involve_ways_order_idx" ON "_page_missions_v_version_involve_ways" USING btree ("_order");
  CREATE INDEX "_page_missions_v_version_involve_ways_parent_id_idx" ON "_page_missions_v_version_involve_ways" USING btree ("_parent_id");
  CREATE INDEX "_page_missions_v_version_hero_version_hero_image_idx" ON "_page_missions_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_missions_v_version_vision_version_vision_image_idx" ON "_page_missions_v" USING btree ("version_vision_image_id");
  CREATE INDEX "_page_missions_v_version_cta_version_cta_image_idx" ON "_page_missions_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_missions_v_version_version__status_idx" ON "_page_missions_v" USING btree ("version__status");
  CREATE INDEX "_page_missions_v_created_at_idx" ON "_page_missions_v" USING btree ("created_at");
  CREATE INDEX "_page_missions_v_updated_at_idx" ON "_page_missions_v" USING btree ("updated_at");
  CREATE INDEX "_page_missions_v_latest_idx" ON "_page_missions_v" USING btree ("latest");
  CREATE INDEX "_page_missions_v_autosave_idx" ON "_page_missions_v" USING btree ("autosave");
  CREATE INDEX "page_priere_features_items_order_idx" ON "page_priere_features_items" USING btree ("_order");
  CREATE INDEX "page_priere_features_items_parent_id_idx" ON "page_priere_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_priere_process_steps_order_idx" ON "page_priere_process_steps" USING btree ("_order");
  CREATE INDEX "page_priere_process_steps_parent_id_idx" ON "page_priere_process_steps" USING btree ("_parent_id");
  CREATE INDEX "page_priere_hero_hero_image_idx" ON "page_priere" USING btree ("hero_image_id");
  CREATE INDEX "page_priere_request_request_image_idx" ON "page_priere" USING btree ("request_image_id");
  CREATE INDEX "page_priere_cta_cta_image_idx" ON "page_priere" USING btree ("cta_image_id");
  CREATE INDEX "page_priere__status_idx" ON "page_priere" USING btree ("_status");
  CREATE INDEX "_page_priere_v_version_features_items_order_idx" ON "_page_priere_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_priere_v_version_features_items_parent_id_idx" ON "_page_priere_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_priere_v_version_process_steps_order_idx" ON "_page_priere_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_page_priere_v_version_process_steps_parent_id_idx" ON "_page_priere_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_page_priere_v_version_hero_version_hero_image_idx" ON "_page_priere_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_priere_v_version_request_version_request_image_idx" ON "_page_priere_v" USING btree ("version_request_image_id");
  CREATE INDEX "_page_priere_v_version_cta_version_cta_image_idx" ON "_page_priere_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_priere_v_version_version__status_idx" ON "_page_priere_v" USING btree ("version__status");
  CREATE INDEX "_page_priere_v_created_at_idx" ON "_page_priere_v" USING btree ("created_at");
  CREATE INDEX "_page_priere_v_updated_at_idx" ON "_page_priere_v" USING btree ("updated_at");
  CREATE INDEX "_page_priere_v_latest_idx" ON "_page_priere_v" USING btree ("latest");
  CREATE INDEX "_page_priere_v_autosave_idx" ON "_page_priere_v" USING btree ("autosave");
  CREATE INDEX "page_don_features_items_order_idx" ON "page_don_features_items" USING btree ("_order");
  CREATE INDEX "page_don_features_items_parent_id_idx" ON "page_don_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_don_impact_uses_order_idx" ON "page_don_impact_uses" USING btree ("_order");
  CREATE INDEX "page_don_impact_uses_parent_id_idx" ON "page_don_impact_uses" USING btree ("_parent_id");
  CREATE INDEX "page_don_hero_hero_image_idx" ON "page_don" USING btree ("hero_image_id");
  CREATE INDEX "page_don_impact_impact_image_idx" ON "page_don" USING btree ("impact_image_id");
  CREATE INDEX "page_don_cta_cta_image_idx" ON "page_don" USING btree ("cta_image_id");
  CREATE INDEX "page_don__status_idx" ON "page_don" USING btree ("_status");
  CREATE INDEX "_page_don_v_version_features_items_order_idx" ON "_page_don_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_don_v_version_features_items_parent_id_idx" ON "_page_don_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_don_v_version_impact_uses_order_idx" ON "_page_don_v_version_impact_uses" USING btree ("_order");
  CREATE INDEX "_page_don_v_version_impact_uses_parent_id_idx" ON "_page_don_v_version_impact_uses" USING btree ("_parent_id");
  CREATE INDEX "_page_don_v_version_hero_version_hero_image_idx" ON "_page_don_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_don_v_version_impact_version_impact_image_idx" ON "_page_don_v" USING btree ("version_impact_image_id");
  CREATE INDEX "_page_don_v_version_cta_version_cta_image_idx" ON "_page_don_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_don_v_version_version__status_idx" ON "_page_don_v" USING btree ("version__status");
  CREATE INDEX "_page_don_v_created_at_idx" ON "_page_don_v" USING btree ("created_at");
  CREATE INDEX "_page_don_v_updated_at_idx" ON "_page_don_v" USING btree ("updated_at");
  CREATE INDEX "_page_don_v_latest_idx" ON "_page_don_v" USING btree ("latest");
  CREATE INDEX "_page_don_v_autosave_idx" ON "_page_don_v" USING btree ("autosave");
  CREATE INDEX "page_contact_faq_questions_order_idx" ON "page_contact_faq_questions" USING btree ("_order");
  CREATE INDEX "page_contact_faq_questions_parent_id_idx" ON "page_contact_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "page_contact_hero_hero_image_idx" ON "page_contact" USING btree ("hero_image_id");
  CREATE INDEX "page_contact_visit_visit_image_idx" ON "page_contact" USING btree ("visit_image_id");
  CREATE INDEX "page_contact_cta_cta_image_idx" ON "page_contact" USING btree ("cta_image_id");
  CREATE INDEX "page_contact__status_idx" ON "page_contact" USING btree ("_status");
  CREATE INDEX "_page_contact_v_version_faq_questions_order_idx" ON "_page_contact_v_version_faq_questions" USING btree ("_order");
  CREATE INDEX "_page_contact_v_version_faq_questions_parent_id_idx" ON "_page_contact_v_version_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_page_contact_v_version_hero_version_hero_image_idx" ON "_page_contact_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_contact_v_version_visit_version_visit_image_idx" ON "_page_contact_v" USING btree ("version_visit_image_id");
  CREATE INDEX "_page_contact_v_version_cta_version_cta_image_idx" ON "_page_contact_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_contact_v_version_version__status_idx" ON "_page_contact_v" USING btree ("version__status");
  CREATE INDEX "_page_contact_v_created_at_idx" ON "_page_contact_v" USING btree ("created_at");
  CREATE INDEX "_page_contact_v_updated_at_idx" ON "_page_contact_v" USING btree ("updated_at");
  CREATE INDEX "_page_contact_v_latest_idx" ON "_page_contact_v" USING btree ("latest");
  CREATE INDEX "_page_contact_v_autosave_idx" ON "_page_contact_v" USING btree ("autosave");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_content_eglise_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_content_decouvrir_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_content_decouvrir_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer
  );
  
  CREATE TABLE "pages_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eglise_hero_image_id" integer,
  	"eglise_welcome_image_id" integer,
  	"eglise_membership_image_id" integer,
  	"decouvrir_hero_image_id" integer,
  	"decouvrir_story_image_id" integer,
  	"decouvrir_faith_image_id" integer,
  	"ministeres_hero_image_id" integer,
  	"ministeres_serve_image_id" integer,
  	"messages_hero_image_id" integer,
  	"messages_spotify_url" varchar,
  	"messages_apple_podcasts_url" varchar,
  	"messages_youtube_channel_url" varchar,
  	"evenements_hero_image_id" integer,
  	"evenements_newsletter_image_id" integer,
  	"don_hero_image_id" integer,
  	"don_impact_image_id" integer,
  	"don_interac_email" varchar,
  	"don_interac_note" varchar,
  	"don_mailing_address" varchar,
  	"don_in_person_note" varchar DEFAULT 'Pendant le culte, lors du temps des offrandes.',
  	"don_charity_number" varchar,
  	"don_tax_receipts" boolean DEFAULT false,
  	"missions_hero_image_id" integer,
  	"missions_vision_image_id" integer,
  	"priere_hero_image_id" integer,
  	"priere_side_image_id" integer,
  	"contact_hero_image_id" integer,
  	"contact_visit_image_id" integer,
  	"contact_office_hours" varchar DEFAULT 'Heures à confirmer',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "_home_page_v_version_hero_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_welcome_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_missions_zones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_eglise_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_eglise_groups_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_eglise_membership_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_eglise_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_eglise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_eglise_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_eglise_v_version_groups_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_eglise_v_version_membership_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_eglise_v_version_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_eglise_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_decouvrir_about_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_decouvrir_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_decouvrir_story_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_decouvrir_team_leaders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_decouvrir" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_decouvrir_v_version_about_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_decouvrir_v_version_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_decouvrir_v_version_story_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_decouvrir_v_version_team_leaders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_decouvrir_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_ministeres_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_ministeres_serve_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_ministeres" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_ministeres_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_ministeres_v_version_serve_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_ministeres_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_messages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_evenements_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_evenements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_evenements_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_evenements_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_missions_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_missions_involve_ways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_missions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_missions_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_missions_v_version_involve_ways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_missions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_priere_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_priere_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_priere" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_priere_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_priere_v_version_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_priere_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_don_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_don_impact_uses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_don" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_don_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_don_v_version_impact_uses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_don_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_contact_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_contact_v_version_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_contact_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_home_page_v_version_hero_lines" CASCADE;
  DROP TABLE "_home_page_v_version_welcome_cards" CASCADE;
  DROP TABLE "_home_page_v_version_pillars_items" CASCADE;
  DROP TABLE "_home_page_v_version_missions_zones" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_rels" CASCADE;
  DROP TABLE "page_eglise_features_items" CASCADE;
  DROP TABLE "page_eglise_groups_cards" CASCADE;
  DROP TABLE "page_eglise_membership_steps" CASCADE;
  DROP TABLE "page_eglise_faq_questions" CASCADE;
  DROP TABLE "page_eglise" CASCADE;
  DROP TABLE "_page_eglise_v_version_features_items" CASCADE;
  DROP TABLE "_page_eglise_v_version_groups_cards" CASCADE;
  DROP TABLE "_page_eglise_v_version_membership_steps" CASCADE;
  DROP TABLE "_page_eglise_v_version_faq_questions" CASCADE;
  DROP TABLE "_page_eglise_v" CASCADE;
  DROP TABLE "page_decouvrir_about_highlights" CASCADE;
  DROP TABLE "page_decouvrir_pillars_items" CASCADE;
  DROP TABLE "page_decouvrir_story_timeline" CASCADE;
  DROP TABLE "page_decouvrir_team_leaders" CASCADE;
  DROP TABLE "page_decouvrir" CASCADE;
  DROP TABLE "_page_decouvrir_v_version_about_highlights" CASCADE;
  DROP TABLE "_page_decouvrir_v_version_pillars_items" CASCADE;
  DROP TABLE "_page_decouvrir_v_version_story_timeline" CASCADE;
  DROP TABLE "_page_decouvrir_v_version_team_leaders" CASCADE;
  DROP TABLE "_page_decouvrir_v" CASCADE;
  DROP TABLE "page_ministeres_features_items" CASCADE;
  DROP TABLE "page_ministeres_serve_steps" CASCADE;
  DROP TABLE "page_ministeres" CASCADE;
  DROP TABLE "_page_ministeres_v_version_features_items" CASCADE;
  DROP TABLE "_page_ministeres_v_version_serve_steps" CASCADE;
  DROP TABLE "_page_ministeres_v" CASCADE;
  DROP TABLE "page_messages" CASCADE;
  DROP TABLE "_page_messages_v" CASCADE;
  DROP TABLE "page_evenements_features_items" CASCADE;
  DROP TABLE "page_evenements" CASCADE;
  DROP TABLE "_page_evenements_v_version_features_items" CASCADE;
  DROP TABLE "_page_evenements_v" CASCADE;
  DROP TABLE "page_missions_features_items" CASCADE;
  DROP TABLE "page_missions_involve_ways" CASCADE;
  DROP TABLE "page_missions" CASCADE;
  DROP TABLE "_page_missions_v_version_features_items" CASCADE;
  DROP TABLE "_page_missions_v_version_involve_ways" CASCADE;
  DROP TABLE "_page_missions_v" CASCADE;
  DROP TABLE "page_priere_features_items" CASCADE;
  DROP TABLE "page_priere_process_steps" CASCADE;
  DROP TABLE "page_priere" CASCADE;
  DROP TABLE "_page_priere_v_version_features_items" CASCADE;
  DROP TABLE "_page_priere_v_version_process_steps" CASCADE;
  DROP TABLE "_page_priere_v" CASCADE;
  DROP TABLE "page_don_features_items" CASCADE;
  DROP TABLE "page_don_impact_uses" CASCADE;
  DROP TABLE "page_don" CASCADE;
  DROP TABLE "_page_don_v_version_features_items" CASCADE;
  DROP TABLE "_page_don_v_version_impact_uses" CASCADE;
  DROP TABLE "_page_don_v" CASCADE;
  DROP TABLE "page_contact_faq_questions" CASCADE;
  DROP TABLE "page_contact" CASCADE;
  DROP TABLE "_page_contact_v_version_faq_questions" CASCADE;
  DROP TABLE "_page_contact_v" CASCADE;
  DROP INDEX "home_page__status_idx";
  ALTER TABLE "home_page_welcome_cards" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "home_page_pillars_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "home_page_missions_zones" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_content_eglise_faq" ADD CONSTRAINT "pages_content_eglise_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content_decouvrir_timeline" ADD CONSTRAINT "pages_content_decouvrir_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content_decouvrir_leaders" ADD CONSTRAINT "pages_content_decouvrir_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content_decouvrir_leaders" ADD CONSTRAINT "pages_content_decouvrir_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_eglise_hero_image_id_media_id_fk" FOREIGN KEY ("eglise_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_eglise_welcome_image_id_media_id_fk" FOREIGN KEY ("eglise_welcome_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_eglise_membership_image_id_media_id_fk" FOREIGN KEY ("eglise_membership_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_decouvrir_hero_image_id_media_id_fk" FOREIGN KEY ("decouvrir_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_decouvrir_story_image_id_media_id_fk" FOREIGN KEY ("decouvrir_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_decouvrir_faith_image_id_media_id_fk" FOREIGN KEY ("decouvrir_faith_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_ministeres_hero_image_id_media_id_fk" FOREIGN KEY ("ministeres_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_ministeres_serve_image_id_media_id_fk" FOREIGN KEY ("ministeres_serve_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_messages_hero_image_id_media_id_fk" FOREIGN KEY ("messages_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_evenements_hero_image_id_media_id_fk" FOREIGN KEY ("evenements_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_evenements_newsletter_image_id_media_id_fk" FOREIGN KEY ("evenements_newsletter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_don_hero_image_id_media_id_fk" FOREIGN KEY ("don_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_don_impact_image_id_media_id_fk" FOREIGN KEY ("don_impact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_missions_hero_image_id_media_id_fk" FOREIGN KEY ("missions_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_missions_vision_image_id_media_id_fk" FOREIGN KEY ("missions_vision_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_priere_hero_image_id_media_id_fk" FOREIGN KEY ("priere_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_priere_side_image_id_media_id_fk" FOREIGN KEY ("priere_side_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_contact_hero_image_id_media_id_fk" FOREIGN KEY ("contact_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content" ADD CONSTRAINT "pages_content_contact_visit_image_id_media_id_fk" FOREIGN KEY ("contact_visit_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_content_eglise_faq_order_idx" ON "pages_content_eglise_faq" USING btree ("_order");
  CREATE INDEX "pages_content_eglise_faq_parent_id_idx" ON "pages_content_eglise_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_content_decouvrir_timeline_order_idx" ON "pages_content_decouvrir_timeline" USING btree ("_order");
  CREATE INDEX "pages_content_decouvrir_timeline_parent_id_idx" ON "pages_content_decouvrir_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_content_decouvrir_leaders_order_idx" ON "pages_content_decouvrir_leaders" USING btree ("_order");
  CREATE INDEX "pages_content_decouvrir_leaders_parent_id_idx" ON "pages_content_decouvrir_leaders" USING btree ("_parent_id");
  CREATE INDEX "pages_content_decouvrir_leaders_photo_idx" ON "pages_content_decouvrir_leaders" USING btree ("photo_id");
  CREATE INDEX "pages_content_eglise_eglise_hero_image_idx" ON "pages_content" USING btree ("eglise_hero_image_id");
  CREATE INDEX "pages_content_eglise_eglise_welcome_image_idx" ON "pages_content" USING btree ("eglise_welcome_image_id");
  CREATE INDEX "pages_content_eglise_eglise_membership_image_idx" ON "pages_content" USING btree ("eglise_membership_image_id");
  CREATE INDEX "pages_content_decouvrir_decouvrir_hero_image_idx" ON "pages_content" USING btree ("decouvrir_hero_image_id");
  CREATE INDEX "pages_content_decouvrir_decouvrir_story_image_idx" ON "pages_content" USING btree ("decouvrir_story_image_id");
  CREATE INDEX "pages_content_decouvrir_decouvrir_faith_image_idx" ON "pages_content" USING btree ("decouvrir_faith_image_id");
  CREATE INDEX "pages_content_ministeres_ministeres_hero_image_idx" ON "pages_content" USING btree ("ministeres_hero_image_id");
  CREATE INDEX "pages_content_ministeres_ministeres_serve_image_idx" ON "pages_content" USING btree ("ministeres_serve_image_id");
  CREATE INDEX "pages_content_messages_messages_hero_image_idx" ON "pages_content" USING btree ("messages_hero_image_id");
  CREATE INDEX "pages_content_evenements_evenements_hero_image_idx" ON "pages_content" USING btree ("evenements_hero_image_id");
  CREATE INDEX "pages_content_evenements_evenements_newsletter_image_idx" ON "pages_content" USING btree ("evenements_newsletter_image_id");
  CREATE INDEX "pages_content_don_don_hero_image_idx" ON "pages_content" USING btree ("don_hero_image_id");
  CREATE INDEX "pages_content_don_don_impact_image_idx" ON "pages_content" USING btree ("don_impact_image_id");
  CREATE INDEX "pages_content_missions_missions_hero_image_idx" ON "pages_content" USING btree ("missions_hero_image_id");
  CREATE INDEX "pages_content_missions_missions_vision_image_idx" ON "pages_content" USING btree ("missions_vision_image_id");
  CREATE INDEX "pages_content_priere_priere_hero_image_idx" ON "pages_content" USING btree ("priere_hero_image_id");
  CREATE INDEX "pages_content_priere_priere_side_image_idx" ON "pages_content" USING btree ("priere_side_image_id");
  CREATE INDEX "pages_content_contact_contact_hero_image_idx" ON "pages_content" USING btree ("contact_hero_image_id");
  CREATE INDEX "pages_content_contact_contact_visit_image_idx" ON "pages_content" USING btree ("contact_visit_image_id");
  ALTER TABLE "home_page" DROP COLUMN "_status";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_welcome_cards_icon";
  DROP TYPE "public"."enum__home_page_v_version_pillars_items_icon";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum_page_eglise_features_items_icon";
  DROP TYPE "public"."enum_page_eglise_groups_cards_icon";
  DROP TYPE "public"."enum_page_eglise_membership_steps_icon";
  DROP TYPE "public"."enum_page_eglise_status";
  DROP TYPE "public"."enum__page_eglise_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_eglise_v_version_groups_cards_icon";
  DROP TYPE "public"."enum__page_eglise_v_version_membership_steps_icon";
  DROP TYPE "public"."enum__page_eglise_v_version_status";
  DROP TYPE "public"."enum_page_decouvrir_about_highlights_icon";
  DROP TYPE "public"."enum_page_decouvrir_pillars_items_icon";
  DROP TYPE "public"."enum_page_decouvrir_status";
  DROP TYPE "public"."enum__page_decouvrir_v_version_about_highlights_icon";
  DROP TYPE "public"."enum__page_decouvrir_v_version_pillars_items_icon";
  DROP TYPE "public"."enum__page_decouvrir_v_version_status";
  DROP TYPE "public"."enum_page_ministeres_features_items_icon";
  DROP TYPE "public"."enum_page_ministeres_serve_steps_icon";
  DROP TYPE "public"."enum_page_ministeres_status";
  DROP TYPE "public"."enum__page_ministeres_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_ministeres_v_version_serve_steps_icon";
  DROP TYPE "public"."enum__page_ministeres_v_version_status";
  DROP TYPE "public"."enum_page_messages_status";
  DROP TYPE "public"."enum__page_messages_v_version_status";
  DROP TYPE "public"."enum_page_evenements_features_items_icon";
  DROP TYPE "public"."enum_page_evenements_status";
  DROP TYPE "public"."enum__page_evenements_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_evenements_v_version_status";
  DROP TYPE "public"."enum_page_missions_features_items_icon";
  DROP TYPE "public"."enum_page_missions_involve_ways_icon";
  DROP TYPE "public"."enum_page_missions_status";
  DROP TYPE "public"."enum__page_missions_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_missions_v_version_involve_ways_icon";
  DROP TYPE "public"."enum__page_missions_v_version_status";
  DROP TYPE "public"."enum_page_priere_features_items_icon";
  DROP TYPE "public"."enum_page_priere_status";
  DROP TYPE "public"."enum__page_priere_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_priere_v_version_status";
  DROP TYPE "public"."enum_page_don_features_items_icon";
  DROP TYPE "public"."enum_page_don_impact_uses_icon";
  DROP TYPE "public"."enum_page_don_status";
  DROP TYPE "public"."enum__page_don_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_don_v_version_impact_uses_icon";
  DROP TYPE "public"."enum__page_don_v_version_status";
  DROP TYPE "public"."enum_page_contact_status";
  DROP TYPE "public"."enum__page_contact_v_version_status";`)
}
