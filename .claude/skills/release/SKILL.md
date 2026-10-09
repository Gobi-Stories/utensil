---
name: release
description: Walk the maintainer through releasing @gobistories/utensil-css and @gobistories/utensil-vue to Utensil's registry, step by step
argument-hint: '[patch | minor | major | x.y.z]'
disable-model-invocation: true
---

# Release

Walk the maintainer through a release of `@gobistories/utensil-css` and `@gobistories/utensil-vue`. They share one
version and are released together, to Utensil's npm repository in Google Artifact Registry (`DEVELOPMENT.md` →
Releasing). Invoking this skill is the maintainer's explicit request to release.

You do the local work: checks, the release script, review, the release commit and tag. The maintainer does everything
that leaves this machine: `npm publish`, `git push`, a GitHub release. Never run those yourself. At each hand-off,
give the exact commands in a code block, say what to expect, and wait for the maintainer to say it's done before
going on. Keep each message to the current step.

The registry, used below as `<registry>`, is `https://europe-west1-npm.pkg.dev/gobi-tron-production/npm/`.

## 1. Check the starting point

```bash
git status --short && git branch --show-current
git fetch && git status -sb | head -1
git describe --tags --abbrev=0
```

- The tree must be clean and on `main`, level with `origin/main`. If `main` is ahead, the unpushed commits will be
  part of this release: list them and confirm. If it's behind, stop and ask the maintainer to pull.
- If `git fetch` fails for want of an SSH key, hand it over as `! git fetch`, which runs in the maintainer's shell.
- Check gcloud: `gcloud config get-value account` names the maintainer's Google account. If it's empty, hand over
  `gcloud auth login`.

## 2. Choose the version

List what has changed since the last release tag, in user-facing terms:

```bash
git log --oneline <last tag>..HEAD
```

Propose the bump from the changes, unless the argument already names one. What a breaking change is: anything that
breaks a consumer (`.claude/CLAUDE.md` → Consumer Compatibility), such as a removed or renamed module path, export,
prop, event, slot, root class, cvar, or `@gobistories/utensil-css` class, layer or token.

Below 1.0.0, while Utensil is closed:

- **minor** — anything breaking.
- **patch** — everything else: new components, props, slots, exports, tokens or skills, fixes, docs and skill text.

From 1.0.0, once Utensil is open source:

- **major** — anything breaking.
- **minor** — new components, props, slots, exports, tokens or skills.
- **patch** — fixes, docs and skill text only.

Never propose 1.0.0 yourself: it marks the open sourcing, and is the maintainer's call.

Draft short release notes grouped as Breaking, Added, Fixed and Docs/skills, and confirm the version with the
maintainer before going on.

## 3. Run the release script

```bash
bun run release <patch | minor | major | x.y.z>
```

It bumps every workspace package and `bun.lock` to the new version, runs `./check` and `verify:package`, and packs
both packages into `temp/release/`. It takes a few minutes. If it fails, stop, report the failure, and restore the
version bump with `git checkout -- .` once the maintainer agrees.

## 4. Review the tarballs

```bash
tar -xOzf temp/release/gobistories-utensil-vue-<v>.tgz package/package.json | grep -E '"(version|@gobistories/utensil-css|registry)"'
tar -tzf temp/release/gobistories-utensil-vue-<v>.tgz | grep -cE '^package/(dist|src|docs|skills)/'
tar -tzf temp/release/gobistories-utensil-vue-<v>.tgz | grep -c '\.test\.ts$'   # 0
tar -tzf temp/release/gobistories-utensil-css-<v>.tgz | head -20
```

Confirm both are at the new version, `@gobistories/utensil-vue` depends on exactly `@gobistories/utensil-css@<v>`,
`publishConfig.registry` is `<registry>`, and the shipped folders are present (`dist`, `src`, `docs`, `skills` for
vue; no tests). Summarise the check to the maintainer.

## 5. Commit and tag

```bash
git commit -am "repo: release: <v>" && git tag v<v>
```

## 6. Hand over: publish

`@gobistories/utensil-css` first: `@gobistories/utensil-vue` depends on it.

```bash
env -u GOOGLE_APPLICATION_CREDENTIALS npx google-artifactregistry-auth
npm publish temp/release/gobistories-utensil-css-<v>.tgz
npm publish temp/release/gobistories-utensil-vue-<v>.tgz
```

The first command writes a short-lived token for the maintainer's Google account to `~/.npmrc`; it expires after about
an hour, so run it right before publishing. It runs without `GOOGLE_APPLICATION_CREDENTIALS` because the tool prefers
that variable's service account over the gcloud login. Each publish should end with
`+ @gobistories/utensil-<css|vue>@<v>`, and `publishConfig` sends it to `<registry>`.

A 403 naming `artifactregistry.repositories.uploadArtifacts` means the token belongs to an account without write access
to the repository: check which account the token was made for before anything else. Don't retry a publish that
succeeded: the registry refuses a version that is already published. Wait for the maintainer to confirm both are
published.

## 7. Verify the publish

```bash
npm view @gobistories/utensil-css@<v> version --registry <registry>
npm view @gobistories/utensil-vue@<v> version dependencies --registry <registry>
```

Without `--registry`, npm asks npmjs, where the packages aren't published, and returns a 404.

## 8. Hand over: push

```bash
git push && git push --tags
```

Optionally, a GitHub release from the tag with the notes from step 2:

```bash
gh release create v<v> --title "v<v>" --notes-file <notes file>
```

Offer to write the notes file (in `temp/`, which is gitignored).

## 9. Wrap up

Summarise: the version, what shipped, and that consumers pick it up by bumping `@gobistories/utensil-vue` and
re-running skills-npm if the skills changed.

## If something goes wrong

- **Only `@gobistories/utensil-css` published.** Publish `@gobistories/utensil-vue` once the problem is fixed; the
  css release is harmless on its own.
- **A published version is broken.** Fix forward with a patch release. Don't delete the bad version: consumers whose
  lockfile records it would fail to install.
- **Committed and tagged, but nothing published.** Nothing has left the machine. The tag and commit can be fixed
  locally (`git tag -d v<v>`, then amend) before trying again.
