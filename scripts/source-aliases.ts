// Workspace-only resolution of the Utensil packages to their source, for dev servers and tests.
// Published packages resolve through their package.json exports to dist/ instead.
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

export const sourceAliases = [
  { find: /^utensil-css\/(.*)$/, replacement: `${root}packages/css/src/$1` },
  { find: /^utensil-vue\/(.*)$/, replacement: `${root}packages/vue/src/$1` },
]
