---
name: bundle-design-reference
description: Harvest the running Utensil reference app into a single static HTML+CSS bundle for use as a design-system reference (e.g. for Claude Design)
context: fork
---

# Bundle Design Reference

Produce a single self-contained HTML file that captures the rendered output of every Utensil component as shown in the reference application. The output is a static reference bundle — design tools that ingest design systems (notably Claude Design) can read it as a source artefact.

**You are an executor, not a researcher.** Follow the 5 steps below and stop. Do not read source files, do not audit components, do not summarise the design system — `/bundle-reference-section` does the actual DOM harvest; this skill orchestrates and assembles. Expected tool calls: ~26–32 total (one MCP setup, 19 child invocations, one CSS harvest, a few file writes).

## Prerequisites

**The reference dev server must be running** at `http://localhost:12911/`.

- Do _not_ use a built/static version: Vite's build step inlines/moves stylesheets in ways that break per-section CSS harvest.
- If the server is unreachable, ask the user to start it (`bun run dev` from the repository root, or `docker compose up utensil-reference`) and abort.

Use the Chrome DevTools MCP for navigation and evaluation against the live app.

## Sections

The bundle covers 19 reference pages, by URL path. Use this list verbatim — do not re-derive it from `router.ts`:

```
showcase
color-scales
ui-variations
text-themes
theme-reactivity
basic-ui
content
inputs
dialogs
date-pickers
layouts
progress
popovers
navigation
uploads
data-viz
media
resources
extended-library
```

Each section is one page, reachable at `http://localhost:12911/<name>`. Pages are lazy-loaded on request.

## Output

Write to `temp/claude-design-bundle/` (relative to the repository root; `temp/` is gitignored):

```
temp/claude-design-bundle/
  index.html              # Final concatenated bundle
  sections/
    <section>.html        # Per-section partial (one file per section)
  theme.css               # Merged, cleaned CSS harvested from the live page
```

Create `temp/` if it does not exist.

## Step 1: Confirm the server and prepare the tab

Use the Chrome DevTools MCP. There is only one shared browser instance, so the whole harvest runs against a single tab.

1. `list_pages` — if a tab is already on `http://localhost:12911/*`, reuse it. Otherwise `new_page` with `http://localhost:12911/`.
2. Confirm the app mounted by evaluating `!!document.querySelector('.utensil-reference-app')`. If false after ~1 second, stop and ask the user to start the dev server.
3. Ensure the directory `temp/claude-design-bundle/sections/` exists (`mkdir -p`).

## Step 2: Harvest sections sequentially

Iterate the 19 section names **in the order listed above**. For each section:

