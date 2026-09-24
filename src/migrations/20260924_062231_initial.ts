import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sermons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sermons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ministries_icon" AS ENUM('baby', 'book', 'flower', 'users', 'heart-handshake', 'hand-heart', 'music', 'globe', 'video', 'graduation-cap', 'megaphone');
  CREATE TYPE "public"."enum_ministries_accent" AS ENUM('blue', 'red', 'green', 'purple', 'gold');
  CREATE TYPE "public"."enum_ministries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ministries_v_version_icon" AS ENUM('baby', 'book', 'flower', 'users', 'heart-handshake', 'hand-heart', 'music', 'globe', 'video', 'graduation-cap', 'megaphone');
  CREATE TYPE "public"."enum__ministries_v_version_accent" AS ENUM('blue', 'red', 'green', 'purple', 'gold');
  CREATE TYPE "public"."enum__ministries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_missions_project_status" AS ENUM('active', 'planned', 'done');
  CREATE TYPE "public"."enum_missions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__missions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_prayer_requests_status" AS ENUM('new', 'praying', 'answered', 'archived');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'pastoral');
  CREATE TYPE "public"."enum_home_page_welcome_cards_icon" AS ENUM('church', 'book', 'users');
  CREATE TYPE "public"."enum_home_page_pillars_items_icon" AS ENUM('megaphone', 'book', 'users', 'heart');
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"time_to_confirm" boolean DEFAULT false,
  	"location" varchar DEFAULT 'Québec, Québec',
  	"summary" varchar,
  	"description" jsonb,
  	"registration_enabled" boolean DEFAULT true,
  	"capacity" numeric,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_image_id" integer,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_time_to_confirm" boolean DEFAULT false,
  	"version_location" varchar DEFAULT 'Québec, Québec',
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_registration_enabled" boolean DEFAULT true,
  	"version_capacity" numeric,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "sermons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"preacher" varchar DEFAULT 'Pasteur (nom à confirmer)',
  	"date" timestamp(3) with time zone,
  	"series" varchar,
  	"category" varchar DEFAULT 'Prédication',
  	"featured" boolean DEFAULT false,
  	"thumbnail_id" integer,
  	"preacher_photo_id" integer,
  	"youtube_url" varchar,
  	"podcast_url" varchar,
  	"audio_file_id" integer,
  	"description" jsonb,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sermons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sermons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_preacher" varchar DEFAULT 'Pasteur (nom à confirmer)',
  	"version_date" timestamp(3) with time zone,
  	"version_series" varchar,
  	"version_category" varchar DEFAULT 'Prédication',
  	"version_featured" boolean DEFAULT false,
  	"version_thumbnail_id" integer,
  	"version_preacher_photo_id" integer,
  	"version_youtube_url" varchar,
  	"version_podcast_url" varchar,
  	"version_audio_file_id" integer,
  	"version_description" jsonb,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sermons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "ministries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"icon" "enum_ministries_icon" DEFAULT 'users',
  	"accent" "enum_ministries_accent" DEFAULT 'blue',
  	"order" numeric DEFAULT 0,
  	"summary" varchar,
  	"description" jsonb,
  	"leader" varchar,
  	"schedule" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_ministries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_ministries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_image_id" integer,
  	"version_icon" "enum__ministries_v_version_icon" DEFAULT 'users',
  	"version_accent" "enum__ministries_v_version_accent" DEFAULT 'blue',
  	"version_order" numeric DEFAULT 0,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_leader" varchar,
  	"version_schedule" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__ministries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "missions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project" varchar,
  	"zone" varchar,
  	"description" varchar,
  	"status" "enum_missions_project_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_missions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "missions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_missions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_project" varchar,
  	"version_zone" varchar,
  	"version_description" varchar,
  	"version_status" "enum_missions_project_status" DEFAULT 'active',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__missions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_missions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"email" varchar,
  	"text" varchar NOT NULL,
  	"photo_id" integer,
  	"consent" boolean DEFAULT false NOT NULL,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"request" varchar NOT NULL,
  	"wants_reply" boolean DEFAULT false,
  	"confidential" boolean DEFAULT true,
  	"status" "enum_prayer_requests_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "visit_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"visit_date" timestamp(3) with time zone,
  	"people" numeric DEFAULT 1,
  	"with_children" boolean,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"seats" numeric DEFAULT 1,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"count" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer,
  	"sermons_id" integer,
  	"ministries_id" integer,
  	"missions_id" integer,
  	"media_id" integer,
  	"testimonials_id" integer,
  	"prayer_requests_id" integer,
  	"visit_plans_id" integer,
  	"event_registrations_id" integer,
  	"newsletter_subscribers_id" integer,
  	"page_views_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"highlight" varchar
  );
  
  CREATE TABLE "home_page_welcome_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"href" varchar,
  	"icon" "enum_home_page_welcome_cards_icon",
  	"image_id" integer
  );
  
  CREATE TABLE "home_page_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"icon" "enum_home_page_pillars_items_icon"
  );
  
  CREATE TABLE "home_page_missions_zones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'MKMI Québec',
  	"hero_subtitle" varchar DEFAULT 'Une communauté chrétienne où nous grandissons dans la foi, vivons la communion fraternelle et annonçons l’Évangile à notre génération.',
  	"hero_image_id" integer,
  	"hero_video_id" integer,
  	"welcome_eyebrow" varchar DEFAULT 'Nouveau ici ?',
  	"welcome_title" varchar DEFAULT 'Vous êtes les bienvenus.',
  	"welcome_text" varchar DEFAULT 'Que vous découvriez la foi chrétienne, que vous soyez nouveau à Québec ou que vous cherchiez simplement une communauté où grandir, vous avez votre place parmi nous.',
  	"pillars_eyebrow" varchar DEFAULT 'Notre ADN',
  	"pillars_title" varchar DEFAULT 'Quatre piliers pour une génération',
  	"pillars_text" varchar DEFAULT 'Nous sommes une église passionnée par Jésus, centrée sur la Parole, attachée à la communauté et engagée pour notre monde.',
  	"pillars_background_id" integer,
  	"prayer_eyebrow" varchar DEFAULT 'Prière',
  	"prayer_title" varchar DEFAULT 'Vous n’avez pas à traverser cela seul.',
  	"prayer_text" varchar DEFAULT 'Notre équipe est disponible pour prier avec vous.
  Peu importe ce que vous vivez, Dieu écoute et se soucie de vous.',
  	"prayer_image_id" integer,
  	"missions_eyebrow" varchar DEFAULT 'Missions',
  	"missions_title" varchar DEFAULT 'Au-delà de Québec',
  	"missions_subtitle" varchar DEFAULT 'L’Évangile ne connaît pas de frontières.',
  	"missions_text" varchar DEFAULT 'Nous croyons à une église qui impacte sa ville, son pays et les nations. Ensemble, nous soutenons des initiatives locales et internationales pour partager l’amour de Christ.',
  	"final_cta_title" varchar DEFAULT 'Prêt à faire un pas de plus ?',
  	"final_cta_text" varchar DEFAULT 'Nous serions heureux de vous accueillir et de marcher avec vous sur votre cheminement de foi.',
  	"final_cta_background_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'MKMI Québec',
  	"tagline" varchar DEFAULT 'Une communauté.
  Une foi.
  Une mission.',
  	"logo_id" integer,
  	"service_day" varchar DEFAULT 'Dimanche',
  	"service_time" varchar DEFAULT 'Heure à confirmer',
  	"city" varchar DEFAULT 'Québec, Québec',
  	"address" varchar DEFAULT '(Adresse à confirmer)',
  	"directions_url" varchar,
  	"phone" varchar DEFAULT 'Téléphone à confirmer',
  	"email" varchar DEFAULT 'Email à confirmer',
  	"donate_url" varchar,
  	"facebook" varchar,
  	"instagram" varchar,
  	"youtube" varchar,
  	"tiktok" varchar,
  	"whatsapp" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_preacher_photo_id_media_id_fk" FOREIGN KEY ("preacher_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_parent_id_sermons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sermons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_preacher_photo_id_media_id_fk" FOREIGN KEY ("version_preacher_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_audio_file_id_media_id_fk" FOREIGN KEY ("version_audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ministries" ADD CONSTRAINT "ministries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ministries_v" ADD CONSTRAINT "_ministries_v_parent_id_ministries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ministries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ministries_v" ADD CONSTRAINT "_ministries_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "missions_rels" ADD CONSTRAINT "missions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "missions_rels" ADD CONSTRAINT "missions_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_missions_v" ADD CONSTRAINT "_missions_v_parent_id_missions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."missions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_missions_v_rels" ADD CONSTRAINT "_missions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_missions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_missions_v_rels" ADD CONSTRAINT "_missions_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sermons_fk" FOREIGN KEY ("sermons_id") REFERENCES "public"."sermons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ministries_fk" FOREIGN KEY ("ministries_id") REFERENCES "public"."ministries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_missions_fk" FOREIGN KEY ("missions_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_requests_fk" FOREIGN KEY ("prayer_requests_id") REFERENCES "public"."prayer_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visit_plans_fk" FOREIGN KEY ("visit_plans_id") REFERENCES "public"."visit_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_lines" ADD CONSTRAINT "home_page_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_welcome_cards" ADD CONSTRAINT "home_page_welcome_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_welcome_cards" ADD CONSTRAINT "home_page_welcome_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pillars_items" ADD CONSTRAINT "home_page_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_missions_zones" ADD CONSTRAINT "home_page_missions_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_pillars_background_id_media_id_fk" FOREIGN KEY ("pillars_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_prayer_image_id_media_id_fk" FOREIGN KEY ("prayer_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_final_cta_background_id_media_id_fk" FOREIGN KEY ("final_cta_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "sermons_thumbnail_idx" ON "sermons" USING btree ("thumbnail_id");
  CREATE INDEX "sermons_preacher_photo_idx" ON "sermons" USING btree ("preacher_photo_id");
  CREATE INDEX "sermons_audio_file_idx" ON "sermons" USING btree ("audio_file_id");
  CREATE UNIQUE INDEX "sermons_slug_idx" ON "sermons" USING btree ("slug");
  CREATE INDEX "sermons_updated_at_idx" ON "sermons" USING btree ("updated_at");
  CREATE INDEX "sermons_created_at_idx" ON "sermons" USING btree ("created_at");
  CREATE INDEX "sermons__status_idx" ON "sermons" USING btree ("_status");
  CREATE INDEX "_sermons_v_parent_idx" ON "_sermons_v" USING btree ("parent_id");
  CREATE INDEX "_sermons_v_version_version_thumbnail_idx" ON "_sermons_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_sermons_v_version_version_preacher_photo_idx" ON "_sermons_v" USING btree ("version_preacher_photo_id");
  CREATE INDEX "_sermons_v_version_version_audio_file_idx" ON "_sermons_v" USING btree ("version_audio_file_id");
  CREATE INDEX "_sermons_v_version_version_slug_idx" ON "_sermons_v" USING btree ("version_slug");
  CREATE INDEX "_sermons_v_version_version_updated_at_idx" ON "_sermons_v" USING btree ("version_updated_at");
  CREATE INDEX "_sermons_v_version_version_created_at_idx" ON "_sermons_v" USING btree ("version_created_at");
  CREATE INDEX "_sermons_v_version_version__status_idx" ON "_sermons_v" USING btree ("version__status");
  CREATE INDEX "_sermons_v_created_at_idx" ON "_sermons_v" USING btree ("created_at");
  CREATE INDEX "_sermons_v_updated_at_idx" ON "_sermons_v" USING btree ("updated_at");
  CREATE INDEX "_sermons_v_latest_idx" ON "_sermons_v" USING btree ("latest");
  CREATE INDEX "ministries_image_idx" ON "ministries" USING btree ("image_id");
  CREATE UNIQUE INDEX "ministries_slug_idx" ON "ministries" USING btree ("slug");
  CREATE INDEX "ministries_updated_at_idx" ON "ministries" USING btree ("updated_at");
  CREATE INDEX "ministries_created_at_idx" ON "ministries" USING btree ("created_at");
  CREATE INDEX "ministries__status_idx" ON "ministries" USING btree ("_status");
  CREATE INDEX "_ministries_v_parent_idx" ON "_ministries_v" USING btree ("parent_id");
  CREATE INDEX "_ministries_v_version_version_image_idx" ON "_ministries_v" USING btree ("version_image_id");
  CREATE INDEX "_ministries_v_version_version_slug_idx" ON "_ministries_v" USING btree ("version_slug");
  CREATE INDEX "_ministries_v_version_version_updated_at_idx" ON "_ministries_v" USING btree ("version_updated_at");
  CREATE INDEX "_ministries_v_version_version_created_at_idx" ON "_ministries_v" USING btree ("version_created_at");
  CREATE INDEX "_ministries_v_version_version__status_idx" ON "_ministries_v" USING btree ("version__status");
  CREATE INDEX "_ministries_v_created_at_idx" ON "_ministries_v" USING btree ("created_at");
  CREATE INDEX "_ministries_v_updated_at_idx" ON "_ministries_v" USING btree ("updated_at");
  CREATE INDEX "_ministries_v_latest_idx" ON "_ministries_v" USING btree ("latest");
  CREATE INDEX "missions_updated_at_idx" ON "missions" USING btree ("updated_at");
  CREATE INDEX "missions_created_at_idx" ON "missions" USING btree ("created_at");
  CREATE INDEX "missions__status_idx" ON "missions" USING btree ("_status");
  CREATE INDEX "missions_rels_order_idx" ON "missions_rels" USING btree ("order");
  CREATE INDEX "missions_rels_parent_idx" ON "missions_rels" USING btree ("parent_id");
  CREATE INDEX "missions_rels_path_idx" ON "missions_rels" USING btree ("path");
  CREATE INDEX "missions_rels_media_id_idx" ON "missions_rels" USING btree ("media_id");
  CREATE INDEX "_missions_v_parent_idx" ON "_missions_v" USING btree ("parent_id");
  CREATE INDEX "_missions_v_version_version_updated_at_idx" ON "_missions_v" USING btree ("version_updated_at");
  CREATE INDEX "_missions_v_version_version_created_at_idx" ON "_missions_v" USING btree ("version_created_at");
  CREATE INDEX "_missions_v_version_version__status_idx" ON "_missions_v" USING btree ("version__status");
  CREATE INDEX "_missions_v_created_at_idx" ON "_missions_v" USING btree ("created_at");
  CREATE INDEX "_missions_v_updated_at_idx" ON "_missions_v" USING btree ("updated_at");
  CREATE INDEX "_missions_v_latest_idx" ON "_missions_v" USING btree ("latest");
  CREATE INDEX "_missions_v_rels_order_idx" ON "_missions_v_rels" USING btree ("order");
  CREATE INDEX "_missions_v_rels_parent_idx" ON "_missions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_missions_v_rels_path_idx" ON "_missions_v_rels" USING btree ("path");
  CREATE INDEX "_missions_v_rels_media_id_idx" ON "_missions_v_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "prayer_requests_updated_at_idx" ON "prayer_requests" USING btree ("updated_at");
  CREATE INDEX "prayer_requests_created_at_idx" ON "prayer_requests" USING btree ("created_at");
  CREATE INDEX "visit_plans_updated_at_idx" ON "visit_plans" USING btree ("updated_at");
  CREATE INDEX "visit_plans_created_at_idx" ON "visit_plans" USING btree ("created_at");
  CREATE INDEX "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "event_registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE INDEX "page_views_day_idx" ON "page_views" USING btree ("day");
  CREATE INDEX "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  CREATE UNIQUE INDEX "day_path_idx" ON "page_views" USING btree ("day","path");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_sermons_id_idx" ON "payload_locked_documents_rels" USING btree ("sermons_id");
  CREATE INDEX "payload_locked_documents_rels_ministries_id_idx" ON "payload_locked_documents_rels" USING btree ("ministries_id");
  CREATE INDEX "payload_locked_documents_rels_missions_id_idx" ON "payload_locked_documents_rels" USING btree ("missions_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_prayer_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_requests_id");
  CREATE INDEX "payload_locked_documents_rels_visit_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("visit_plans_id");
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_hero_lines_order_idx" ON "home_page_hero_lines" USING btree ("_order");
  CREATE INDEX "home_page_hero_lines_parent_id_idx" ON "home_page_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "home_page_welcome_cards_order_idx" ON "home_page_welcome_cards" USING btree ("_order");
  CREATE INDEX "home_page_welcome_cards_parent_id_idx" ON "home_page_welcome_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_welcome_cards_image_idx" ON "home_page_welcome_cards" USING btree ("image_id");
  CREATE INDEX "home_page_pillars_items_order_idx" ON "home_page_pillars_items" USING btree ("_order");
  CREATE INDEX "home_page_pillars_items_parent_id_idx" ON "home_page_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_missions_zones_order_idx" ON "home_page_missions_zones" USING btree ("_order");
  CREATE INDEX "home_page_missions_zones_parent_id_idx" ON "home_page_missions_zones" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_hero_hero_video_idx" ON "home_page" USING btree ("hero_video_id");
  CREATE INDEX "home_page_pillars_pillars_background_idx" ON "home_page" USING btree ("pillars_background_id");
  CREATE INDEX "home_page_prayer_prayer_image_idx" ON "home_page" USING btree ("prayer_image_id");
  CREATE INDEX "home_page_final_cta_final_cta_background_idx" ON "home_page" USING btree ("final_cta_background_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_media_id_idx" ON "home_page_rels" USING btree ("media_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "sermons" CASCADE;
  DROP TABLE "_sermons_v" CASCADE;
  DROP TABLE "ministries" CASCADE;
  DROP TABLE "_ministries_v" CASCADE;
  DROP TABLE "missions" CASCADE;
  DROP TABLE "missions_rels" CASCADE;
  DROP TABLE "_missions_v" CASCADE;
  DROP TABLE "_missions_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "prayer_requests" CASCADE;
  DROP TABLE "visit_plans" CASCADE;
  DROP TABLE "event_registrations" CASCADE;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "page_views" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_hero_lines" CASCADE;
  DROP TABLE "home_page_welcome_cards" CASCADE;
  DROP TABLE "home_page_pillars_items" CASCADE;
  DROP TABLE "home_page_missions_zones" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_sermons_status";
  DROP TYPE "public"."enum__sermons_v_version_status";
  DROP TYPE "public"."enum_ministries_icon";
  DROP TYPE "public"."enum_ministries_accent";
  DROP TYPE "public"."enum_ministries_status";
  DROP TYPE "public"."enum__ministries_v_version_icon";
  DROP TYPE "public"."enum__ministries_v_version_accent";
  DROP TYPE "public"."enum__ministries_v_version_status";
  DROP TYPE "public"."enum_missions_project_status";
  DROP TYPE "public"."enum_missions_status";
  DROP TYPE "public"."enum__missions_v_version_status";
  DROP TYPE "public"."enum_prayer_requests_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_home_page_welcome_cards_icon";
  DROP TYPE "public"."enum_home_page_pillars_items_icon";`)
}
