import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fa');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'viewer');
  CREATE TYPE "public"."enum_cars_transmission" AS ENUM('manual', 'automatic');
  CREATE TYPE "public"."enum_cars_fuel_type" AS ENUM('petrol', 'diesel', 'hybrid', 'electric');
  CREATE TYPE "public"."enum_cars_body_type" AS ENUM('sedan', 'suv', 'hatchback', 'coupe');
  CREATE TYPE "public"."enum_cars_origin" AS ENUM('imported', 'domestic');
  CREATE TYPE "public"."enum_cars_inspection_grade" AS ENUM('a-plus', 'a', 'b');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('test_drive', 'contact');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'closed');
  CREATE TYPE "public"."enum_test_drives_status" AS ENUM('new', 'contacted', 'completed', 'cancelled');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"_objectkey" varchar,
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
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
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
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"country" varchar,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cars_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "cars_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "cars_inspection_findings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"result" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "cars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_id" integer NOT NULL,
  	"slug" varchar NOT NULL,
  	"model" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"price" numeric NOT NULL,
  	"mileage" numeric DEFAULT 0,
  	"transmission" "enum_cars_transmission",
  	"fuel_type" "enum_cars_fuel_type",
  	"color" varchar,
  	"description" varchar,
  	"is_featured" boolean DEFAULT false,
  	"is_available" boolean DEFAULT true,
  	"body_type" "enum_cars_body_type",
  	"origin" "enum_cars_origin" DEFAULT 'imported',
  	"is_luxury" boolean DEFAULT false,
  	"inspection_grade" "enum_cars_inspection_grade",
  	"has_warranty" boolean DEFAULT false,
  	"installment_available" boolean DEFAULT false,
  	"specs_engine" varchar,
  	"specs_horsepower" numeric,
  	"specs_torque" varchar,
  	"specs_gearbox" varchar,
  	"specs_drivetrain" varchar,
  	"specs_acceleration" numeric,
  	"specs_top_speed" numeric,
  	"specs_interior_color" varchar,
  	"specs_vin" varchar,
  	"inspection_score" numeric,
  	"inspection_inspector" varchar,
  	"inspection_return_guarantee_days" numeric DEFAULT 7,
  	"inspection_pdf_id" integer,
  	"tour360_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"car_id" integer,
  	"type" "enum_inquiries_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"preferred_date" varchar,
  	"message" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "test_drives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"car_id" integer NOT NULL,
  	"status" "enum_test_drives_status" DEFAULT 'new',
  	"preferred_date" timestamp(3) with time zone,
  	"preferred_time" varchar,
  	"wants_call" boolean DEFAULT false,
  	"internal_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"users_id" integer,
  	"media_id" integer,
  	"brands_id" integer,
  	"cars_id" integer,
  	"inquiries_id" integer,
  	"test_drives_id" integer
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
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cars_images" ADD CONSTRAINT "cars_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cars_images" ADD CONSTRAINT "cars_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cars_options" ADD CONSTRAINT "cars_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cars_inspection_findings" ADD CONSTRAINT "cars_inspection_findings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cars" ADD CONSTRAINT "cars_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cars" ADD CONSTRAINT "cars_inspection_pdf_id_media_id_fk" FOREIGN KEY ("inspection_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "test_drives" ADD CONSTRAINT "test_drives_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cars_fk" FOREIGN KEY ("cars_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_test_drives_fk" FOREIGN KEY ("test_drives_id") REFERENCES "public"."test_drives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "cars_images_order_idx" ON "cars_images" USING btree ("_order");
  CREATE INDEX "cars_images_parent_id_idx" ON "cars_images" USING btree ("_parent_id");
  CREATE INDEX "cars_images_image_idx" ON "cars_images" USING btree ("image_id");
  CREATE INDEX "cars_options_order_idx" ON "cars_options" USING btree ("_order");
  CREATE INDEX "cars_options_parent_id_idx" ON "cars_options" USING btree ("_parent_id");
  CREATE INDEX "cars_inspection_findings_order_idx" ON "cars_inspection_findings" USING btree ("_order");
  CREATE INDEX "cars_inspection_findings_parent_id_idx" ON "cars_inspection_findings" USING btree ("_parent_id");
  CREATE INDEX "cars_brand_idx" ON "cars" USING btree ("brand_id");
  CREATE UNIQUE INDEX "cars_slug_idx" ON "cars" USING btree ("slug");
  CREATE INDEX "cars_year_idx" ON "cars" USING btree ("year");
  CREATE INDEX "cars_price_idx" ON "cars" USING btree ("price");
  CREATE INDEX "cars_is_available_idx" ON "cars" USING btree ("is_available");
  CREATE INDEX "cars_body_type_idx" ON "cars" USING btree ("body_type");
  CREATE INDEX "cars_origin_idx" ON "cars" USING btree ("origin");
  CREATE INDEX "cars_inspection_grade_idx" ON "cars" USING btree ("inspection_grade");
  CREATE INDEX "cars_has_warranty_idx" ON "cars" USING btree ("has_warranty");
  CREATE INDEX "cars_installment_available_idx" ON "cars" USING btree ("installment_available");
  CREATE INDEX "cars_inspection_inspection_pdf_idx" ON "cars" USING btree ("inspection_pdf_id");
  CREATE INDEX "cars_updated_at_idx" ON "cars" USING btree ("updated_at");
  CREATE INDEX "cars_created_at_idx" ON "cars" USING btree ("created_at");
  CREATE INDEX "inquiries_car_idx" ON "inquiries" USING btree ("car_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "test_drives_car_idx" ON "test_drives" USING btree ("car_id");
  CREATE INDEX "test_drives_updated_at_idx" ON "test_drives" USING btree ("updated_at");
  CREATE INDEX "test_drives_created_at_idx" ON "test_drives" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_cars_id_idx" ON "payload_locked_documents_rels" USING btree ("cars_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_test_drives_id_idx" ON "payload_locked_documents_rels" USING btree ("test_drives_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "cars_images" CASCADE;
  DROP TABLE "cars_options" CASCADE;
  DROP TABLE "cars_inspection_findings" CASCADE;
  DROP TABLE "cars" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "test_drives" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_cars_transmission";
  DROP TYPE "public"."enum_cars_fuel_type";
  DROP TYPE "public"."enum_cars_body_type";
  DROP TYPE "public"."enum_cars_origin";
  DROP TYPE "public"."enum_cars_inspection_grade";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_test_drives_status";`)
}
