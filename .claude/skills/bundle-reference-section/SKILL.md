---
name: bundle-reference-section
description: Harvest one section of the running Utensil reference app into a cleaned static HTML partial
argument-hint: <SectionName>
context: fork
---

# Bundle Reference Section

Single tight harvest of one reference-app section — one reference page. Writes one file and exits.

**You are an executor, not a researcher.** Do not read source files, audit components, take screenshots, snapshot the page, list pages, or open new tabs. Run the recipe below verbatim and stop. The recipe is complete — there is nothing to discover.

## Argument

`SectionName` — the page's URL path segment, one of: `showcase`, `color-scales`, `ui-variations`, `text-themes`, `theme-reactivity`, `basic-ui`, `content`, `inputs`, `dialogs`, `date-pickers`, `layouts`, `progress`, `popovers`, `navigation`, `uploads`, `data-viz`, `media`, `resources`, `extended-library`.

## Prerequisites

The orchestrator (`/bundle-design-reference`) prepares these. If you are running standalone, set them up once, then run the recipe:

1. Reference dev server on `http://localhost:12911/`.
2. A Chrome DevTools MCP tab open on `http://localhost:12911/`. Reuse it. Never open another tab.
3. `temp/claude-design-bundle/sections/` exists (`mkdir -p` if not).

## Recipe

### Step 1 — Navigate to the page

Call `mcp__chrome-devtools__navigate_page` with `http://localhost:12911/<SectionName>`. Pages are lazy-loaded on request; the navigation mounts the page.

### Step 2 — One `evaluate_script` call

Call `mcp__chrome-devtools__evaluate_script` exactly once with the function below. Replace the literal string `__SECTION__` with the section name (do not use the `args` parameter — it is typed for element uids).

```js
;(async () => {
  const section = '__SECTION__'

  const isReady = () => !!(document.querySelector('.demo-page') || document.querySelector('.showcase-page'))
  if (!isReady()) await new Promise((r) => setTimeout(r, 120))
  if (!isReady()) await new Promise((r) => setTimeout(r, 300))
  if (!isReady()) return { ready: false }

  if (section === 'showcase') {
    const root = document.querySelector('.showcase-page')
    return { ready: true, blocks: [{ shape: 'C', title: 'Showcase', html: root.outerHTML }] }
  }

  const root = document.querySelector('.demo-page')
  const refDemos = Array.from(root.querySelectorAll('.reference-component-demo'))
  const looseDemos = Array.from(root.querySelectorAll('.component-demo')).filter(
    (el) => !el.closest('.reference-component-demo'),
  )
  const all = [...refDemos, ...looseDemos].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )

  const collectA = async (el) => {
    const title = el.querySelector('.component-demo-header .title h3')?.textContent?.trim() ?? ''
    const description = el.querySelector('.component-demo-header .title p')?.textContent?.trim() ?? ''
    const triggers = Array.from(el.querySelectorAll('.utensil-tabs-trigger'))
    const demoT = triggers.find((t) => t.textContent.includes('Demo'))
    const apiT = triggers.find((t) => t.textContent.includes('API'))
    if (demoT && !demoT.classList.contains('active')) {
      demoT.click()
      await new Promise((r) => setTimeout(r, 70))
    }
    const demoHtml = el.querySelector('[role="tabpanel"][data-state="active"]')?.innerHTML ?? ''
    let apiHtml = ''
    if (apiT) {
      apiT.click()
      await new Promise((r) => setTimeout(r, 70))
      apiHtml = el.querySelector('[role="tabpanel"][data-state="active"]')?.innerHTML ?? ''
      if (demoT) {
        demoT.click()
        await new Promise((r) => setTimeout(r, 20))
      }
    }
    return { shape: 'A', title, description, demoHtml, apiHtml }
  }

  const collectB = (el) => {
    const title = el.querySelector('h3')?.textContent?.trim() ?? ''
    const description = el.querySelector('p')?.textContent?.trim() ?? ''
    const clone = el.cloneNode(true)
    clone.querySelector('h3')?.remove()
    clone.querySelector('p')?.remove()
    return { shape: 'B', title, description, html: clone.innerHTML }
  }

  const blocks = []
  for (const el of all) {
    if (el.classList.contains('reference-component-demo')) blocks.push(await collectA(el))
    else blocks.push(collectB(el))
  }
  return { ready: true, blocks }
})()
```

Reading the result:

- The return is JSON. For a typical section the serialized payload is 30–100 KB.
- If the inline tool response is truncated and the runtime spills the result to a file (the tool message will say so and give a path), open that file with `Read`, strip the leading `Script ran on page and returned:` line and the surrounding ` ```json ` / ` ``` ` fences, then parse the remainder. **Do not re-run `evaluate_script` to "get it again"** — the script clicks tabs and would re-mutate page state on a second run.
- If the result is `{ ready: false }`, skip to Step 5 with the empty body from Step 4.

### Step 3 — Clean every HTML string

Apply these four regexes to every `demoHtml`, `apiHtml`, and `html` field in the blocks. **No other cleanup.** Do not invent transforms, do not "improve" attributes, do not re-indent.

```
/ data-v-[a-z0-9]+="[^"]*"/g            → ''
/ class=""/g                             → ''
/<!--v-(?:if|else)-->/g                  → ''
/ style="justify-content: center;"/g     → ''
```

### Step 4 — Assemble the partial

Build the file body with this shape. Omit `<p>` if description is empty. Omit `<div class="component-api">` if `apiHtml` is empty or absent.

```html
<section data-section="<SectionName>">
  <h1>{{ Section title from the map below }}</h1>
  <article class="component" data-shape="A">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="component-demo">{{ cleaned demoHtml }}</div>
    <div class="component-api">{{ cleaned apiHtml }}</div>
  </article>
  <!-- ... one article per block, in returned order ... -->
</section>
```

Section title map:

```
showcase          Showcase
color-scales      Color Scales
ui-variations     UI Variations
text-themes       Text Themes
theme-reactivity  Theme Reactivity
basic-ui          Basic UI
content           Content
inputs            Inputs
dialogs           Dialogs
date-pickers      Date Pickers
layouts           Layouts
progress          Progress
popovers          Popovers
navigation        Navigation
uploads           Uploads
data-viz          Data Visualization
media             Media
resources         Resources
extended-library  Extended Library
```

If `{ ready: false }` in Step 2, the body is just:

```html
<section data-section="<SectionName>">
  <!-- empty: section did not mount -->
</section>
```

### Step 5 — Write the file

Write the assembled body to `temp/claude-design-bundle/sections/<SectionName>.html` with the `Write` tool. Use the exact section name (case-sensitive) as the filename stem.

Done. **Exit.** Do not run validation greps, do not screenshot, do not summarise back to the user — the orchestrator handles that.

## Hard rules

- Exactly one `navigate_page` call (Step 1) and exactly one `evaluate_script` call (Step 2). (One evaluate retry only if the first returns `{ ready: false }` after the script's own 420ms grace period — in which case write the empty partial and stop.) A spilled-to-file result still counts as the single call — `Read` the spill file, do not re-evaluate.
- No `take_snapshot`, `take_screenshot`, `list_pages`, or `new_page`.
- No `Read` on source files. The recipe is self-contained.
- No `Grep` / `Bash find` exploration.
- Total tool calls expected: ~3–4 (one `navigate_page`, one `evaluate_script`, one `Write`, optional `Bash mkdir -p` if running standalone).
