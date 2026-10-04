---
name: release
description: Walk the maintainer through releasing utensil-css and utensil-vue to npm, step by step
argument-hint: '[patch | minor | major | x.y.z]'
disable-model-invocation: true
---

# Release

Walk the maintainer through a release of `utensil-css` and `utensil-vue`. They share one version and are released
together. Invoking this skill is the maintainer's explicit request to release.

You do the local work: checks, the release script, review, the release commit and tag. The maintainer does everything
that leaves this machine: `npm publish`, `git push`, a GitHub release. Never run those yourself. At each hand-off,
give the exact commands in a code block, say what to expect, and wait for the maintainer to say it's done before
going on. Keep each message to the current step.

## 1. Check the starting point

```bash
git status --short && git branch --show-current
git fetch && git status -sb | head -1
git describe --tags --abbrev=0
```

- The tree must be clean and on `main`, level with `origin/main`. If `main` is ahead, the unpushed commits will be
  part of this release: list them and confirm. If it's behind, stop and ask the maintainer to pull.
- Check npm: `npm whoami` (logged in) and `npm --version`. If not logged in, hand over `npm login`.

## 2. Choose the version

List what has changed since the last release tag, in user-facing terms:

```bash
git log --oneline <last tag>..HEAD
```

Propose the bump from the changes, unless the argument already names one:

- **major** — anything breaking for consumers (`.claude/CLAUDE.md` → Consumer Compatibility): a removed or renamed
  module path, export, prop, event, slot, root class, cvar, or utensil-css class, layer or token.
- **minor** — new components, props, slots, exports, tokens or skills.
- **patch** — fixes, docs and skill text only.

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
tar -xOzf temp/release/utensil-vue-<v>.tgz package/package.json | grep -E '"(version|utensil-css)"'
tar -tzf temp/release/utensil-vue-<v>.tgz | grep -cE '^package/(dist|src|docs|skills)/'
tar -tzf temp/release/utensil-vue-<v>.tgz | grep -c '\.test\.ts$'   # 0
tar -tzf temp/release/utensil-css-<v>.tgz | head -20
```

Confirm both are at the new version, `utensil-vue` depends on exactly `utensil-css@<v>`, and the shipped folders are
present (`dist`, `src`, `docs`, `skills` for vue; no tests). Summarise the check to the maintainer.

## 5. Commit and tag

```bash
git commit -am "repo: release: <v>" && git tag v<v>
```

## 6. Hand over: publish to npm

`utensil-css` first: `utensil-vue` depends on it.

```bash
npm publish temp/release/utensil-css-<v>.tgz
npm publish temp/release/utensil-vue-<v>.tgz
```

Tell the maintainer to expect a two-factor confirmation for each publish (a browser prompt, or a one-time code, which
can also be passed as `--otp=<code>`). Wait for them to confirm both are published.

## 7. Verify the publish

```bash
npm view utensil-css@<v> version
npm view utensil-vue@<v> version dependencies
```

Right after publishing these can return 404 for a few minutes while the registry propagates. If so, tell the
maintainer, wait, and try again; a 404 is not a failure on its own.

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

Summarise: the version, what shipped, and that consumers pick it up by bumping `utensil-vue` and re-running
skills-npm if the skills changed.

## If something goes wrong

- **Only `utensil-css` published.** Publish `utensil-vue` once the problem is fixed; the css release is harmless on
  its own.
- **A published version is broken.** npm versions are immutable and can't be published again. Fix forward with a
  patch release, and have the maintainer mark the bad one:
  `npm deprecate utensil-vue@<v> "Broken release, use <next>"` (and the same for `utensil-css` if needed).
- **Committed and tagged, but nothing published.** Nothing has left the machine. The tag and commit can be fixed
  locally (`git tag -d v<v>`, then amend) before trying again.
