import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // Utensil's compiled components import their CSS: let Vite process the package
    server: { deps: { inline: ['utensil-vue'] } },
  },
})
