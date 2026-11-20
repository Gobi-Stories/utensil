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
that leaves this machine: `npm publish` and `git push`. Never run those yourself. At each hand-off,
give the exact commands in a code block, say what to expect, and wait for the maintainer to say it's done before
going on. Keep each message to the current step.

Two values are filled into the commands below, so they paste as they are:

- `<registry>` — the registry URL in `publishConfig.registry` of `packages/vue/package.json`.
- `<account>` — the Google account the maintainer publishes with. Take it from your memory; if you don't have it,
  ask the maintainer and remember it. Never write it into the repository.

## 1. Check the starting point

```bash
git status --short && git branch --show-current
git fetch && git status -sb | head -1
git describe --tags --abbrev=0
```

- The tree must be clean and on `main`, level with `origin/main`. If `main` is ahead, the unpushed commits will be
  part of this release: list them and confirm. If it's behind, stop and ask the maintainer to pull.
- If `git fetch` fails for want of an SSH key, hand it over as `! git fetch`, which runs in the maintainer's shell.
- Check gcloud: `gcloud auth list` shows `<account>` among the credentialed accounts. It needn't be the active one:
  the active account may be a limited development service account that can't publish. If it's missing, hand over
  `gcloud auth login <account> --no-activate`, which stores the credentials and leaves the active account as it is.

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
maintainer before going on. Breaking comes from the `## Latest` section of `packages/vue/docs/BREAKING-CHANGES.md`:
check that every `Breaking:` commit since the last tag has an entry there, and every change to how something looks
an entry under its `### Visual changes`, and add any that is missing, committed before the release.

## 3. Run the release script

```bash
bun run release <patch | minor | major | x.y.z>
```

It bumps every workspace package and `bun.lock` to the new version, renames the `## Latest` section of
`packages/vue/docs/BREAKING-CHANGES.md` to the version (or adds the version's section, as "None.", when there is no
Latest), runs `./check` and `verify:package`, and packs both packages into `temp/release/`. It takes a few minutes. If it fails, stop, report the failure, and restore the
version bump with `git checkout -- .` once the maintainer agrees.

## 4. Review the tarballs

```bash
tar -xOzf temp/release/gobistories-utensil-vue-<v>.tgz package/package.json | grep -E '"(version|@gobistories/utensil-css|registry)"'
tar -tzf temp/release/gobistories-utensil-vue-<v>.tgz | grep -cE '^package/(dist|src|docs|skills)/'
tar -tzf temp/release/gobistories-utensil-vue-<v>.tgz | grep -c '\.test\.ts$'   # 0
tar -tzf temp/release/gobistories-utensil-css-<v>.tgz | head -20
```

Confirm both are at the new version, `@gobistories/utensil-vue` depends on exactly `@gobistories/utensil-css@<v>`,
both set `publishConfig.registry`, and the shipped folders are present (`dist`, `src`, `docs`, `skills` for
vue; no tests). Summarise the check to the maintainer.

## 5. Commit and tag

```bash
git commit -am "repo: release: <v>" && git tag v<v>
```

## 6. Hand over: publish

```bash
bun run release:publish <account>
```

- The script publishes `@gobistories/utensil-css`, waits 10 seconds, then publishes `@gobistories/utensil-vue`, which
  depends on it. It makes a short-lived token for `<account>` in `~/.npmrc` first, and removes it again however it
  ends: the registry rejects a request that carries an expired or revoked token instead of treating it as anonymous,
  so a token left there breaks every install from the registry on this machine once it expires.
- Expect `+ @gobistories/utensil-css@<v>`, the wait, `+ @gobistories/utensil-vue@<v>`, then `Removed the token.` and
  `Published ...`.
- It stops before publishing anything if no token was written, and reports a token it couldn't remove for the
  maintainer to delete by hand.

A 403 naming `artifactregistry.repositories.uploadArtifacts` means the token belongs to an account without write access
to the repository: check which account it was made for before anything else. The script skips a package already
published at the version, so after a failure the maintainer fixes the cause and runs it again. Wait for the maintainer
to confirm both are published.

## 7. Verify the publish

```bash
npm view @gobistories/utensil-css@<v> version --registry <registry>
npm view @gobistories/utensil-vue@<v> version dependencies --registry <registry>
```

Without `--registry`, npm asks npmjs, where the packages aren't published, and returns a 404. A 403 here means a
token for the registry is still in `~/.npmrc`: remove it with
`npm config delete <registry without https:>:_authToken --location=user`.

## 8. Hand over: push

```bash
git push && git push --tags
```

Utensil doesn't use GitHub releases: the tag is the release's record in git. Don't offer to create one.

## 9. Wrap up

Summarise: the version, what shipped (the release notes from step 2), and that consumers pick it up by bumping
`@gobistories/utensil-vue` and re-running skills-npm if the skills changed.

## If something goes wrong

- **Only `@gobistories/utensil-css` published.** Publish `@gobistories/utensil-vue` once the problem is fixed; the
  css release is harmless on its own.
- **A published version is broken.** Fix forward with a patch release. Don't delete the bad version: consumers whose
  lockfile records it would fail to install.
- **Committed and tagged, but nothing published.** Nothing has left the machine. The tag and commit can be fixed
  locally (`git tag -d v<v>`, then amend) before trying again.
