import { readFileSync } from 'fs'
import { createRequire } from 'module'
import { describe, it, expect } from 'vitest'
import { generateColorCss } from 'utensil-vue/colors/generate-css'

// The committed color files are the generator's recorded output: regenerating each one
// from the source color in its header must reproduce its declarations exactly.
// Read with fs — vitest stubs CSS imports, ?raw included.

function readCss(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf-8')
}

const grayCss = readFileSync(createRequire(import.meta.url).resolve('utensil-css/theme/colors/gray.css'), 'utf-8')

const referenceColors = [
  { name: 'blue', css: readCss('./blue.css') },
  { name: 'green', css: readCss('./green.css') },
  { name: 'grey', css: readCss('./grey.css') },
  { name: 'orange', css: readCss('./orange.css') },
  { name: 'pink', css: readCss('./pink.css') },
  { name: 'red', css: readCss('./red.css') },
  { name: 'gray', css: grayCss },
]

function sourceColor(css: string): string {
  const match = css.match(/\* color: (#[0-9a-fA-F]{6})/)
  if (!match) throw new Error('No source color in the file header')
  return match[1]
}

// The ordered custom-property declarations for the given instruments. Variable names
// repeat across the light/dark/P3 blocks, so declarations are compared as an ordered
// sequence rather than by name.
function declarations(css: string, name: string, instruments: string): string[] {
  const pattern = new RegExp(`--${name}-(?:${instruments})-[a-z0-9]+: [^;]+;`, 'g')
  return css.match(pattern) ?? []
}

describe('color generation', () => {
  for (const { name, css } of referenceColors) {
    it(`reproduces the committed ${name} pen and pencil scales`, () => {
      const committed = declarations(css, name, 'pen|pencil')
      expect(committed.length).toBeGreaterThan(150)

      const regenerated = generateColorCss(name, sourceColor(css))
      expect(declarations(regenerated, name, 'pen|pencil')).toEqual(committed)
    })
  }

  it('reproduces the committed gray paper scale', () => {
    const committed = declarations(grayCss, 'gray', 'paper')
    expect(committed.length).toBeGreaterThan(50)

    const regenerated = generateColorCss('gray', sourceColor(grayCss))
    expect(declarations(regenerated, 'gray', 'paper')).toEqual(committed)
  })
})
