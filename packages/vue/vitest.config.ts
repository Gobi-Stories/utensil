import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { sourceAliases } from '../../scripts/source-aliases'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: sourceAliases },
  test: {
    name: '@gobistories/utensil-vue',
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [...configDefaults.exclude],
  },
})
