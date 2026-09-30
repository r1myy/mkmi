import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_testimonials_category" AS ENUM('guerison', 'delivrance', 'restauration', 'provision', 'direction', 'priere', 'etude', 'famille', 'autre');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('pending', 'published', 'rejected');
  CREATE TYPE "public"."enum_faith_type" AS ENUM('article', 'video', 'guide', 'serie', 'parcours');
  CREATE TYPE "public"."enum_faith_theme" AS ENUM('dieu', 'jesus', 'bible', 'priere', 'vie', 'croissance', 'famille', 'autres');
  CREATE TYPE "public"."enum_faith_level" AS ENUM('debutant', 'intermediaire', 'avance');
  CREATE TYPE "public"."enum_faith_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faith_resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_visite_services_list_weekday" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__page_visite_v_version_services_list_weekday" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_page_temoignages_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_temoignages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_temoignages_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_temoignages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_foi_shortcuts_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_foi_themes_cards_theme" AS ENUM('dieu', 'jesus', 'bible', 'priere', 'vie', 'croissance', 'famille', 'autres');
  CREATE TYPE "public"."enum_page_foi_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_foi_v_version_shortcuts_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_foi_v_version_themes_cards_theme" AS ENUM('dieu', 'jesus', 'bible', 'priere', 'vie', 'croissance', 'famille', 'autres');
  CREATE TYPE "public"."enum__page_foi_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_recherche_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_recherche_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_servir_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum_page_servir_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_servir_v_version_features_items_icon" AS ENUM('heart', 'users', 'users-round', 'book', 'globe', 'church', 'hand-heart', 'hands', 'handshake', 'sprout', 'megaphone', 'music', 'calendar', 'map-pin', 'lock', 'shield', 'target', 'compass', 'gem', 'sparkles', 'baby', 'gift', 'plane', 'message', 'star');
  CREATE TYPE "public"."enum__page_servir_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_legal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_legal_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "faith_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" "enum_faith_type" DEFAULT 'article',
  	"theme" "enum_faith_theme" DEFAULT 'autres',
  	"level" "enum_faith_level" DEFAULT 'debutant',
  	"summary" varchar,
  	"author" varchar,
  	"published_at" timestamp(3) with time zone,
  	"duration" varchar,
  	"cover_id" integer,
  	"youtube_url" varchar,
  	"body" jsonb,
  	"featured" boolean DEFAULT false,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faith_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faith_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_type" "enum_faith_type" DEFAULT 'article',
  	"version_theme" "enum_faith_theme" DEFAULT 'autres',
  	"version_level" "enum_faith_level" DEFAULT 'debutant',
  	"version_summary" varchar,
  	"version_author" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_duration" varchar,
  	"version_cover_id" integer,
  	"version_youtube_url" varchar,
  	"version_body" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faith_resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "page_visite_services_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"badge" varchar,
  	"weekday" "enum_page_visite_services_list_weekday" DEFAULT '0',
  	"time" varchar DEFAULT 'Heure à confirmer',
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "_page_visite_v_version_services_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"badge" varchar,
  	"weekday" "enum__page_visite_v_version_services_list_weekday" DEFAULT '0',
  	"time" varchar DEFAULT 'Heure à confirmer',
  	"text" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "page_temoignages_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_temoignages_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_temoignages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Témoignages',
  	"hero_title" varchar DEFAULT 'Des vies transformées
  par la *puissance de Dieu.*',
  	"hero_text" varchar DEFAULT 'Découvrez comment Dieu agit encore aujourd’hui dans la vie des hommes et des femmes de notre communauté, à travers des témoignages vrais et inspirants.',
  	"hero_primary" varchar DEFAULT 'Partager mon témoignage',
  	"hero_secondary" varchar DEFAULT 'Voir les témoignages',
  	"hero_image_id" integer,
  	"share_eyebrow" varchar DEFAULT 'Partagez votre témoignage',
  	"share_title" varchar DEFAULT 'Dieu a fait quelque chose dans votre vie ?',
  	"share_text" varchar DEFAULT 'Votre histoire peut encourager d’autres personnes. Écrivez-la ici : notre équipe la relira avec vous avant toute publication, et rien n’est publié sans votre accord.',
  	"share_form_title" varchar DEFAULT 'Soumettre un témoignage écrit',
  	"newsletter_eyebrow" varchar DEFAULT 'Restez connecté',
  	"newsletter_title" varchar DEFAULT 'Recevez nos nouveaux témoignages',
  	"newsletter_text" varchar DEFAULT 'Abonnez-vous pour être informé des nouveaux témoignages, prédications et événements de notre église.',
  	"_status" "enum_page_temoignages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_temoignages_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_temoignages_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_temoignages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Témoignages',
  	"version_hero_title" varchar DEFAULT 'Des vies transformées
  par la *puissance de Dieu.*',
  	"version_hero_text" varchar DEFAULT 'Découvrez comment Dieu agit encore aujourd’hui dans la vie des hommes et des femmes de notre communauté, à travers des témoignages vrais et inspirants.',
  	"version_hero_primary" varchar DEFAULT 'Partager mon témoignage',
  	"version_hero_secondary" varchar DEFAULT 'Voir les témoignages',
  	"version_hero_image_id" integer,
  	"version_share_eyebrow" varchar DEFAULT 'Partagez votre témoignage',
  	"version_share_title" varchar DEFAULT 'Dieu a fait quelque chose dans votre vie ?',
  	"version_share_text" varchar DEFAULT 'Votre histoire peut encourager d’autres personnes. Écrivez-la ici : notre équipe la relira avec vous avant toute publication, et rien n’est publié sans votre accord.',
  	"version_share_form_title" varchar DEFAULT 'Soumettre un témoignage écrit',
  	"version_newsletter_eyebrow" varchar DEFAULT 'Restez connecté',
  	"version_newsletter_title" varchar DEFAULT 'Recevez nos nouveaux témoignages',
  	"version_newsletter_text" varchar DEFAULT 'Abonnez-vous pour être informé des nouveaux témoignages, prédications et événements de notre église.',
  	"version__status" "enum__page_temoignages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_foi_shortcuts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_foi_shortcuts_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_foi_themes_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_page_foi_themes_cards_theme",
  	"image_id" integer
  );
  
  CREATE TABLE "page_foi_start_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "page_foi_verses_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"reference" varchar
  );
  
  CREATE TABLE "page_foi" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Découvrir la foi',
  	"hero_title" varchar DEFAULT 'Un chemin de foi
  pour *aujourd’hui.*',
  	"hero_text" varchar DEFAULT 'Explorez des ressources simples et pratiques pour connaître Dieu, comprendre la Bible, grandir dans la foi et vivre une relation authentique avec Jésus-Christ.',
  	"hero_primary" varchar DEFAULT 'Commencer mon parcours',
  	"hero_secondary" varchar DEFAULT 'Explorer par thème',
  	"hero_image_id" integer,
  	"hero_quote_text" varchar DEFAULT 'Cherchez l’Éternel pendant qu’il se trouve ; invoquez-le, tandis qu’il est près.',
  	"hero_quote_source" varchar DEFAULT 'Ésaïe 55:6',
  	"themes_title" varchar DEFAULT 'Explorer par thème',
  	"start_title" varchar DEFAULT 'Par où commencer ?',
  	"start_button" varchar DEFAULT 'Suivre le parcours complet',
  	"start_button_link" varchar DEFAULT '/decouvrir/foi?type=parcours',
  	"verses_title" varchar DEFAULT 'Versets du jour',
  	"verses_image_id" integer,
  	"cta_eyebrow" varchar DEFAULT 'Besoin d’en parler ?',
  	"cta_title" varchar DEFAULT 'Vous avez des questions sur la foi ?',
  	"cta_text" varchar DEFAULT 'Nous sommes là pour vous accompagner dans votre parcours.',
  	"cta_primary" varchar DEFAULT 'Nous contacter',
  	"cta_image_id" integer,
  	"_status" "enum_page_foi_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_foi_v_version_shortcuts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_foi_v_version_shortcuts_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_foi_v_version_themes_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" "enum__page_foi_v_version_themes_cards_theme",
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_foi_v_version_start_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_foi_v_version_verses_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"reference" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_foi_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Découvrir la foi',
  	"version_hero_title" varchar DEFAULT 'Un chemin de foi
  pour *aujourd’hui.*',
  	"version_hero_text" varchar DEFAULT 'Explorez des ressources simples et pratiques pour connaître Dieu, comprendre la Bible, grandir dans la foi et vivre une relation authentique avec Jésus-Christ.',
  	"version_hero_primary" varchar DEFAULT 'Commencer mon parcours',
  	"version_hero_secondary" varchar DEFAULT 'Explorer par thème',
  	"version_hero_image_id" integer,
  	"version_hero_quote_text" varchar DEFAULT 'Cherchez l’Éternel pendant qu’il se trouve ; invoquez-le, tandis qu’il est près.',
  	"version_hero_quote_source" varchar DEFAULT 'Ésaïe 55:6',
  	"version_themes_title" varchar DEFAULT 'Explorer par thème',
  	"version_start_title" varchar DEFAULT 'Par où commencer ?',
  	"version_start_button" varchar DEFAULT 'Suivre le parcours complet',
  	"version_start_button_link" varchar DEFAULT '/decouvrir/foi?type=parcours',
  	"version_verses_title" varchar DEFAULT 'Versets du jour',
  	"version_verses_image_id" integer,
  	"version_cta_eyebrow" varchar DEFAULT 'Besoin d’en parler ?',
  	"version_cta_title" varchar DEFAULT 'Vous avez des questions sur la foi ?',
  	"version_cta_text" varchar DEFAULT 'Nous sommes là pour vous accompagner dans votre parcours.',
  	"version_cta_primary" varchar DEFAULT 'Nous contacter',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_foi_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_recherche" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Recherche',
  	"hero_title" varchar DEFAULT 'Résultats de *recherche*',
  	"hero_text" varchar DEFAULT 'Trouvez des prédications, des ressources pour grandir dans la foi, des témoignages, des événements et des ministères.',
  	"hero_image_id" integer,
  	"newsletter_eyebrow" varchar DEFAULT 'Restez connecté',
  	"newsletter_title" varchar DEFAULT 'Recevez nos nouveaux messages',
  	"newsletter_text" varchar DEFAULT 'Abonnez-vous pour être informé de nos dernières prédications, études bibliques et enseignements.',
  	"_status" "enum_page_recherche_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_recherche_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Recherche',
  	"version_hero_title" varchar DEFAULT 'Résultats de *recherche*',
  	"version_hero_text" varchar DEFAULT 'Trouvez des prédications, des ressources pour grandir dans la foi, des témoignages, des événements et des ministères.',
  	"version_hero_image_id" integer,
  	"version_newsletter_eyebrow" varchar DEFAULT 'Restez connecté',
  	"version_newsletter_title" varchar DEFAULT 'Recevez nos nouveaux messages',
  	"version_newsletter_text" varchar DEFAULT 'Abonnez-vous pour être informé de nos dernières prédications, études bibliques et enseignements.',
  	"version__status" "enum__page_recherche_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_servir_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_page_servir_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_servir_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_servir" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Servir',
  	"hero_title" varchar DEFAULT 'Vos dons peuvent
  *faire la différence.*',
  	"hero_text" varchar DEFAULT 'Accueil, louange, enfants, jeunesse, technique, prière, entraide : il y a une place pour chacun. Servir, c’est grandir dans la foi en mettant ses talents au service des autres.',
  	"hero_primary" varchar DEFAULT 'Je veux m’impliquer',
  	"hero_secondary" varchar DEFAULT 'Où servir',
  	"hero_image_id" integer,
  	"where_eyebrow" varchar DEFAULT 'Où servir ?',
  	"where_title" varchar DEFAULT 'Trouvez l’équipe qui vous ressemble.',
  	"where_text" varchar DEFAULT 'Chaque ministère de l’église a besoin de bénévoles. Découvrez-les et dites-nous ce qui vous intéresse.',
  	"process_eyebrow" varchar DEFAULT 'Les étapes',
  	"process_title" varchar DEFAULT 'Comment commencer ?',
  	"form_eyebrow" varchar DEFAULT 'Je veux m’impliquer',
  	"form_title" varchar DEFAULT 'Dites-nous où vous aimeriez servir.',
  	"form_text" varchar DEFAULT 'Un responsable de l’équipe vous répondra rapidement pour vous présenter les prochaines étapes.',
  	"cta_eyebrow" varchar DEFAULT 'Ensemble',
  	"cta_title" varchar DEFAULT 'Chacun a une place dans la famille.',
  	"cta_text" varchar DEFAULT 'Vous avez une question avant de vous lancer ? Écrivez-nous, nous serons heureux d’en parler avec vous.',
  	"cta_primary" varchar DEFAULT 'Nous contacter',
  	"cta_secondary" varchar DEFAULT 'Voir les ministères',
  	"cta_image_id" integer,
  	"_status" "enum_page_servir_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_servir_v_version_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__page_servir_v_version_features_items_icon" DEFAULT 'heart',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_servir_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_servir_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Servir',
  	"version_hero_title" varchar DEFAULT 'Vos dons peuvent
  *faire la différence.*',
  	"version_hero_text" varchar DEFAULT 'Accueil, louange, enfants, jeunesse, technique, prière, entraide : il y a une place pour chacun. Servir, c’est grandir dans la foi en mettant ses talents au service des autres.',
  	"version_hero_primary" varchar DEFAULT 'Je veux m’impliquer',
  	"version_hero_secondary" varchar DEFAULT 'Où servir',
  	"version_hero_image_id" integer,
  	"version_where_eyebrow" varchar DEFAULT 'Où servir ?',
  	"version_where_title" varchar DEFAULT 'Trouvez l’équipe qui vous ressemble.',
  	"version_where_text" varchar DEFAULT 'Chaque ministère de l’église a besoin de bénévoles. Découvrez-les et dites-nous ce qui vous intéresse.',
  	"version_process_eyebrow" varchar DEFAULT 'Les étapes',
  	"version_process_title" varchar DEFAULT 'Comment commencer ?',
  	"version_form_eyebrow" varchar DEFAULT 'Je veux m’impliquer',
  	"version_form_title" varchar DEFAULT 'Dites-nous où vous aimeriez servir.',
  	"version_form_text" varchar DEFAULT 'Un responsable de l’équipe vous répondra rapidement pour vous présenter les prochaines étapes.',
  	"version_cta_eyebrow" varchar DEFAULT 'Ensemble',
  	"version_cta_title" varchar DEFAULT 'Chacun a une place dans la famille.',
  	"version_cta_text" varchar DEFAULT 'Vous avez une question avant de vous lancer ? Écrivez-nous, nous serons heureux d’en parler avec vous.',
  	"version_cta_primary" varchar DEFAULT 'Nous contacter',
  	"version_cta_secondary" varchar DEFAULT 'Voir les ministères',
  	"version_cta_image_id" integer,
  	"version__status" "enum__page_servir_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "page_legal_privacy_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "page_legal_terms_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "page_legal_cookies_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "page_legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"officer_name" varchar DEFAULT 'Nom à confirmer',
  	"officer_role" varchar DEFAULT 'Responsable de la protection des renseignements personnels',
  	"officer_email" varchar,
  	"privacy_title" varchar DEFAULT 'Politique de confidentialité',
  	"privacy_intro" varchar DEFAULT 'MKMI Québec respecte votre vie privée. Cette politique explique quels renseignements nous recueillons sur ce site, pourquoi, et comment exercer vos droits, conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25).',
  	"privacy_updated" timestamp(3) with time zone DEFAULT '2026-09-30T12:00:00.000Z',
  	"terms_title" varchar DEFAULT 'Conditions d’utilisation',
  	"terms_intro" varchar DEFAULT 'En utilisant ce site, vous acceptez les conditions suivantes.',
  	"terms_updated" timestamp(3) with time zone DEFAULT '2026-09-30T12:00:00.000Z',
  	"cookies_title" varchar DEFAULT 'Cookies',
  	"cookies_intro" varchar DEFAULT 'Ce site est conçu pour respecter votre vie privée : il n’utilise aucun cookie publicitaire ni de mesure d’audience.',
  	"cookies_updated" timestamp(3) with time zone DEFAULT '2026-09-30T12:00:00.000Z',
  	"_status" "enum_page_legal_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_page_legal_v_version_privacy_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_legal_v_version_terms_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_legal_v_version_cookies_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_legal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_officer_name" varchar DEFAULT 'Nom à confirmer',
  	"version_officer_role" varchar DEFAULT 'Responsable de la protection des renseignements personnels',
  	"version_officer_email" varchar,
  	"version_privacy_title" varchar DEFAULT 'Politique de confidentialité',
  	"version_privacy_intro" varchar DEFAULT 'MKMI Québec respecte votre vie privée. Cette politique explique quels renseignements nous recueillons sur ce site, pourquoi, et comment exercer vos droits, conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25).',
  	"version_privacy_updated" timestamp(3) with time zone DEFAULT '2026-09-30T12:00:00.000Z',
  	"version_terms_title" varchar DEFAULT 'Conditions d’utilisation',
  	"version_terms_intro" varchar DEFAULT 'En utilisant ce site, vous acceptez les conditions suivantes.',
  	"version_terms_updated" timestamp(3) with time zone DEFAULT '2026-09-30T12:00:00.000Z',
  	"version_cookies_title" varchar DEFAULT 'Cookies',
  	"version_cookies_intro" varchar DEFAULT 'Ce site est conçu pour respecter votre vie privée : il n’utilise aucun cookie publicitaire ni de mesure d’audience.',
  	"version_cookies_updated" timestamp(3) with time zone DEFAULT '2026-09-30T12:00:00.000Z',
  	"version__status" "enum__page_legal_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "page_visite" ALTER COLUMN "hero_title" SET DEFAULT 'Planifier ma *visite*';
  ALTER TABLE "page_visite" ALTER COLUMN "hero_text" SET DEFAULT 'Nous sommes ravis de vous accueillir ! Choisissez le jour de votre visite : une personne de l’équipe d’accueil sera là pour vous recevoir, vous faire découvrir notre communauté et répondre à vos questions.';
  ALTER TABLE "page_visite" ALTER COLUMN "expect_title" SET DEFAULT 'Le déroulement d’un culte.';
  ALTER TABLE "page_visite" ALTER COLUMN "plan_title" SET DEFAULT 'Dites-nous quand vous venez.';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_hero_title" SET DEFAULT 'Planifier ma *visite*';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_hero_text" SET DEFAULT 'Nous sommes ravis de vous accueillir ! Choisissez le jour de votre visite : une personne de l’équipe d’accueil sera là pour vous recevoir, vous faire découvrir notre communauté et répondre à vos questions.';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_expect_title" SET DEFAULT 'Le déroulement d’un culte.';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_plan_title" SET DEFAULT 'Dites-nous quand vous venez.';
  ALTER TABLE "visit_plans" ADD COLUMN "service" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "testimonials" ADD COLUMN "category" "enum_testimonials_category" DEFAULT 'autre';
  ALTER TABLE "testimonials" ADD COLUMN "youtube_url" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "duration" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "status" "enum_testimonials_status" DEFAULT 'pending';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faith_resources_id" integer;
  ALTER TABLE "page_visite" ADD COLUMN "plan_transit" varchar DEFAULT 'Informations sur les autobus (RTC) à venir.';
  ALTER TABLE "_page_visite_v" ADD COLUMN "version_plan_transit" varchar DEFAULT 'Informations sur les autobus (RTC) à venir.';
  ALTER TABLE "faith_resources" ADD CONSTRAINT "faith_resources_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faith_resources_v" ADD CONSTRAINT "_faith_resources_v_parent_id_faith_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faith_resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faith_resources_v" ADD CONSTRAINT "_faith_resources_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_visite_services_list" ADD CONSTRAINT "page_visite_services_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_visite_services_list" ADD CONSTRAINT "page_visite_services_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_visite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_visite_v_version_services_list" ADD CONSTRAINT "_page_visite_v_version_services_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_visite_v_version_services_list" ADD CONSTRAINT "_page_visite_v_version_services_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_visite_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_temoignages_features_items" ADD CONSTRAINT "page_temoignages_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_temoignages" ADD CONSTRAINT "page_temoignages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_temoignages_v_version_features_items" ADD CONSTRAINT "_page_temoignages_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_temoignages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_temoignages_v" ADD CONSTRAINT "_page_temoignages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_foi_shortcuts_items" ADD CONSTRAINT "page_foi_shortcuts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_foi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_foi_themes_cards" ADD CONSTRAINT "page_foi_themes_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_foi_themes_cards" ADD CONSTRAINT "page_foi_themes_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_foi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_foi_start_steps" ADD CONSTRAINT "page_foi_start_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_foi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_foi_verses_list" ADD CONSTRAINT "page_foi_verses_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_foi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_foi" ADD CONSTRAINT "page_foi_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_foi" ADD CONSTRAINT "page_foi_verses_image_id_media_id_fk" FOREIGN KEY ("verses_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_foi" ADD CONSTRAINT "page_foi_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_foi_v_version_shortcuts_items" ADD CONSTRAINT "_page_foi_v_version_shortcuts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_foi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_foi_v_version_themes_cards" ADD CONSTRAINT "_page_foi_v_version_themes_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_foi_v_version_themes_cards" ADD CONSTRAINT "_page_foi_v_version_themes_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_foi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_foi_v_version_start_steps" ADD CONSTRAINT "_page_foi_v_version_start_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_foi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_foi_v_version_verses_list" ADD CONSTRAINT "_page_foi_v_version_verses_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_foi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_foi_v" ADD CONSTRAINT "_page_foi_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_foi_v" ADD CONSTRAINT "_page_foi_v_version_verses_image_id_media_id_fk" FOREIGN KEY ("version_verses_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_foi_v" ADD CONSTRAINT "_page_foi_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_recherche" ADD CONSTRAINT "page_recherche_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_recherche_v" ADD CONSTRAINT "_page_recherche_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_servir_features_items" ADD CONSTRAINT "page_servir_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_servir"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_servir_process_steps" ADD CONSTRAINT "page_servir_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_servir"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_servir" ADD CONSTRAINT "page_servir_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_servir" ADD CONSTRAINT "page_servir_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_servir_v_version_features_items" ADD CONSTRAINT "_page_servir_v_version_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_servir_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_servir_v_version_process_steps" ADD CONSTRAINT "_page_servir_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_servir_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_servir_v" ADD CONSTRAINT "_page_servir_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_servir_v" ADD CONSTRAINT "_page_servir_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_legal_privacy_sections" ADD CONSTRAINT "page_legal_privacy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_legal_terms_sections" ADD CONSTRAINT "page_legal_terms_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_legal_cookies_sections" ADD CONSTRAINT "page_legal_cookies_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_legal_v_version_privacy_sections" ADD CONSTRAINT "_page_legal_v_version_privacy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_legal_v_version_terms_sections" ADD CONSTRAINT "_page_legal_v_version_terms_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_legal_v_version_cookies_sections" ADD CONSTRAINT "_page_legal_v_version_cookies_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faith_resources_cover_idx" ON "faith_resources" USING btree ("cover_id");
  CREATE UNIQUE INDEX "faith_resources_slug_idx" ON "faith_resources" USING btree ("slug");
  CREATE INDEX "faith_resources_updated_at_idx" ON "faith_resources" USING btree ("updated_at");
  CREATE INDEX "faith_resources_created_at_idx" ON "faith_resources" USING btree ("created_at");
  CREATE INDEX "faith_resources__status_idx" ON "faith_resources" USING btree ("_status");
  CREATE INDEX "_faith_resources_v_parent_idx" ON "_faith_resources_v" USING btree ("parent_id");
  CREATE INDEX "_faith_resources_v_version_version_cover_idx" ON "_faith_resources_v" USING btree ("version_cover_id");
  CREATE INDEX "_faith_resources_v_version_version_slug_idx" ON "_faith_resources_v" USING btree ("version_slug");
  CREATE INDEX "_faith_resources_v_version_version_updated_at_idx" ON "_faith_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_faith_resources_v_version_version_created_at_idx" ON "_faith_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_faith_resources_v_version_version__status_idx" ON "_faith_resources_v" USING btree ("version__status");
  CREATE INDEX "_faith_resources_v_created_at_idx" ON "_faith_resources_v" USING btree ("created_at");
  CREATE INDEX "_faith_resources_v_updated_at_idx" ON "_faith_resources_v" USING btree ("updated_at");
  CREATE INDEX "_faith_resources_v_latest_idx" ON "_faith_resources_v" USING btree ("latest");
  CREATE INDEX "page_visite_services_list_order_idx" ON "page_visite_services_list" USING btree ("_order");
  CREATE INDEX "page_visite_services_list_parent_id_idx" ON "page_visite_services_list" USING btree ("_parent_id");
  CREATE INDEX "page_visite_services_list_image_idx" ON "page_visite_services_list" USING btree ("image_id");
  CREATE INDEX "_page_visite_v_version_services_list_order_idx" ON "_page_visite_v_version_services_list" USING btree ("_order");
  CREATE INDEX "_page_visite_v_version_services_list_parent_id_idx" ON "_page_visite_v_version_services_list" USING btree ("_parent_id");
  CREATE INDEX "_page_visite_v_version_services_list_image_idx" ON "_page_visite_v_version_services_list" USING btree ("image_id");
  CREATE INDEX "page_temoignages_features_items_order_idx" ON "page_temoignages_features_items" USING btree ("_order");
  CREATE INDEX "page_temoignages_features_items_parent_id_idx" ON "page_temoignages_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_temoignages_hero_hero_image_idx" ON "page_temoignages" USING btree ("hero_image_id");
  CREATE INDEX "page_temoignages__status_idx" ON "page_temoignages" USING btree ("_status");
  CREATE INDEX "_page_temoignages_v_version_features_items_order_idx" ON "_page_temoignages_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_temoignages_v_version_features_items_parent_id_idx" ON "_page_temoignages_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_temoignages_v_version_hero_version_hero_image_idx" ON "_page_temoignages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_temoignages_v_version_version__status_idx" ON "_page_temoignages_v" USING btree ("version__status");
  CREATE INDEX "_page_temoignages_v_created_at_idx" ON "_page_temoignages_v" USING btree ("created_at");
  CREATE INDEX "_page_temoignages_v_updated_at_idx" ON "_page_temoignages_v" USING btree ("updated_at");
  CREATE INDEX "_page_temoignages_v_latest_idx" ON "_page_temoignages_v" USING btree ("latest");
  CREATE INDEX "_page_temoignages_v_autosave_idx" ON "_page_temoignages_v" USING btree ("autosave");
  CREATE INDEX "page_foi_shortcuts_items_order_idx" ON "page_foi_shortcuts_items" USING btree ("_order");
  CREATE INDEX "page_foi_shortcuts_items_parent_id_idx" ON "page_foi_shortcuts_items" USING btree ("_parent_id");
  CREATE INDEX "page_foi_themes_cards_order_idx" ON "page_foi_themes_cards" USING btree ("_order");
  CREATE INDEX "page_foi_themes_cards_parent_id_idx" ON "page_foi_themes_cards" USING btree ("_parent_id");
  CREATE INDEX "page_foi_themes_cards_image_idx" ON "page_foi_themes_cards" USING btree ("image_id");
  CREATE INDEX "page_foi_start_steps_order_idx" ON "page_foi_start_steps" USING btree ("_order");
  CREATE INDEX "page_foi_start_steps_parent_id_idx" ON "page_foi_start_steps" USING btree ("_parent_id");
  CREATE INDEX "page_foi_verses_list_order_idx" ON "page_foi_verses_list" USING btree ("_order");
  CREATE INDEX "page_foi_verses_list_parent_id_idx" ON "page_foi_verses_list" USING btree ("_parent_id");
  CREATE INDEX "page_foi_hero_hero_image_idx" ON "page_foi" USING btree ("hero_image_id");
  CREATE INDEX "page_foi_verses_verses_image_idx" ON "page_foi" USING btree ("verses_image_id");
  CREATE INDEX "page_foi_cta_cta_image_idx" ON "page_foi" USING btree ("cta_image_id");
  CREATE INDEX "page_foi__status_idx" ON "page_foi" USING btree ("_status");
  CREATE INDEX "_page_foi_v_version_shortcuts_items_order_idx" ON "_page_foi_v_version_shortcuts_items" USING btree ("_order");
  CREATE INDEX "_page_foi_v_version_shortcuts_items_parent_id_idx" ON "_page_foi_v_version_shortcuts_items" USING btree ("_parent_id");
  CREATE INDEX "_page_foi_v_version_themes_cards_order_idx" ON "_page_foi_v_version_themes_cards" USING btree ("_order");
  CREATE INDEX "_page_foi_v_version_themes_cards_parent_id_idx" ON "_page_foi_v_version_themes_cards" USING btree ("_parent_id");
  CREATE INDEX "_page_foi_v_version_themes_cards_image_idx" ON "_page_foi_v_version_themes_cards" USING btree ("image_id");
  CREATE INDEX "_page_foi_v_version_start_steps_order_idx" ON "_page_foi_v_version_start_steps" USING btree ("_order");
  CREATE INDEX "_page_foi_v_version_start_steps_parent_id_idx" ON "_page_foi_v_version_start_steps" USING btree ("_parent_id");
  CREATE INDEX "_page_foi_v_version_verses_list_order_idx" ON "_page_foi_v_version_verses_list" USING btree ("_order");
  CREATE INDEX "_page_foi_v_version_verses_list_parent_id_idx" ON "_page_foi_v_version_verses_list" USING btree ("_parent_id");
  CREATE INDEX "_page_foi_v_version_hero_version_hero_image_idx" ON "_page_foi_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_foi_v_version_verses_version_verses_image_idx" ON "_page_foi_v" USING btree ("version_verses_image_id");
  CREATE INDEX "_page_foi_v_version_cta_version_cta_image_idx" ON "_page_foi_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_foi_v_version_version__status_idx" ON "_page_foi_v" USING btree ("version__status");
  CREATE INDEX "_page_foi_v_created_at_idx" ON "_page_foi_v" USING btree ("created_at");
  CREATE INDEX "_page_foi_v_updated_at_idx" ON "_page_foi_v" USING btree ("updated_at");
  CREATE INDEX "_page_foi_v_latest_idx" ON "_page_foi_v" USING btree ("latest");
  CREATE INDEX "_page_foi_v_autosave_idx" ON "_page_foi_v" USING btree ("autosave");
  CREATE INDEX "page_recherche_hero_hero_image_idx" ON "page_recherche" USING btree ("hero_image_id");
  CREATE INDEX "page_recherche__status_idx" ON "page_recherche" USING btree ("_status");
  CREATE INDEX "_page_recherche_v_version_hero_version_hero_image_idx" ON "_page_recherche_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_recherche_v_version_version__status_idx" ON "_page_recherche_v" USING btree ("version__status");
  CREATE INDEX "_page_recherche_v_created_at_idx" ON "_page_recherche_v" USING btree ("created_at");
  CREATE INDEX "_page_recherche_v_updated_at_idx" ON "_page_recherche_v" USING btree ("updated_at");
  CREATE INDEX "_page_recherche_v_latest_idx" ON "_page_recherche_v" USING btree ("latest");
  CREATE INDEX "_page_recherche_v_autosave_idx" ON "_page_recherche_v" USING btree ("autosave");
  CREATE INDEX "page_servir_features_items_order_idx" ON "page_servir_features_items" USING btree ("_order");
  CREATE INDEX "page_servir_features_items_parent_id_idx" ON "page_servir_features_items" USING btree ("_parent_id");
  CREATE INDEX "page_servir_process_steps_order_idx" ON "page_servir_process_steps" USING btree ("_order");
  CREATE INDEX "page_servir_process_steps_parent_id_idx" ON "page_servir_process_steps" USING btree ("_parent_id");
  CREATE INDEX "page_servir_hero_hero_image_idx" ON "page_servir" USING btree ("hero_image_id");
  CREATE INDEX "page_servir_cta_cta_image_idx" ON "page_servir" USING btree ("cta_image_id");
  CREATE INDEX "page_servir__status_idx" ON "page_servir" USING btree ("_status");
  CREATE INDEX "_page_servir_v_version_features_items_order_idx" ON "_page_servir_v_version_features_items" USING btree ("_order");
  CREATE INDEX "_page_servir_v_version_features_items_parent_id_idx" ON "_page_servir_v_version_features_items" USING btree ("_parent_id");
  CREATE INDEX "_page_servir_v_version_process_steps_order_idx" ON "_page_servir_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_page_servir_v_version_process_steps_parent_id_idx" ON "_page_servir_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_page_servir_v_version_hero_version_hero_image_idx" ON "_page_servir_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_servir_v_version_cta_version_cta_image_idx" ON "_page_servir_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_page_servir_v_version_version__status_idx" ON "_page_servir_v" USING btree ("version__status");
  CREATE INDEX "_page_servir_v_created_at_idx" ON "_page_servir_v" USING btree ("created_at");
  CREATE INDEX "_page_servir_v_updated_at_idx" ON "_page_servir_v" USING btree ("updated_at");
  CREATE INDEX "_page_servir_v_latest_idx" ON "_page_servir_v" USING btree ("latest");
  CREATE INDEX "_page_servir_v_autosave_idx" ON "_page_servir_v" USING btree ("autosave");
  CREATE INDEX "page_legal_privacy_sections_order_idx" ON "page_legal_privacy_sections" USING btree ("_order");
  CREATE INDEX "page_legal_privacy_sections_parent_id_idx" ON "page_legal_privacy_sections" USING btree ("_parent_id");
  CREATE INDEX "page_legal_terms_sections_order_idx" ON "page_legal_terms_sections" USING btree ("_order");
  CREATE INDEX "page_legal_terms_sections_parent_id_idx" ON "page_legal_terms_sections" USING btree ("_parent_id");
  CREATE INDEX "page_legal_cookies_sections_order_idx" ON "page_legal_cookies_sections" USING btree ("_order");
  CREATE INDEX "page_legal_cookies_sections_parent_id_idx" ON "page_legal_cookies_sections" USING btree ("_parent_id");
  CREATE INDEX "page_legal__status_idx" ON "page_legal" USING btree ("_status");
  CREATE INDEX "_page_legal_v_version_privacy_sections_order_idx" ON "_page_legal_v_version_privacy_sections" USING btree ("_order");
  CREATE INDEX "_page_legal_v_version_privacy_sections_parent_id_idx" ON "_page_legal_v_version_privacy_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_legal_v_version_terms_sections_order_idx" ON "_page_legal_v_version_terms_sections" USING btree ("_order");
  CREATE INDEX "_page_legal_v_version_terms_sections_parent_id_idx" ON "_page_legal_v_version_terms_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_legal_v_version_cookies_sections_order_idx" ON "_page_legal_v_version_cookies_sections" USING btree ("_order");
  CREATE INDEX "_page_legal_v_version_cookies_sections_parent_id_idx" ON "_page_legal_v_version_cookies_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_legal_v_version_version__status_idx" ON "_page_legal_v" USING btree ("version__status");
  CREATE INDEX "_page_legal_v_created_at_idx" ON "_page_legal_v" USING btree ("created_at");
  CREATE INDEX "_page_legal_v_updated_at_idx" ON "_page_legal_v" USING btree ("updated_at");
  CREATE INDEX "_page_legal_v_latest_idx" ON "_page_legal_v" USING btree ("latest");
  CREATE INDEX "_page_legal_v_autosave_idx" ON "_page_legal_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faith_resources_fk" FOREIGN KEY ("faith_resources_id") REFERENCES "public"."faith_resources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faith_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("faith_resources_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faith_resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faith_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_visite_services_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_visite_v_version_services_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_temoignages_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_temoignages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_temoignages_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_temoignages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_foi_shortcuts_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_foi_themes_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_foi_start_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_foi_verses_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_foi" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_foi_v_version_shortcuts_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_foi_v_version_themes_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_foi_v_version_start_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_foi_v_version_verses_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_foi_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_recherche" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_recherche_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_servir_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_servir_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_servir" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_servir_v_version_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_servir_v_version_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_servir_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_legal_privacy_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_legal_terms_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_legal_cookies_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_legal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_legal_v_version_privacy_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_legal_v_version_terms_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_legal_v_version_cookies_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_legal_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faith_resources" CASCADE;
  DROP TABLE "_faith_resources_v" CASCADE;
  DROP TABLE "page_visite_services_list" CASCADE;
  DROP TABLE "_page_visite_v_version_services_list" CASCADE;
  DROP TABLE "page_temoignages_features_items" CASCADE;
  DROP TABLE "page_temoignages" CASCADE;
  DROP TABLE "_page_temoignages_v_version_features_items" CASCADE;
  DROP TABLE "_page_temoignages_v" CASCADE;
  DROP TABLE "page_foi_shortcuts_items" CASCADE;
  DROP TABLE "page_foi_themes_cards" CASCADE;
  DROP TABLE "page_foi_start_steps" CASCADE;
  DROP TABLE "page_foi_verses_list" CASCADE;
  DROP TABLE "page_foi" CASCADE;
  DROP TABLE "_page_foi_v_version_shortcuts_items" CASCADE;
  DROP TABLE "_page_foi_v_version_themes_cards" CASCADE;
  DROP TABLE "_page_foi_v_version_start_steps" CASCADE;
  DROP TABLE "_page_foi_v_version_verses_list" CASCADE;
  DROP TABLE "_page_foi_v" CASCADE;
  DROP TABLE "page_recherche" CASCADE;
  DROP TABLE "_page_recherche_v" CASCADE;
  DROP TABLE "page_servir_features_items" CASCADE;
  DROP TABLE "page_servir_process_steps" CASCADE;
  DROP TABLE "page_servir" CASCADE;
  DROP TABLE "_page_servir_v_version_features_items" CASCADE;
  DROP TABLE "_page_servir_v_version_process_steps" CASCADE;
  DROP TABLE "_page_servir_v" CASCADE;
  DROP TABLE "page_legal_privacy_sections" CASCADE;
  DROP TABLE "page_legal_terms_sections" CASCADE;
  DROP TABLE "page_legal_cookies_sections" CASCADE;
  DROP TABLE "page_legal" CASCADE;
  DROP TABLE "_page_legal_v_version_privacy_sections" CASCADE;
  DROP TABLE "_page_legal_v_version_terms_sections" CASCADE;
  DROP TABLE "_page_legal_v_version_cookies_sections" CASCADE;
  DROP TABLE "_page_legal_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faith_resources_fk";
  
  DROP INDEX "payload_locked_documents_rels_faith_resources_id_idx";
  ALTER TABLE "page_visite" ALTER COLUMN "hero_title" SET DEFAULT 'Votre première visite,
  *on vous attend.*';
  ALTER TABLE "page_visite" ALTER COLUMN "hero_text" SET DEFAULT 'Venir dans une nouvelle église peut sembler intimidant. Dites-nous quand vous comptez venir : une personne de l’équipe d’accueil sera là pour vous recevoir et répondre à vos questions.';
  ALTER TABLE "page_visite" ALTER COLUMN "expect_title" SET DEFAULT 'Le déroulement *d’un culte.*';
  ALTER TABLE "page_visite" ALTER COLUMN "plan_title" SET DEFAULT 'Dites-nous *quand vous venez.*';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_hero_title" SET DEFAULT 'Votre première visite,
  *on vous attend.*';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_hero_text" SET DEFAULT 'Venir dans une nouvelle église peut sembler intimidant. Dites-nous quand vous comptez venir : une personne de l’équipe d’accueil sera là pour vous recevoir et répondre à vos questions.';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_expect_title" SET DEFAULT 'Le déroulement *d’un culte.*';
  ALTER TABLE "_page_visite_v" ALTER COLUMN "version_plan_title" SET DEFAULT 'Dites-nous *quand vous venez.*';
  ALTER TABLE "visit_plans" DROP COLUMN "service";
  ALTER TABLE "testimonials" DROP COLUMN "title";
  ALTER TABLE "testimonials" DROP COLUMN "category";
  ALTER TABLE "testimonials" DROP COLUMN "youtube_url";
  ALTER TABLE "testimonials" DROP COLUMN "duration";
  ALTER TABLE "testimonials" DROP COLUMN "status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faith_resources_id";
  ALTER TABLE "page_visite" DROP COLUMN "plan_transit";
  ALTER TABLE "_page_visite_v" DROP COLUMN "version_plan_transit";
  DROP TYPE "public"."enum_testimonials_category";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_faith_type";
  DROP TYPE "public"."enum_faith_theme";
  DROP TYPE "public"."enum_faith_level";
  DROP TYPE "public"."enum_faith_resources_status";
  DROP TYPE "public"."enum__faith_resources_v_version_status";
  DROP TYPE "public"."enum_page_visite_services_list_weekday";
  DROP TYPE "public"."enum__page_visite_v_version_services_list_weekday";
  DROP TYPE "public"."enum_page_temoignages_features_items_icon";
  DROP TYPE "public"."enum_page_temoignages_status";
  DROP TYPE "public"."enum__page_temoignages_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_temoignages_v_version_status";
  DROP TYPE "public"."enum_page_foi_shortcuts_items_icon";
  DROP TYPE "public"."enum_page_foi_themes_cards_theme";
  DROP TYPE "public"."enum_page_foi_status";
  DROP TYPE "public"."enum__page_foi_v_version_shortcuts_items_icon";
  DROP TYPE "public"."enum__page_foi_v_version_themes_cards_theme";
  DROP TYPE "public"."enum__page_foi_v_version_status";
  DROP TYPE "public"."enum_page_recherche_status";
  DROP TYPE "public"."enum__page_recherche_v_version_status";
  DROP TYPE "public"."enum_page_servir_features_items_icon";
  DROP TYPE "public"."enum_page_servir_status";
  DROP TYPE "public"."enum__page_servir_v_version_features_items_icon";
  DROP TYPE "public"."enum__page_servir_v_version_status";
  DROP TYPE "public"."enum_page_legal_status";
  DROP TYPE "public"."enum__page_legal_v_version_status";`)
}
