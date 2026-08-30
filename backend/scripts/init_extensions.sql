-- scripts/init_extensions.sql
-- Runs on first PostgreSQL container startup to enable required extensions.

CREATE EXTENSION IF NOT EXISTS vector;        -- pgvector
CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- Trigram similarity for entity resolution
CREATE EXTENSION IF NOT EXISTS unaccent;      -- Accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- UUID generation
