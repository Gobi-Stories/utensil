import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { sourceAliases } from '../../scripts/source-aliases'

export default defineConfig({
  plugins: [vue()],
  test: {
    name: 'utensil-reference',
    environment: 'jsdom',
    exclude: [...configDefaults.exclude],
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }, ...sourceAliases],
  },
})
