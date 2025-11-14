CREATE TABLE IF NOT EXISTS "tenants" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar(96) NOT NULL,
    "name" varchar(255) NOT NULL,
    "status" varchar(32) DEFAULT 'active' NOT NULL,
    "default_locale" varchar(8) DEFAULT 'en' NOT NULL,
    "plan" varchar(64) DEFAULT 'free' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenants_slug_unique" ON "tenants" ("slug");

CREATE TABLE IF NOT EXISTS "tenant_domains" (
    "id" serial PRIMARY KEY NOT NULL,
    "tenant_id" integer NOT NULL,
    "domain" varchar(255) NOT NULL,
    "provider" varchar(32) DEFAULT 'custom' NOT NULL,
    "verified_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "tenant_domains_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade ON UPDATE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenant_domains_domain_unique" ON "tenant_domains" ("domain");

CREATE TABLE IF NOT EXISTS "tenant_members" (
    "id" serial PRIMARY KEY NOT NULL,
    "tenant_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "role" varchar(32) DEFAULT 'member' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "tenant_members_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade ON UPDATE no action,
    CONSTRAINT "tenant_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenant_members_unique" ON "tenant_members" ("tenant_id", "user_id");
