-- Campos Evolution usados pelo app / SupabaseConnectionRepository (PATCH ao associar instância)
ALTER TABLE connections ADD COLUMN IF NOT EXISTS instance_name text;
ALTER TABLE connections ADD COLUMN IF NOT EXISTS instance_id text;
ALTER TABLE connections ADD COLUMN IF NOT EXISTS evolution_api_key text;

CREATE INDEX IF NOT EXISTS idx_connections_instance_name ON connections(instance_name)
  WHERE instance_name IS NOT NULL;
