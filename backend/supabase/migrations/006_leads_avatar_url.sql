-- Foto de perfil sincronizada da Evolution / WhatsApp
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS avatar_url text;

COMMENT ON COLUMN leads.avatar_url IS 'URL da foto de perfil do contato (ex.: WhatsApp)';
