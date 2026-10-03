// Copies the docs each shipped skill reads into skills/<name>/references/, so every skill is
// self-contained wherever it is installed. Source links in the docs are rewritten to resolve from
// a consumer project's root. Run from packages/vue as part of the build.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const skillsDir = 'skills'
const docsDir = 'docs'

const references: Record<string, string[]> = {
  'utensil-usage': ['USAGE.md', 'SETUP.md'],
  'utensil-find-components': ['COMPONENTS.md'],
  'utensil-implement-component': ['DEVELOPMENT.md', 'USAGE.md', 'audit-checklist.md'],
  'utensil-document-component-api': ['DEVELOPMENT.md'],
  'utensil-audit-component': ['audit-checklist.md', 'DEVELOPMENT.md', 'USAGE.md'],
  'utensil-setup-theme': ['SETUP.md', 'USAGE.md'],
}

const consumerSource = 'node_modules/utensil-vue/src/'

function toConsumerPaths(markdown: string): string {
  return markdown.replaceAll('](../src/', `](${consumerSource}`).replaceAll('`../src/', `\`${consumerSource}`)
}

function frontmatter(markdown: string): Record<string, string> {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(markdown)
  if (!match) return {}
  return Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => /^([\w-]+):\s*(.*)$/.exec(line))
      .filter((field) => field !== null)
      .map((field) => [field[1], field[2].trim()]),
  )
}

const errors: string[] = []
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
let copied = 0

for (const skill of skills) {
  const skillFile = join(skillsDir, skill, 'SKILL.md')
  if (!existsSync(skillFile)) {
    errors.push(`${skill}: missing SKILL.md`)
    continue
  }

  const markdown = readFileSync(skillFile, 'utf8')
  const fields = frontmatter(markdown)
  if (fields.name !== skill) errors.push(`${skill}: frontmatter name "${fields.name ?? ''}" must match its directory`)
  if (!fields.description) errors.push(`${skill}: frontmatter description is empty`)

  const docs = references[skill]
  if (!docs) {
    errors.push(`${skill}: no references mapping in scripts/build-skills.ts`)
    continue
  }

  const target = join(skillsDir, skill, 'references')
  rmSync(target, { recursive: true, force: true })
  mkdirSync(target, { recursive: true })
  for (const doc of docs) {
    const source = join(docsDir, doc)
    if (!existsSync(source)) {
      errors.push(`${skill}: docs/${doc} does not exist`)
      continue
    }
    writeFileSync(join(target, doc), toConsumerPaths(readFileSync(source, 'utf8')))
    copied++
  }

  for (const [, referenced] of markdown.matchAll(/references\/([\w.-]+\.md)/g)) {
    if (!existsSync(join(target, referenced)))
      errors.push(`${skill}: SKILL.md reads references/${referenced}, not copied`)
  }
}

for (const skill of Object.keys(references)) {
  if (!skills.includes(skill)) errors.push(`${skill}: mapped in scripts/build-skills.ts but has no skill directory`)
}

if (errors.length) {
  console.error(`Skill build failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`)
  process.exit(1)
}

console.log(`skills: ${skills.length} skills, ${copied} reference docs copied`)
