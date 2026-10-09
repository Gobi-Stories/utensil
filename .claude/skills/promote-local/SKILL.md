---
name: promote-local
description: Promote a consumer project's local Utensil work (new components, wrappers, vendored fixes) into utensil-vue
argument-hint: <path> [ComponentOrComposable ...]
---

# Promote Local Utensil Work

A consumer that needs something Utensil doesn't have yet doesn't wait for a release: it builds it in a local folder of
its own, written as Utensil code. Promoting brings that work into `utensil-vue`, so that once it's released the
consumer switches its imports to `utensil-vue/...` and deletes its local copies.

The consumer doesn't take the release automatically. Its local copies keep working until it chooses to upgrade, and
when it does it updates its package, its local folder and its own code that uses them, adapting that code to any
change the promotion made. An import-only switch is the most convenient upgrade, so prefer it where it costs nothing,
but never at the expense of a change the component needs: a fix, an audit finding, consistency with the rest of
Utensil, or completing it for general use. Make the change and list what the consumer rewrites in the report.

First confirm the answers to these questions:
@../../QUESTIONS.md

## Arguments

- `path`: the consumer's local Utensil folder, often `src/lib/utensil-local` in the consumer project. Use the path
  given; never assume the folder's name or location.
- Names (optional): the components or composables to promote, in any form that identifies one: `UtensilButton`,
  `Button`, its folder `button`, `use-focus-home`, `useFocusHome`. Omitted, promote everything in the folder.

The folder is read-only: never change, move or delete anything in it. The consumer removes its local copies itself,
once a release includes them.

## The Local Folder

It is usually organised by kind, each mirroring Utensil's layout (`<kind>/<feature>/Utensil<Name>.vue`, composables
as `use-<name>.ts`):

| Folder        | Holds                                                                                                                                                                             | Promotes as                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `components/` | New components and composables                                                                                                                                                    | A new component or composable at the mirrored path        |
| `wrappers/`   | A wrapper with the name of the Utensil component or composable it wraps, importing the original aliased (`BaseUtensilButton`) and adding props, slots, slot scope or context      | The additions, made in the component or composable itself |
| `fixed/`      | A vendored copy, changed: a fix, or an addition a wrapper couldn't reach. A header comment names the `utensil-vue` version it was copied from (`Vendored from utensil-vue 1.0.2`) | The changes, made in the current component or composable  |

Classify each item by what its code shows, not only by where it sits. An item is a component or composable's folder
(`components/box/`, `fixed/deck/`): the component or composable, its test and `<Name>Doc.vue`, and every other file
beside them. A family (a parent component and its children, e.g. `deck/`) is one item. Each file in the folder is
there to support the implementation (types, a context key, helpers, a composable or styles of its own), so consider
it part of the change: promote it with the item, or find what in Utensil it changes or duplicates. Only the PR notes
are not promoted as files.

### PR Notes

A `<component-name>-pr.md` beside an item (or one for a family) is the consumer's instructions for promoting it:
what the promotion needs that the consumer couldn't make in its own folder. Follow them:

- **Changes to Utensil** — make them all: other components that need the same change, docs, reference app demos,
  `packages/vue/docs/COMPONENTS.md`, and anything breaking.
- **Completing the component** — build it all: what the general component needs beyond what the consumer used.
  Utensil takes components complete for general use.
- **Switching over** — the consumer's own steps. Don't act on them; pass them on in the report.

The notes were written against the release the consumer had installed. Where Utensil has moved on since (a path
moved, a file renamed), carry out the instruction's intent in the current source.

### Evaluating Changes

The consumer built its changes with the same guides and judgement you have, so respect its implementation: promote
it as the consumer made it, with its names, API and behaviour, unless something needs to change. Where it does, change
it, and record the usage the consumer must rewrite (see the introduction).

Compare each change by its purpose, though, not its name. For each one (a prop, slot, context, fix, a new component
or a notes instruction), state what it does for the consumer that Utensil didn't. Then compare that purpose with the
current source:

- **Covered** — Utensil already serves the same purpose, under another name or by another means (a fix made
  differently, a prop that does the same job), most likely added since the consumer's copy. Don't add the
  consumer's version alongside it: two similar APIs with slightly different names are worse than either one. Note in
  the report what covers it, so the consumer can switch to it.
- **Unclear** — rare, since the consumer made the change deliberately: its purpose can't be found in the code, its
  comments, test, doc or notes. Leave it out and say why in the report.
- **To promote** — everything else.

## Utensil Development Guide

Read and follow the Utensil component guide, its addendum for this repository, and the repository's development
standards:

@../../../packages/vue/docs/DEVELOPMENT.md
@../../../docs/DEVELOPMENT-ADDENDUM.md
@../../../docs/STANDARDS.md

## Step 1: Inventory

List the items in the folder, or the named ones. Report a name that matches nothing. Add any item a selected one
depends on (it imports another local item, or its notes say to promote them together) and say why.

