/** PM2: Next.js em producao — NUNCA use `serve dist` (gera "Index of dist/"). */
module.exports = {
  apps: [
    {
      name: "crm-frontend",
      cwd: "/srv/apps/crm",
      script: "npm",
      args: "run start -- -p 4540",
      interpreter: "none",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
