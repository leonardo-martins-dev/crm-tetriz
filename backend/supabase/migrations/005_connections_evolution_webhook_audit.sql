-- URL efetiva registrada na Evolution + último sync (auditoria; rota única para todos os tenants)
ALTER TABLE connections ADD COLUMN IF NOT EXISTS evolution_webhook_url text;
ALTER TABLE connections ADD COLUMN IF NOT EXISTS evolution_webhook_synced_at timestamptz;