Find each item's changes, then evaluate each one against the current source in `packages/vue/src/` (see Evaluating
Changes):

- **New** — the component or composable itself, and each instruction in its notes. Look for an existing component
  that serves the same purpose, not only one at the mirrored path.
- **Wrapper** — what it adds: props, emits, slots and slot scope, provided context, exposed methods, changed
  defaults, and the behaviour behind them (a preset resolved into the base's props is the component's own logic
  once promoted).
- **Vendored** — what the copy changes, found by diffing it against the original at the version its header names:
  `git show v<version>:packages/vue/src/<path>`. Point its `utensil-vue/...` imports back at relative paths first,
  and ignore the vendoring header. With no version named, diff against the current source and judge which side each
  difference comes from: Utensil may have moved on since the copy.

An item whose changes are all covered is **promoted**; one with some covered is **partly promoted** (name the parts
still to do); the rest are **to promote**. For each covered change, check whether it's in the latest release tag
(`git describe --tags --abbrev=0`): released, the consumer can switch over now; otherwise it waits for the next
release.

If every item is promoted, list them with what covers each and its release status, say there's nothing to promote,
and stop. Otherwise list the promoted items as already done and carry on with the rest.

## Step 2: Promote

Work through the items in dependency order (an item another imports goes first), a family together.

- **Wrapper** — follow `.claude/skills/update-component/SKILL.md`. Make each addition in the component or composable
  itself: the prop in its `Props`, the slot in its template, the context in what it provides. Fold the wrapper's
  test and `<Name>Doc.vue` into the component's own.
- **Vendored** — follow `.claude/skills/update-component/SKILL.md`. Apply the changes to the current source rather
  than replacing the file, keeping anything Utensil changed since the copy was made.
- **New** — follow `.claude/skills/implement-component/SKILL.md` from Step 1 (its questions are already answered),
  at the path the local folder mirrors.
- **Partly promoted** — only the parts still to do.

Then follow each item's PR notes. Promote only changes evaluated as to promote; skip covered and unclear ones.

Keep the consumer's API as its code uses it by default: module paths, names, props, events, slots and slot scope,
defaults, root classes and cvars. Always change what makes the code this repository's:

- Imports of `utensil-vue/...` become relative paths within the package.
- Remove the vendoring and wrapping header comments, and anything about the consumer: its name, theme, features and
  copy. Tests and docs use a test theme of Utensil's own, not the consumer's (`docs/DEVELOPMENT-ADDENDUM.md` → Theme
  Colors).

Change the consumer's API or behaviour too where the component needs it: a bug in its copy, an audit finding, a name
or pattern that's inconsistent with the rest of Utensil, or a public name that would be awkward to change after
release. Each such change is a usage the consumer rewrites when it upgrades, so record it for the report.

Where Utensil changed after the consumer's copy, adapt the change to the current source. Prefer keeping the
consumer's usage working as written, but where that would add a second API for something Utensil now does, Utensil's
version stands (covered).

Released Utensil API is another matter: other consumers depend on it. Keep changes to it additive
(`.claude/CLAUDE.md` → Consumer Compatibility). Make a breaking change only when the item or its notes need it, and
record it for the release notes.

Every promoted component has its unit test, an up-to-date `<Name>Doc.vue`, a reference app demo of what was added,
and its row in `packages/vue/docs/COMPONENTS.md`.

## Step 3: Check

From the repository root, run `./check` and `bun run verify:package`, and fix errors related to the promotion.

Tell a sub-agent to run `/audit-component` on each new or changed component, without `--fix`. Consider the
recommendations and make those the promoted work needs, including ones that change the API the consumer uses (record
the rewrite for the report). Report the rest: findings about code the promotion didn't touch, and changes to released
Utensil API that would break other consumers.

UAT in the reference app, whose theme has full color scales and a variant map, never under Utensil's gray default.

If you handle git, commit each item on its own (`vue: <feature>: <message>`, per `docs/STANDARDS.md`). Never push,
bump versions or release: the promotion goes out in the next release on the maintainer's cadence.

## Step 4: Report

- **Already promoted** — each item, and whether it's released (in which version) or waiting for the next release.
- **Covered** — each change skipped because Utensil already serves its purpose: the local name and what covers it
  (`speed="fast"` → `preset="quick"`), with its release status.
- **Promoted** — each item and the purpose of what changed in Utensil.
- **Left out** — each change whose purpose was unclear or added no clear value, and why.
- **Breaking** — anything breaking, worded for the release notes.
- **Audit** — recommendations not made, and why: outside the promoted work, or breaking for other consumers.
- **Switching over** — for the consumer, whenever it chooses to upgrade to a release that includes the promotion:
  each local import and the `utensil-vue/...` path that replaces it, the local files to delete, and the notes'
  switching-over steps. Beyond imports, list every usage the consumer must rewrite: each covered change, to what
  covers it, and each change the promotion made to the consumer's API or behaviour, from what to what. Or say there
  are none.
