-- CreateEnum
CREATE TYPE "version_status" AS ENUM ('DRAFT', 'PUBLISHED', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "version_source" AS ENUM ('IMPORT', 'CLONE', 'AI', 'EDITOR');

-- CreateEnum
CREATE TYPE "snapshot_kind" AS ENUM ('IMPORT', 'AI_DRAFT', 'PUBLISH_SNAPSHOT', 'TEST_SNAPSHOT');

-- CreateEnum
CREATE TYPE "legal_review" AS ENUM ('PENDING', 'APPROVED');

-- CreateEnum
CREATE TYPE "session_mode" AS ENUM ('NORMAL', 'TEST');

-- CreateEnum
CREATE TYPE "session_status" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "validation_status" AS ENUM ('QUEUED', 'RUNNING', 'PASSED', 'FAILED', 'ERROR');

-- CreateEnum
CREATE TYPE "job_status" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "effect_owner" AS ENUM ('NODE_ENTER', 'NODE_FIRST_ENTER', 'CHOICE', 'OBJECT', 'TRIGGER');

-- CreateEnum
CREATE TYPE "dialogue_owner" AS ENUM ('NODE', 'CHOICE');

-- CreateEnum
CREATE TYPE "transition_kind" AS ENUM ('NEXT', 'ROUTE', 'TRIGGER');

-- CreateEnum
CREATE TYPE "transition_target" AS ENUM ('NODE', 'STAY', 'RETURN', 'PUSH');

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL,
    "lawyer_name" TEXT,
    "office" TEXT,
    "city" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "user_id" UUID NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "rank_key" TEXT NOT NULL DEFAULT 'STAJYER',
    "closed_cases" INTEGER NOT NULL DEFAULT 0,
    "acquittals" INTEGER NOT NULL DEFAULT 0,
    "reduced" INTEGER NOT NULL DEFAULT 0,
    "convictions" INTEGER NOT NULL DEFAULT 0,
    "recharacterized" INTEGER NOT NULL DEFAULT 0,
    "other" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "active_session_id" UUID,
    "best_session_id" UUID,
    "best_outcome_key" TEXT,
    "best_outcome_class" TEXT,
    "best_final" INTEGER,
    "xp_credited" INTEGER NOT NULL DEFAULT 0,
    "completed_count" INTEGER NOT NULL DEFAULT 0,
    "last_played_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranks" (
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "short_label" TEXT NOT NULL,
    "min_xp" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "case_categories" (
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "case_categories_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "case_difficulties" (
    "level" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "case_difficulties_pkey" PRIMARY KEY ("level")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "category_key" TEXT NOT NULL DEFAULT 'CEZA',
    "difficulty_level" INTEGER NOT NULL DEFAULT 1,
    "required_rank_key" TEXT,
    "current_version_id" UUID,
    "archived_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_versions" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "version_no" INTEGER NOT NULL,
    "status" "version_status" NOT NULL DEFAULT 'DRAFT',
    "source" "version_source" NOT NULL,
    "title" TEXT NOT NULL,
    "crime_label" TEXT NOT NULL,
    "law_ref" TEXT NOT NULL,
    "demand_text" TEXT NOT NULL,
    "possible_sentence" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "category_key" TEXT NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "required_rank_key" TEXT,
    "summary" TEXT NOT NULL,
    "cover_character_key" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "package_hash" TEXT,
    "analysis" JSONB,
    "legal_review_status" "legal_review" NOT NULL DEFAULT 'PENDING',
    "legal_review_by" TEXT,
    "legal_review_at" TEXT,
    "published_at" TIMESTAMPTZ(3),
    "published_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "case_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "kind" "snapshot_kind" NOT NULL,
    "package" JSONB NOT NULL,
    "package_hash" TEXT NOT NULL,
    "engine_version" INTEGER NOT NULL,
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_variables" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "initial" JSONB NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "enum_values" JSONB,
    "visibility" TEXT NOT NULL,
    "analysis" TEXT,
    "display" JSONB,

    CONSTRAINT "story_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_conditions" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "condition" JSONB NOT NULL,

    CONSTRAINT "story_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_nodes" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "mode" TEXT,
    "title" TEXT,
    "eyebrow" TEXT,
    "chapter" TEXT,
    "background" TEXT,
    "hud" JSONB,
    "expose_counts" BOOLEAN,
    "scene_key" TEXT,
    "court_stage" TEXT,
    "config" JSONB NOT NULL,
    "editor_x" DOUBLE PRECISION,
    "editor_y" DOUBLE PRECISION,
    "empty_collections" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "story_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_choices" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "parent_id" UUID,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "prompt" TEXT,
    "group_key" TEXT,
    "tags" JSONB,
    "visible_when" JSONB,
    "enabled_when" JSONB,
    "locked_reason" TEXT,
    "cost" JSONB,
    "max_uses" INTEGER,
    "repeat" TEXT,
    "quality" JSONB,
    "feedback" JSONB,
    "match" JSONB,
    "fallback_for" TEXT,
    "confirm" TEXT,
    "role" TEXT,
    "empty_collections" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "story_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_transitions" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "kind" "transition_kind" NOT NULL,
    "from_node_id" UUID,
    "from_choice_id" UUID,
    "target" "transition_target",
    "to_node_key" TEXT,
    "condition" JSONB,
    "key" TEXT,
    "priority" INTEGER,
    "once" BOOLEAN,
    "empty_collections" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "story_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_effects" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "owner_type" "effect_owner" NOT NULL,
    "owner_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "story_effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_label" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "age" INTEGER,
    "occupation" TEXT,
    "bio" TEXT,
    "accent" TEXT NOT NULL,
    "sprite_key" TEXT NOT NULL,
    "notes" TEXT,
    "initially_known" BOOLEAN,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_sprites" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "rows" JSONB NOT NULL,
    "skin" TEXT,
    "no_eyes" BOOLEAN,
    "no_mouth" BOOLEAN,

    CONSTRAINT "character_sprites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_dialogues" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "owner_type" "dialogue_owner" NOT NULL,
    "owner_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "condition" JSONB,
    "lines" JSONB NOT NULL,

    CONSTRAINT "character_dialogues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_relationships" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "from_key" TEXT NOT NULL,
    "to_key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hidden" BOOLEAN,
    "reveal_when" JSONB,

    CONSTRAINT "character_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenes" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "touch_padding" INTEGER,
    "unlock_when" JSONB,

    CONSTRAINT "scenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_assets" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "asset_key" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "scene_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_objects" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "scene_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "marker" TEXT NOT NULL,
    "z" INTEGER,
    "active_when" JSONB,
    "feedback" JSONB NOT NULL,
    "badge" TEXT,
    "inspect_node_key" TEXT,
    "max_uses" INTEGER,
    "empty_collections" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "scene_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_hotspots" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "shape" TEXT NOT NULL,
    "geometry" JSONB NOT NULL,

    CONSTRAINT "scene_hotspots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source_label" TEXT NOT NULL,
    "tag_label" TEXT,
    "icon" TEXT NOT NULL,
    "side" TEXT,
    "strength" TEXT,
    "legal_validity" TEXT NOT NULL,
    "legal_note" TEXT,
    "presentable" BOOLEAN NOT NULL,
    "combinable" BOOLEAN NOT NULL,
    "counts_in_bag" BOOLEAN NOT NULL,
    "initially_known" BOOLEAN NOT NULL,
    "related_characters" JSONB,
    "related_events" JSONB,
    "tags" JSONB,
    "missed_hint" TEXT,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_relationships" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "from_key" TEXT NOT NULL,
    "to_key" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "evidence_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_discovery_conditions" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "evidence_key" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_key" TEXT,
    "requires" JSONB,
    "hint" TEXT,

    CONSTRAINT "evidence_discovery_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_sessions" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "court_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_stages" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "entry_node_key" TEXT NOT NULL,

    CONSTRAINT "court_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_choices" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "choice_id" UUID NOT NULL,
    "statement_key" TEXT,
    "evidence_keys" JSONB,
    "ground_key" TEXT,

    CONSTRAINT "court_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_outcomes" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "when" JSONB NOT NULL,
    "stamp" TEXT NOT NULL,
    "stamp_tone" TEXT NOT NULL,
    "header" TEXT,
    "sentence" TEXT NOT NULL,
    "verdict_text" TEXT NOT NULL,
    "reasoning" JSONB NOT NULL,
    "legal_basis" TEXT NOT NULL,
    "xp" JSONB NOT NULL,
    "how_to_reach" TEXT NOT NULL,
    "ethics_card" TEXT,

    CONSTRAINT "court_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimony_statements" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "visible_when" JSONB,
    "segments" JSONB NOT NULL,

    CONSTRAINT "testimony_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "snapshot_id" UUID NOT NULL,
    "mode" "session_mode" NOT NULL,
    "status" "session_status" NOT NULL DEFAULT 'ACTIVE',
    "state_version" INTEGER NOT NULL DEFAULT 0,
    "engine_version" INTEGER NOT NULL,
    "current_node_key" TEXT NOT NULL,
    "progress_label" TEXT,
    "outcome_key" TEXT,
    "outcome_class" TEXT,
    "final_score" INTEGER,
    "xp_earned" INTEGER,
    "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(3),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_states" (
    "session_id" UUID NOT NULL,
    "state" JSONB NOT NULL,
    "state_version" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "session_states_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "session_choices" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "seq" INTEGER NOT NULL,
    "client_action_id" UUID NOT NULL,
    "request_hash" TEXT NOT NULL,
    "action" JSONB NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_variables" (
    "session_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "session_variables_pkey" PRIMARY KEY ("session_id","key")
);

-- CreateTable
CREATE TABLE "discovered_evidence" (
    "session_id" UUID NOT NULL,
    "evidence_key" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "via" TEXT NOT NULL,
    "discovered_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discovered_evidence_pkey" PRIMARY KEY ("session_id","evidence_key")
);

-- CreateTable
CREATE TABLE "session_scores" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "seq" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "line_key" TEXT,
    "source_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_events" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "seq" INTEGER NOT NULL,
    "idx" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_generation_jobs" (
    "id" UUID NOT NULL,
    "status" "job_status" NOT NULL DEFAULT 'QUEUED',
    "params" JSONB NOT NULL,
    "case_id" UUID,
    "result_version_id" UUID,
    "usage" JSONB,
    "cost_cents" INTEGER,
    "error" TEXT,
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "content_generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_validation_results" (
    "id" UUID NOT NULL,
    "case_version_id" UUID NOT NULL,
    "status" "validation_status" NOT NULL DEFAULT 'QUEUED',
    "strict" BOOLEAN NOT NULL DEFAULT false,
    "package_hash" TEXT,
    "report" JSONB,
    "requested_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ(3),
    "finished_at" TIMESTAMPTZ(3),

    CONSTRAINT "content_validation_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "payload" JSONB,
    "request_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_case_id_key" ON "user_progress"("user_id", "case_id");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_sort_order_key" ON "ranks"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "cases_slug_key" ON "cases"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cases_number_key" ON "cases"("number");

-- CreateIndex
CREATE UNIQUE INDEX "cases_current_version_id_key" ON "cases"("current_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_versions_case_id_version_no_key" ON "case_versions"("case_id", "version_no");

-- CreateIndex
CREATE INDEX "assets_sha256_idx" ON "assets"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "assets_case_version_id_key_key" ON "assets"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "story_variables_case_version_id_key_key" ON "story_variables"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "story_conditions_case_version_id_key_key" ON "story_conditions"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "story_nodes_case_version_id_key_key" ON "story_nodes"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "story_choices_case_version_id_key_key" ON "story_choices"("case_version_id", "key");

-- CreateIndex
CREATE INDEX "story_transitions_from_node_id_idx" ON "story_transitions"("from_node_id");

-- CreateIndex
CREATE INDEX "story_transitions_from_choice_id_idx" ON "story_transitions"("from_choice_id");

-- CreateIndex
CREATE INDEX "story_effects_owner_type_owner_id_sort_order_idx" ON "story_effects"("owner_type", "owner_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "characters_case_version_id_key_key" ON "characters"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "character_sprites_case_version_id_key_key" ON "character_sprites"("case_version_id", "key");

-- CreateIndex
CREATE INDEX "character_dialogues_owner_type_owner_id_sort_order_idx" ON "character_dialogues"("owner_type", "owner_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "scenes_case_version_id_key_key" ON "scenes"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "scene_objects_case_version_id_key_key" ON "scene_objects"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_case_version_id_key_key" ON "evidence"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "court_sessions_case_version_id_key_key" ON "court_sessions"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "court_choices_choice_id_key" ON "court_choices"("choice_id");

-- CreateIndex
CREATE UNIQUE INDEX "court_outcomes_case_version_id_key_key" ON "court_outcomes"("case_version_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "testimony_statements_case_version_id_key_key" ON "testimony_statements"("case_version_id", "key");

-- CreateIndex
CREATE INDEX "game_sessions_user_id_case_id_idx" ON "game_sessions"("user_id", "case_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_choices_session_id_client_action_id_key" ON "session_choices"("session_id", "client_action_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_choices_session_id_seq_key" ON "session_choices"("session_id", "seq");

-- CreateIndex
CREATE INDEX "session_scores_session_id_idx" ON "session_scores"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_events_session_id_seq_idx_key" ON "session_events"("session_id", "seq", "idx");

-- CreateIndex
CREATE INDEX "content_validation_results_case_version_id_created_at_idx" ON "content_validation_results"("case_version_id", "created_at");

-- CreateIndex
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_rank_key_fkey" FOREIGN KEY ("rank_key") REFERENCES "ranks"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_category_key_fkey" FOREIGN KEY ("category_key") REFERENCES "case_categories"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_difficulty_level_fkey" FOREIGN KEY ("difficulty_level") REFERENCES "case_difficulties"("level") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_required_rank_key_fkey" FOREIGN KEY ("required_rank_key") REFERENCES "ranks"("key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "case_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_versions" ADD CONSTRAINT "case_versions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_versions" ADD CONSTRAINT "case_versions_published_by_id_fkey" FOREIGN KEY ("published_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_variables" ADD CONSTRAINT "story_variables_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_conditions" ADD CONSTRAINT "story_conditions_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_nodes" ADD CONSTRAINT "story_nodes_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_choices" ADD CONSTRAINT "story_choices_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_choices" ADD CONSTRAINT "story_choices_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "story_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_choices" ADD CONSTRAINT "story_choices_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "story_choices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_transitions" ADD CONSTRAINT "story_transitions_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_transitions" ADD CONSTRAINT "story_transitions_from_node_id_fkey" FOREIGN KEY ("from_node_id") REFERENCES "story_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_transitions" ADD CONSTRAINT "story_transitions_from_choice_id_fkey" FOREIGN KEY ("from_choice_id") REFERENCES "story_choices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_effects" ADD CONSTRAINT "story_effects_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_sprites" ADD CONSTRAINT "character_sprites_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_dialogues" ADD CONSTRAINT "character_dialogues_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenes" ADD CONSTRAINT "scenes_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_assets" ADD CONSTRAINT "scene_assets_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_assets" ADD CONSTRAINT "scene_assets_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_objects" ADD CONSTRAINT "scene_objects_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_objects" ADD CONSTRAINT "scene_objects_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_hotspots" ADD CONSTRAINT "scene_hotspots_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_hotspots" ADD CONSTRAINT "scene_hotspots_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "scene_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_relationships" ADD CONSTRAINT "evidence_relationships_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_discovery_conditions" ADD CONSTRAINT "evidence_discovery_conditions_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_sessions" ADD CONSTRAINT "court_sessions_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_stages" ADD CONSTRAINT "court_stages_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_stages" ADD CONSTRAINT "court_stages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "court_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_choices" ADD CONSTRAINT "court_choices_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_choices" ADD CONSTRAINT "court_choices_choice_id_fkey" FOREIGN KEY ("choice_id") REFERENCES "story_choices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_outcomes" ADD CONSTRAINT "court_outcomes_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimony_statements" ADD CONSTRAINT "testimony_statements_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimony_statements" ADD CONSTRAINT "testimony_statements_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "story_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "content_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_choices" ADD CONSTRAINT "session_choices_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_variables" ADD CONSTRAINT "session_variables_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovered_evidence" ADD CONSTRAINT "discovered_evidence_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_scores" ADD CONSTRAINT "session_scores_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_events" ADD CONSTRAINT "session_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_validation_results" ADD CONSTRAINT "content_validation_results_case_version_id_fkey" FOREIGN KEY ("case_version_id") REFERENCES "case_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Kullanıcı ve dava başına tek aktif NORMAL oturum (docs/plan.md §7).
CREATE UNIQUE INDEX "game_sessions_one_active" ON "game_sessions"("user_id", "case_id") WHERE "status" = 'ACTIVE' AND "mode" = 'NORMAL';

-- Referans verisi: rütbeler, kategoriler, zorluklar.
INSERT INTO "ranks" ("key", "label", "short_label", "min_xp", "sort_order") VALUES
  ('STAJYER', 'Stajyer Avukat', 'Stajyer', 0, 1),
  ('AVUKAT', 'Avukat', 'Avukat', 1000, 2),
  ('KIDEMLI', 'Kıdemli Avukat', 'Kıdemli', 3000, 3),
  ('ORTAK', 'Ortak Avukat', 'Ortak', 6000, 4);

INSERT INTO "case_categories" ("key", "label", "sort_order") VALUES ('CEZA', 'Ceza Hukuku', 1);

INSERT INTO "case_difficulties" ("level", "label") VALUES
  (1, 'Çok kolay'),
  (2, 'Kolay'),
  (3, 'Orta'),
  (4, 'Zor'),
  (5, 'Çok zor');
