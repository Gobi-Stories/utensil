// Generates a Utensil color scale CSS file.
// Runs on Node (never bun): the paper math produces different hex rounding per JS engine,
// and generated scales are locked to Node's output.
//   utensil-generate-color <name> <hex> [options] > colors/<name>.css
import { generateColorCss, type ColorCssOptions } from '../colors/generate-css.js'
import { getPaperPageColors, type PaperOptions } from '../colors/generate-colors.js'

function usage(): never {
  console.error('Usage: utensil-generate-color <name> <baseColor> [options]')
  console.error('  name: The color scheme name')
  console.error('  baseColor: CSS hex color (e.g., #ff0000)')
  console.error('')
  console.error('Options:')
  console.error('  --paper <hex>     Theme paper color to anchor the pen/pencil scales to. Its page')
  console.error('                    colors (paper step 1 per mode) become the backgrounds the scales')
  console.error('                    are generated against. Omit for the default #fff/#111 pages.')
  console.error('  --tint <value>    Paper tint: a strength number (slider), auto, direct, or matched')
  console.error('  --step-contrast <n>  Paper step contrast: tone (CIELAB L*) difference between')
  console.error('                    adjacent paper steps, identical in both modes (default 1.75)')
  console.error('  --anchor <value>  Paper anchor: mode (default) or picked')
  console.error('')
  console.error('Example: vite-node generate-color.ts mint "#8fd5a6" --paper "#001c38" --tint 1.6 --step-contrast 1.75')
  process.exit(1)
}

const args = process.argv.slice(2)
const positional: string[] = []
const flags = new Map<string, string>()

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const value = args[i + 1]
    if (value === undefined) {
      console.error(`Error: ${args[i]} needs a value`)
      usage()
    }
    flags.set(args[i].slice(2), value)
    i++
  } else {
    positional.push(args[i])
  }
}

if (positional.length < 2) usage()

const [rawName, baseColor] = positional
const name = rawName.toLowerCase().replace(/[^a-z0-9-]/g, '')

if (!name) {
  console.error('Error: name must contain at least one alphanumeric character or hyphen')
  process.exit(1)
}

const hexColorRegex = /^#[0-9a-fA-F]{6}$/
if (!hexColorRegex.test(baseColor)) {
  console.error('Error: baseColor must be a valid hex color (e.g., #ff0000)')
  process.exit(1)
}

const paper: PaperOptions = {}

const tint = flags.get('tint')
if (tint !== undefined) {
  if (tint === 'auto' || tint === 'direct' || tint === 'matched') {
    paper.tint = tint
  } else if (!isNaN(parseFloat(tint))) {
    paper.tint = parseFloat(tint)
  } else {
    console.error('Error: --tint must be a number, auto, direct, or matched')
    process.exit(1)
  }
}

const stepContrast = flags.get('step-contrast')
if (stepContrast !== undefined) {
  const value = parseFloat(stepContrast)
  if (isNaN(value) || value < 0.25 || value > 4) {
    console.error('Error: --step-contrast must be a number between 0.25 and 4')
    process.exit(1)
  }
  paper.stepContrast = value
}

const anchor = flags.get('anchor')
if (anchor !== undefined) {
  if (anchor !== 'mode' && anchor !== 'picked') {
    console.error('Error: --anchor must be mode or picked')
    process.exit(1)
  }
  paper.anchor = anchor
}

const options: ColorCssOptions = { paper }

const paperHex = flags.get('paper')
if (paperHex !== undefined) {
  if (!hexColorRegex.test(paperHex)) {
    console.error('Error: --paper must be a valid hex color (e.g., #001c38)')
    process.exit(1)
  }
  options.backgrounds = getPaperPageColors(paperHex, paper)
}

try {
  const css = generateColorCss(name, baseColor, options)
  process.stdout.write(css)
} catch (error) {
  console.error('Error generating CSS:', error)
  process.exit(1)
}
