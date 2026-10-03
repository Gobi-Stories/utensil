import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/vue', 'apps/reference'],
  },
})
