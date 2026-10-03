import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

// Builds the color generator modules and the generate-color CLI as unbundled ESM.
// The CSS files ship as source and are bundled separately by scripts/build-css-bundle.ts.
const external = [
  ...Object.keys(pkg.dependencies),
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    target: 'es2022',
    lib: {
      entry: {
        'colors/colors': 'src/colors/colors.ts',
        'colors/generate-colors': 'src/colors/generate-colors.ts',
        'colors/generate-css': 'src/colors/generate-css.ts',
        'bin/generate-color': 'src/bin/generate-color.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        banner: (chunk) => (chunk.name === 'bin/generate-color' ? '#!/usr/bin/env node' : ''),
      },
    },
  },
})
