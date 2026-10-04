---
name: utensil-audit-component
description: Audit a component against Utensil Design System patterns and standards, optionally fixing the findings. Use after implementing or changing a component in a project that uses utensil-vue.
license: MIT
argument-hint: <ComponentName or path> [--fix] [--rule number] | --rules
context: fork
---

# Audit Component

Audit a component against Utensil Design System patterns, rules, and guidance. The same quality bar that applies to Utensil components applies here.

## Arguments

- `ComponentName or path`: the component's file path, or its name (e.g., `UserAvatar`)
  - Given a name, find `<ComponentName>.vue` in the project, outside `node_modules`. If more than one matches, ask which one.

## Options

- `--rules`: List all rules from the audit checklist as a numbered list. Do not perform auditing.
- `--fix`: After the audit completes and results are reported, automatically implement fixes for all recommendations. See the **Fix mode** section below.
- `--rule`: Only audit the specified rule or rules as listed in the checklist. Multiple rules can be specified.

## Preparation

Before auditing, load these files in order:

1. Read `references/DEVELOPMENT.md` (in this skill's directory) — the source of truth for all patterns
2. Read `references/audit-checklist.md` — the structured checklist to audit against
3. Read `references/USAGE.md` — how projects consume Utensil (tokens, typed wrappers, cascade layers)

## Workflow

1. Read the component file(s) — if the component has related files in the same directory (e.g., child components, composables), read those too
2. For each item in the audit checklist, determine:
   - **Is the component using this pattern?** (yes/no/not applicable)
   - **Should the component be using this pattern?** Consider the component's nature — not all patterns apply to all components (e.g., UI variations only matter for components that benefit from visual weight options; ARIA attributes only matter for interactive components; popover composition only matters for overlay components)
3. A recommendation is produced only when: the component is **not** using the pattern **and** it **should** be
4. Return the list of recommendations, each with the checklist item number and pattern description

### Judgement guidelines

Not every checklist item applies to every component. Use these guidelines:

- **Always applies**: Items 1–5, 9, 33–34 (structure, tokens, types, quality)
- **Interactive components only**: Items 10–14, 25–31 (focus, keyboard, ARIA, disabled)
- **Theme prop components only**: Items 15–20, 50–51 (generics, useTheme, theme selectors)
- **Components with variations**: Item 21 (UI variations)
- **Components with borders**: Item 22 (box-shadow borders)
- **Components with text**: Item 23 (high contrast text colors)
- **Popover/overlay components**: Items 24, 36 (panel-solid, popover composition)
- **Compound/composite components**: Items 37–42 (provide/inject, slot scope, named slots)
- **Components with customizable layout**: Items 43–44 (CSS cvars)
- **Components with responsive behaviour**: Items 45–47
- **Components with shape options**: Item 48 (rounded/squared)
- **High-contrast/reduced-motion**: Items 6–7

When in doubt about whether a pattern applies, lean toward recommending it — the user can dismiss false positives.

## Output

Return a markdown list of recommendations:

```
## Audit: UserAvatar

**2 Recommendations:**

- #6: High contrast mode supported via `.utensil-high-contrast` class
- #10: Focus ring or focus style with `:focus-visible`

**No issues found for 54 other checklist items.**
```

Or if clean:

```
## Audit: UserAvatar

No recommendations. Component passes all applicable checklist items.
```

## Fix mode

When `--fix` is passed, implement fixes for all recommendations **after** the full audit output has been produced. Do not fix during the audit phase — complete the audit first, then fix.

### Fix workflow

1. Complete the full audit and produce the output as described above
2. For each recommendation, implement the fix following the patterns in `references/DEVELOPMENT.md`
3. If a component is missing a unit test (checklist #9), write one alongside the component file following existing test patterns in the codebase
4. After all fixes are applied, run verification using the project's commands (check `package.json`):
   - `lint`
   - `typecheck`
   - `test`
5. Fix any errors from verification that relate to your changes

### Fix guidelines

- Only fix recommendations that were surfaced by the audit — do not make additional changes
- Remove dead code identified during the audit (unused refs, variables, imports)
- When exposing CSS cvars, use the `--<component-name>-<property>` naming convention with a fallback to the original value
- When adding missing tests, test the component's behaviour (props, slots, events, classes) not its implementation details
