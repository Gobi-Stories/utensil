# Breaking Changes

What each release of `@gobistories/utensil-vue` and `@gobistories/utensil-css` changed that a project using them may
have to adapt to: removed or renamed APIs, changed defaults and behavior, and changes to how things look. The two
packages share one version.

To upgrade, work through the section of every version after the one installed, up to the one being installed, and find
each usage an entry names. **Latest** holds the changes since the last release; a release renames it to its version.

Until 1.0.0, a minor release (`0.4.x` → `0.5.0`) may break, and a patch release doesn't.

## Latest

### UtensilBox and UtensilCard

- On a light page, content inside an `overlay` box or card uses the dark-mode color scales (pen, pencil, paper and the
  mode tokens), as it does on a dark page, so it reads on the overlay's dark panel. Content styled for a light page
  inside one may need adjusting.

### UtensilCard

- The default header's icon and heading are inside a `.utensil-card-header-start` element, so they wrap as one and only
  `header-end` wraps below them. Update a selector that expects them to be children of `.utensil-card-header`. A
  custom `header` slot is unaffected.
- An unstyled card's title and description inherit their color instead of being drawn in pencil.

### UtensilHintLabel

- The inner classes are namespaced: `.hint-text` is `.utensil-hint-label-text`, and `.hint-text-clip` is
  `.utensil-hint-label-clip`.

### UtensilInput and UtensilTextArea

- The input no longer defaults `autocomplete` to `"off"` or `pattern` to `".+"`. Browsers offer autofill unless a field
  sets `autocomplete`, and an empty input doesn't match `:invalid`. Set either where a field needs it.
- `outline` is an edge over whatever is behind the field, as on outline buttons, rather than a filled field with a
  fainter edge. `surface`'s edge is `--pencil-a6`.
- Focus keeps the field's background and draws a pen ring, rather than making the outline opaque.
- A disabled input, text area or select is drawn muted instead of at 50% opacity.
- `UtensilTextArea` is no longer generic over the theme: drop its type argument from a typed wrapper.

### UtensilListbox

- The `values` prop, which nothing read, and `focusValue()`, a duplicate of `setFocusedValue()`, are removed.
- The 240px maximum height scales with `--scale`.

### UtensilPassword

- The input is no longer required by default. Pass `required` where a form needs it.

### UtensilPopover and the components built on it

- `UtensilPopoverPanel`, `UtensilSelect`, `UtensilDatePicker`, `UtensilDropdownMenu`, `UtensilTasks` and
  `UtensilLabelInput` set their look on their own panel only. A `--utensil-popover-*` cvar set around one of them (on
  an ancestor, rather than on the component) reaches its panel instead of being replaced by the component's own look.
  A popover nested in one of them no longer inherits that look: set the cvars on it if it relied on that.

### UtensilProgressBar

- `rounded` draws `--radius-rounded` instead of `--radius-2`.

### UtensilSelect

- The root class is `.utensil-select`, not `.utensil-select-field`, and the inner `UtensilSelectBase` no longer carries
  `.utensil-select`.
- `UtensilSelectBase`'s trigger slot scope `handleKeydown` is `navigate`, and its unused theme generic is removed.
- The unused `SelectSize` type is removed.

## 0.4.0

None.

## 0.3.0

### UtensilButton and UtensilToggleButton

- `pressed` takes a boolean: `:pressed="on ? 'pressed' : false"` becomes `:pressed="on"`. `'checked'` and
  `'unchecked'` are removed: use a radio component, or set `role` and `aria-checked` yourself.
- `ariaDisabled` no longer emits `click`. Where it was used for "press to see what's missing", use `blocked` (the same
  look) with `blocked-described-by="<id of the element giving the reason>"`.

## 0.2.0

### Color generation

- `ColorCssOptions.backgrounds` and `ColorGeneratorOptions.backgrounds` are replaced by `paperColor`, and the
  `ColorBackgrounds` type is removed. Pass the paper color (and the paper options) instead of its page colors. The
  CLI's flags are unchanged.

### Data visualization

- Line, area, bar, stacked and horizontal bar charts take the height of their box (220px in a box without one) and
  widen to its width, rather than scaling a fixed 400×220 drawing to fit.
- `useCartesianChart` takes the chart's svg (`svg`), returns `viewBox` as a ref, and returns `axis` in place of
  `niceMax`.
- Horizontal and stacked bar charts draw negative values below or left of zero rather than clamping them to zero.

### UtensilInfoStrip

- Every item label is larger, regular weight and higher contrast, where it was `--font-size-0`, weight 600 and
  `--pencil-a10`.

### UtensilRating

- `@fortawesome/free-regular-svg-icons` is a new peer dependency: install it beside
  `@fortawesome/free-solid-svg-icons`, on the same version.

### UtensilResource

- A load that ends within a second of its spinner appearing shows its content up to a second later, so the spinner
  doesn't flash. `:loaderMinimum="0"` keeps the old timing.

## 0.1.1

None.

## 0.1.0

### Packages

- The packages are `@gobistories/utensil-css` and `@gobistories/utensil-vue`, published to Utensil's own registry
  rather than npmjs. Map the `@gobistories` scope to the registry in `.npmrc`, depend on `@gobistories/utensil-vue`, and
  import from `@gobistories/utensil-vue/...`.

### UtensilBox and UtensilCard

- `UtensilCard` is the structured card, with `surface` as its default variation and its own padding, radius and column
  layout. Uses as a plain container become `UtensilBox`, which keeps the old card's props, with the content radius
  (`--radius-2`) where the old card had `--radius-4`.
- `interactive` no longer adds `tabindex="0"`, and `shadow` is a shadow-border level (1–6), where it was a boolean that
  did nothing.
- `UtensilRadioCard` and `UtensilUserProfileCard` render `.utensil-box` where they rendered `.utensil-card`. Their
  corners are `--radius-3` and `--radius-2`, where they were `--radius-4`.
