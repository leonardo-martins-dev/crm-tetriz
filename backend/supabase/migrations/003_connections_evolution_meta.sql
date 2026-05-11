-- Metadados Evolution (owner JID / nome do perfil) para deduplicação e UI
ALTER TABLE connections ADD COLUMN IF NOT EXISTS evolution_owner_jid text;
ALTER TABLE connections ADD COLUMN IF NOT EXISTS evolution_profile_name text;
