// Prepares a release of @gobistories/utensil-css and @gobistories/utensil-vue, which are versioned in lockstep.
//
//   bun scripts/release.ts <patch | minor | major | x.y.z> [--dry]
//
// Bumps every workspace package to the new version, gives the Latest section of the breaking changes
// (packages/vue/docs/BREAKING-CHANGES.md) the version's name, runs ./check and the package verification,
// then packs both packages into temp/release/. Publishing is a separate step, run once the tarballs have been reviewed
// and the release committed and tagged: bun run release:publish <account> (scripts/publish.ts).

import { $ } from 'bun'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const manifests = [
  'package.json',
  'packages/css/package.json',
  'packages/vue/package.json',
  'apps/reference/package.json',
]

const [bump, ...flags] = process.argv.slice(2)
const dry = flags.includes('--dry')

function nextVersion(current: string, requested: string): string {
  if (/^\d+\.\d+\.\d+$/.test(requested)) {
    return requested
  }
  const [major, minor, patch] = current.split('.').map(Number)
  switch (requested) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      throw new Error(`Unknown version bump "${requested}". Use patch, minor, major or an x.y.z version.`)
  }
}

if (!bump) {
  console.error('Usage: bun scripts/release.ts <patch | minor | major | x.y.z> [--dry]')
  process.exit(1)
}

const status = await $`git status --porcelain`.cwd(root).quiet()
if (status.stdout.toString().trim() && !dry) {
  console.error('The working tree has uncommitted changes. Commit or stash them before releasing.')
  process.exit(1)
}

const current = JSON.parse(readFileSync(join(root, 'packages/css/package.json'), 'utf8')).version as string
const version = nextVersion(current, bump)
console.log(`Releasing ${current} → ${version}${dry ? ' (dry run)' : ''}`)

if (!dry) {
  for (const manifest of manifests) {
    const path = join(root, manifest)
    const pkg = JSON.parse(readFileSync(path, 'utf8'))
    pkg.version = version
    writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`)
  }
  // bun pm pack fills @gobistories/utensil-vue's workspace:* dependency on @gobistories/utensil-css from the
  // version bun.lock records for the workspace, and bun install does not refresh it, so set it here.
  const lockPath = join(root, 'bun.lock')
  const lock = readFileSync(lockPath, 'utf8').replace(
    /("name": "(?:@gobistories\/utensil-(?:css|vue)|utensil-reference)",\s*"version": ")[^"]+"/g,
    `$1${version}"`,
  )
  writeFileSync(lockPath, lock)
  await $`bun install`.cwd(root)

  // The breaking changes since the last release, under Latest, become this release's section. A release with none
  // still gets one, so every version has a section.
  const breakingPath = join(root, 'packages/vue/docs/BREAKING-CHANGES.md')
  const breaking = readFileSync(breakingPath, 'utf8')
  writeFileSync(
    breakingPath,
    breaking.includes('\n## Latest\n')
      ? breaking.replace('\n## Latest\n', `\n## ${version}\n`)
      : breaking.replace('\n## ', `\n## ${version}\n\nNone.\n\n## `),
  )
}

await $`./check`.cwd(root)
await $`bun scripts/verify-package.ts`.cwd(root)

const out = join(root, 'temp', 'release')
mkdirSync(out, { recursive: true })
for (const pkg of ['css', 'vue']) {
  await $`bun pm pack --destination ${out}`.cwd(join(root, 'packages', pkg))
}

console.log(`
Packed @gobistories/utensil-css@${version} and @gobistories/utensil-vue@${version} into temp/release/.

Next steps:
  git commit -am "repo: release: ${version}" && git tag v${version}
  bun run release:publish <account>
  git push && git push --tags
`)
