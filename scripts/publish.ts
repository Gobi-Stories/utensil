// Publishes the release that scripts/release.ts packed into temp/release/: @gobistories/utensil-css, then, 10s later,
// @gobistories/utensil-vue, which depends on it.
//
//   bun scripts/publish.ts <account>
//
// <account> is a Google account with write access to the registry, credentialed in gcloud (it needn't be the active
// account). The script makes a short-lived token for it in ~/.npmrc and always removes it again, published or not: the
// registry rejects a request carrying an expired token rather than treating it as anonymous. A package already
// published at the version is skipped, so the script can be run again after a failure.

import { $ } from 'bun'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const packages = ['css', 'vue'] as const
const waitBetween = 10_000

const [account] = process.argv.slice(2)
if (!account) {
  console.error('Usage: bun scripts/publish.ts <account>')
  process.exit(1)
}

const version = JSON.parse(readFileSync(join(root, 'packages/css/package.json'), 'utf8')).version as string
const registry = JSON.parse(readFileSync(join(root, 'packages/vue/package.json'), 'utf8')).publishConfig
  .registry as string
const registryToken = `${registry.replace(/^https:/, '')}:_authToken`
const tarball = (pkg: string) => join(root, 'temp', 'release', `gobistories-utensil-${pkg}-${version}.tgz`)

for (const pkg of packages) {
  if (!existsSync(tarball(pkg))) {
    console.error(`${tarball(pkg)} is missing. Run bun run release first.`)
    process.exit(1)
  }
}

const tag = await $`git tag --list v${version}`.cwd(root).quiet()
if (!tag.stdout.toString().trim()) {
  console.error(`There is no v${version} tag. Commit and tag the release before publishing it.`)
  process.exit(1)
}

async function isPublished(pkg: string): Promise<boolean> {
  const view = await $`npm view @gobistories/utensil-${pkg}@${version} version --registry ${registry}`
    .cwd(root)
    .quiet()
    .nothrow()
  return view.exitCode === 0 && view.stdout.toString().trim() === version
}

console.log(`Publishing @gobistories/utensil-css and @gobistories/utensil-vue ${version} as ${account}`)

// The tool makes tokens only for the registries its repo config names, and prefers Application Default Credentials
// over the account picked for this command
const configDir = mkdtempSync(join(tmpdir(), 'utensil-publish-'))
const repoConfig = join(configDir, '.npmrc')
writeFileSync(repoConfig, `@gobistories:registry=${registry}\n`)
const authEnv: Record<string, string | undefined> = { ...process.env, CLOUDSDK_CORE_ACCOUNT: account }
delete authEnv.GOOGLE_APPLICATION_CREDENTIALS

let failed = false
try {
  await $`npx google-artifactregistry-auth --repo-config=${repoConfig} --credential-config=${join(homedir(), '.npmrc')}`
    .cwd(root)
    .env(authEnv)

  const npmrc = readFileSync(join(homedir(), '.npmrc'), 'utf8')
  if (!npmrc.includes(registryToken)) {
    throw new Error('No token for the registry was written to ~/.npmrc, so nothing was published.')
  }

  for (const [index, pkg] of packages.entries()) {
    if (await isPublished(pkg)) {
      console.log(`@gobistories/utensil-${pkg}@${version} is already published, skipping it.`)
      continue
    }
    if (index > 0) {
      console.log(`Waiting ${waitBetween / 1000}s before publishing @gobistories/utensil-${pkg}...`)
      await Bun.sleep(waitBetween)
    }
    await $`npm publish ${tarball(pkg)}`.cwd(root)
  }
} catch (error) {
  failed = true
  console.error(error instanceof Error ? error.message : error)
} finally {
  await $`npm config delete ${registryToken} --location=user`.cwd(root).quiet().nothrow()
  rmSync(configDir, { recursive: true, force: true })
  const left = readFileSync(join(homedir(), '.npmrc'), 'utf8').includes(registryToken)
  console.log(left ? `The token is still in ~/.npmrc: remove ${registryToken} by hand.` : 'Removed the token.')
}

if (failed) {
  console.error('\nPublishing failed. Fix the cause and run the script again: published packages are skipped.')
  process.exit(1)
}

console.log(`
Published @gobistories/utensil-css@${version} and @gobistories/utensil-vue@${version}.

Next: git push && git push --tags`)
