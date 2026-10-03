// Concatenates the core CSS into dist/utensil.css (and a minified copy) for plain HTML / CDN use.
// The order matches utensil-vue's CSS include: the layer order must come first.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { transform } from 'esbuild'

const files = [
  'src/utensil-layers.css',
  'src/theme/colors/gray.css',
  'src/theme/utensil-theme.css',
  'src/utensil-reset.css',
  'src/theme/text-themes.css',
  'src/utensil-utilities.css',
]

const css = files.map((f) => `/* ${f.replace(/^src\//, '')} */\n${readFileSync(f, 'utf8')}`).join('\n')
const { code: minified } = await transform(css, { loader: 'css', minify: true })

mkdirSync('dist', { recursive: true })
writeFileSync('dist/utensil.css', css)
writeFileSync('dist/utensil.min.css', minified)
console.log(`utensil.css ${(css.length / 1024).toFixed(1)} kB, utensil.min.css ${(minified.length / 1024).toFixed(1)} kB`)