1. Check if `temp/claude-design-bundle/sections/<name>.html` already exists and is non-empty. If yes, **skip** — that section was already harvested in a prior run. (Use `ls` or stat — do not `Read` the file's contents.)
2. Otherwise, invoke `/bundle-reference-section <name>` and wait for it to finish writing its partial before starting the next.

**Do not run in parallel** — every section harvester drives the same Chrome tab, so parallel agents would race on navigation and `evaluate_script` calls. Serial keeps the tab state coherent.

Each child agent is self-contained (no extra arguments). After the loop, all 19 partials should exist on disk; verify with `ls temp/claude-design-bundle/sections/` and confirm 19 files.

To force a re-harvest of one section, the user deletes its partial file first.

## Step 3: Harvest merged CSS

If `temp/claude-design-bundle/theme.css` already exists and is non-empty, **skip this step** — reuse the existing file.

Otherwise, reuse the same tab. Navigate to `http://localhost:12911/basic-ui`. Pages are lazy-loaded, so a page's styles are only in the document once its module has loaded — the function below first imports every page module (Vite's dev server injects each module's styles on evaluation), then collects every rule. Call `evaluate_script` exactly once with this function:

```js
;(async () => {
  const pages = [
    'showcase/ShowcasePage',
    'color-scales/ColorScalesPage',
    'ui-variations/UIVariationsPage',
    'text-themes/TextThemesPage',
    'theme-reactivity/ThemeReactivityPage',
    'basic-ui/BasicUIPage',
    'content/ContentPage',
    'inputs/InputsPage',
    'dialogs/DialogsPage',
    'date-pickers/DatePickersPage',
    'layouts/LayoutsPage',
    'progress/ProgressPage',
    'popovers/PopoversPage',
    'navigation/NavigationPage',
    'uploads/UploadsPage',
    'data-viz/DataVizPage',
    'media/MediaPage',
    'resources/ResourcesPage',
    'extended-library/ExtendedLibraryPage',
  ]
  for (const p of pages) {
    try {
      await import(`/src/features/${p}.vue`)
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 200))

  const stripDataV = (s) => s.replace(/\[data-v-[a-z0-9]+\]/g, '')
  const isNoise = (href, text) => {
    const blob = (href ?? '') + ' ' + (text ?? '')
    return /vite-|@vite|vue-devtools|vue-inspector|__vite_|vite-error-overlay|vite-plugin-vue/.test(blob)
  }
  const seen = new Set()
  const out = []
  for (const sh of document.styleSheets) {
    let rules
    try {
      rules = sh.cssRules
    } catch {
      continue
    }
    if (!rules) continue
    const href = sh.href
    for (const r of rules) {
      const t = r.cssText
      if (!t) continue
      if (isNoise(href, t)) continue
      const cleaned = stripDataV(t)
      if (seen.has(cleaned)) continue
      seen.add(cleaned)
      out.push(cleaned)
    }
  }
  return out.join('\n\n')
})()
```

Write the returned string to `temp/claude-design-bundle/theme.css`.

Expected size: ~300–400 KB. If significantly smaller, the filter is too aggressive; if much larger, the filter is too loose. Report and stop if outside this range — do not "fix it" by guessing additional filters.

## Step 4: Assemble index.html

Build `temp/claude-design-bundle/index.html` as:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Utensil Design System — Reference Bundle</title>

<!--
  Utensil Design System — Component Reference Bundle
  ================================================

  This is a static, single-file reference of the Utensil Design System,
  harvested from the running reference application.

  Each component appears as it is rendered in the reference app, with
  its title, description, demo, and (where available) API documentation.

  THEME — `theme.css` (inlined below) is the merged Utensil + reference theme,
  with Vue's scoped-style `[data-v-*]` attribute selectors stripped. Vite,
  Vue DevTools, and Vue Inspector rules have been excluded.

  REFERENCE-SPECIFIC CLASSES — These are layout wrappers from the reference
  application, not part of Utensil. They are kept so that the visual grouping
  of demos is preserved, but they are NOT components in the design system:

    .demo-page              Reference page wrapper
    .component-demo         A component demo block (alternative to ReferenceComponentDemo)
    .demo-grid              Grid of demo items
    .demo-item              One cell in a demo grid
    .demo-content           Visual area inside a demo-item
    .demo-label             Label strip beneath a demo-item
    .demo-code              Code strip (hidden by default)
    .reference-component-demo Wrapper around title + demo + API tabs
    .component-demo-header  Header band of .reference-component-demo
    .component-demo-api     API tab content container

  See `apps/reference/src/theme/reference-demos.css` and
  `apps/reference/src/features/components/ReferenceComponentDemo.vue`
  for their definitions.

  FONTS — Loaded from Google Fonts. No font files are bundled.
-->

<!-- Fonts (copied verbatim from the reference app's index.html) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap" rel="stylesheet">

<style>
/* === theme.css === */
{{ inline contents of theme.css here }}
</style>
</head>
<body class="reference-theme utensil-reset utensil-theme utensil-mode utensil-squared text-reference text-ui utensil-calculate utensil-theme-root reference-theme-root light-mode blue-pen grey-pencil">

<!-- One <section data-section="<name>"> per harvested section, in the order listed in Step 1 above -->
{{ for each section in order: inline contents of sections/<section>.html }}

</body>
</html>
```

Notes:

- Use the hardcoded font `<link>` tags above. Don't fetch the reference index to compare — that's research the user did not ask for.
- The `<body>` class list above is required _as written_ — these are the classes the live `ReferenceThemeRoot` div applies, with `dark-mode` and the inline-color-only `custom-pen-pen custom-pencil-pencil` swapped for `light-mode blue-pen grey-pencil`. **Do not abbreviate this set.** Specifically:
  - `utensil-theme` is required for **all `.ui-solid`/`.ui-soft`/`.ui-outline`/`.ui-surface`/`.ui-text`/`.ui-overlay` variant CSS** — those rules live inside a nested `.utensil-theme { & .ui-solid { ... } }` block. Drop `utensil-theme` and every variation renders unstyled.
  - `light-mode` is required so the bundle stays light regardless of system `prefers-color-scheme`. `utensil-mode` alone defaults to light but a dark system preference can flip it via `@media`.
  - `blue-pen grey-pencil` set the named pen and pencil. Without them, `--pen-9` / `--pencil-9` etc. are empty and components fall back to transparent backgrounds.
  - `utensil-calculate` is required for design tokens (`--space-*`, `--font-size-*`, `--radius-*`) to resolve.
  - `reference-theme`, `reference-theme-root`, `utensil-theme-root`, `utensil-reset`, `utensil-squared`, `text-reference`, `text-ui` mirror the live wrapper so reference-specific text and reset rules apply.

## Step 5: Verify and report

Run once:

```bash
wc -c temp/claude-design-bundle/index.html
ls temp/claude-design-bundle/sections/ | wc -l
```

Report the bundle path, the index.html size, and the section count to the user. Done.

## Hard rules

- This skill is harvest-only — it never modifies anything outside `temp/`.
- No `Read` on source files. No `Grep`/`find` exploration. The 19 section names and the assembly template are everything you need.
- Sub-skills run **serial**, never in parallel — they share one Chrome tab.
- If a child reports a section did not mount, note it in the report; do not retry, do not investigate.
