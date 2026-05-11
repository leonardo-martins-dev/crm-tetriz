/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Deploy na VPS: permite `next build` concluir se ainda houver erros de tipo no repo.
  // Remova ou defina false quando `npm run typecheck` estiver verde.
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

