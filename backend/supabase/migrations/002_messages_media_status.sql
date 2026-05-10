-- Colunas usadas pelo app/repositórios e pelas rotas Evolution, ausentes em 001_initial_schema.sql
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS media_url text,
  ADD COLUMN IF NOT EXISTS media_type text;

COMMENT ON COLUMN messages.status IS 'Ex.: sent, delivered, read, failed';
COMMENT ON COLUMN messages.media_url IS 'URL pública da mídia (ex.: Storage)';
COMMENT ON COLUMN messages.media_type IS 'MIME ou tipo lógico da mídia';
 