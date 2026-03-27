import { defineConfig } from 'vite'
import vinext from 'vinext'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': rootDir,
      '@/': `${rootDir}/`,
    },
  },
  plugins: [vinext()],
})
