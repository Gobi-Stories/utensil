import { globSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { sourceAliases } from '../../scripts/source-aliases'

// Every public module is its own entry and keeps its own file (preserveModules), so consumers'
// bundlers drop whatever they don't import. Each compiled component imports only its own CSS.
const sources = globSync('src/**/*.{ts,vue}', {
  exclude: (path) => /\.test\.ts$|\.d\.ts$/.test(path),
})

const entry = Object.fromEntries(
  sources.map((file) => [file.replace(/^src\//, '').replace(/\.ts$/, ''), file]),
)

// @gobistories/utensil-css stays external, except `?inline` CSS imports, which are inlined as strings at build
// time so utensil-css-inline works with any bundler.
const external = [/^vue$/, /^@vue\//, /^@fortawesome\//, /^@gobistories\/utensil-css(\/[^?]*)?$/]

export default defineConfig({
  plugins: [vue(), libInjectCss()],
  resolve: { alias: sourceAliases },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    target: 'es2022',
    cssCodeSplit: true,
    lib: { entry, formats: ['es'] },
    rollupOptions: {
      external: (id) => external.some((re) => re.test(id)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Inlined @gobistories/utensil-css strings sit outside src; keep them together under _inline/.
        entryFileNames: (chunk) => chunk.name.replace(/^css\/src\//, '_inline/') + '.js',
        chunkFileNames: '_chunks/[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
