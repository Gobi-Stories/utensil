# Breaking Changes

What each release of `@gobistories/utensil-vue` and `@gobistories/utensil-css` changed that a project using them may
have to adapt to. The two packages share one version.

Each version's section lists, by component, the changes your code may need to follow: removed or renamed APIs, and
changed defaults and behavior. Its **Visual changes** list how things look different without any code having to
change, so you can check the screens that use them.

To upgrade, work through the section of every version after the one installed, up to the one being installed, and find
each usage an entry names. **Latest** holds the changes since the last release; a release renames it to its version.

Until 1.0.0, a minor release (`0.4.x` → `0.5.0`) may break, and a patch release doesn't.

## Latest

### useUserThemePreferences

- With nothing stored, `contrast` and `reducedMotion` follow `prefers-contrast: more` and
  `prefers-reduced-motion: reduce`, where they were always `'normal'`, and all three follow a change to the system's
  setting while the app is open, where `mode` was read once. A stored choice still wins.
- Writing `mode`, `contrast` or `reducedMotion` directly (`v-model` on one of them) is a choice, remembered as the
  setters' are, where it applied without being stored unless a setter had been called. Each setter also takes
  `'system'`, which forgets the choice; the choices are `modeChoice`, `contrastChoice` and `reducedMotionChoice`.

### Visual changes

- **Forced colors** (Windows contrast themes): fields, selects, menus, popovers, tooltips, dialogs, drawers, toasts and
  every filled or edged variation draw an edge in the system's text color, and fields a Highlight focus ring. Pressed,
  checked and chosen buttons, the option or menu item the keyboard is on, and the chosen calendar day are filled with
  the system's Highlight. Progress bars, sliders and stepper connectors draw their track as an edge and their fill in
  Highlight, and the selected tab's indicator is Highlight. Nothing changes outside forced colors.

## 0.5.0

### UtensilCard

- The default header's icon and heading are inside a `.utensil-card-header-start` element, so they wrap as one and only
  `header-end` wraps below them. Update a selector that expects them to be children of `.utensil-card-header`. A
  custom `header` slot is unaffected.

### UtensilHintLabel

- The inner classes are namespaced: `.hint-text` is `.utensil-hint-label-text`, and `.hint-text-clip` is
  `.utensil-hint-label-clip`.

### UtensilInput and UtensilTextArea

- The input no longer defaults `autocomplete` to `"off"` or `pattern` to `".+"`. Browsers offer autofill unless a field
  sets `autocomplete`, and an empty input doesn't match `:invalid`. Set either where a field needs it.
- `UtensilTextArea` is no longer generic over the theme: drop its type argument from a typed wrapper.

### UtensilListbox

- The `values` prop, which nothing read, and `focusValue()`, a duplicate of `setFocusedValue()`, are removed.

### UtensilPassword

- The input is no longer required by default. Pass `required` where a form needs it.

### UtensilPopover and the components built on it

- `UtensilPopoverPanel`, `UtensilSelect`, `UtensilDatePicker`, `UtensilDropdownMenu`, `UtensilTasks` and
  `UtensilLabelInput` set their look on their own panel only. A `--utensil-popover-*` cvar set around one of them (on
  an ancestor, rather than on the component) reaches its panel instead of being replaced by the component's own look.
  A popover nested in one of them no longer inherits that look: set the cvars on it if it relied on that.
- `actualPlacement`, exposed and in the slot scopes, stays the placement the popover was last shown at once it closes,
  rather than going back to the `placement` prop, so what follows it holds while the popover fades out.
  `placement-change` is emitted when a popover that flipped opens at its own placement again, as well as when it flips.
  A host that reset its own placement state on close can drop the reset, and should, or it changes during the fade.

### UtensilSelect

- The root class is `.utensil-select`, not `.utensil-select-field`, and the inner `UtensilSelectBase` no longer carries
  `.utensil-select`.
- `UtensilSelectBase`'s trigger slot scope `handleKeydown` is `navigate`, and its unused theme generic is removed.
- The unused `SelectSize` type is removed.

### Visual changes

- **UtensilBox and UtensilCard**: on a light page, content inside an `overlay` box or card is drawn with the dark-mode
  color scales, as it is on a dark page, so it reads on the overlay's dark panel. An interactive `outline` or `text`
  box is tinted on hover and press, where a text box had no hover feedback and an outline box only its edge.
- **UtensilCard**: the icon stays beside the title however narrow the card, where a card narrower than about 19rem put
  the icon on a line of its own, and beside an icon the title's line-height is 1, so it lines up with the icon's top
  edge. An unstyled card's title and description take the color around them instead of pencil. A disabled card draws
  its title, description and icon in its variation's muted color. On a solid or overlay card, the icon's tile takes
  the fill's text color unless `iconColor` is given.
- **UtensilDivider**: the rule is `--pen-a6` and the label `--pen-a11`, where they were `--pen-6` and `--pen-10`.
- **UtensilInput, UtensilTextArea and UtensilSelect**: the variations are the shared ones, as on buttons and boxes.
  `outline` is an edge over whatever is behind the field, rather than a filled field with a fainter edge, and
  `surface`'s edge is `--pencil-a6`. Focus keeps the field's background and draws a pen ring, rather than making the
  outline opaque. A disabled field is drawn muted, with its label, icon, description and placeholder, instead of at
  50% opacity.
- **UtensilListbox**: the 240px maximum height scales with `--scale`.
- **UtensilPopover**: a popover as wide as its trigger (`width="anchor"`), such as a select's list, fades in and out
  without scaling. A popover above or below its trigger is inset by `--utensil-popover-inset` from the trigger's side
  it aligns to, so an end-aligned one sits 1px in from the trigger's end and a centered one is centered, where all
  were shifted 1px right; one beside its trigger is no longer shifted.
- **UtensilProgressBar**: `rounded` draws `--radius-rounded` instead of `--radius-2`, heights scale with `--scale`, and
  the indeterminate segment starts at once, from the start edge, instead of after a 2s blank.
- **UtensilTooltip**: the overlay tooltip has the overlay's blur.
- **High contrast**: dividers, the table header's separator, progress bars, a card's footer divider, the select's open
  list and its focused and selected options are drawn stronger, and the overlay tooltip is opaque.

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

- `useCartesianChart` takes the chart's svg (`svg`), returns `viewBox` as a ref, and returns `axis` in place of
  `niceMax`.

### UtensilRating

- `@fortawesome/free-regular-svg-icons` is a new peer dependency: install it beside
  `@fortawesome/free-solid-svg-icons`, on the same version.

### UtensilResource

- A load that ends within a second of its spinner appearing shows its content up to a second later, so the spinner
  doesn't flash. `:loaderMinimum="0"` keeps the old timing.

### Visual changes

- **Data visualization**: line, area, bar, stacked and horizontal bar charts take the height of their box (220px in a
  box without one) and widen to its width, rather than scaling a fixed 400×220 drawing to fit. Horizontal and stacked
  bar charts draw negative values below or left of zero rather than clamping them to zero.
- **UtensilInfoStrip**: every item label is larger, regular weight and higher contrast, where it was `--font-size-0`,
  weight 600 and `--pencil-a10`.

## 0.1.1

None.

## 0.1.0

### Packages

- The packages are `@gobistories/utensil-css` and `@gobistories/utensil-vue`, published to Utensil's own registry
  rather than npmjs. Map the `@gobistories` scope to the registry in `.npmrc`, depend on `@gobistories/utensil-vue`, and
  import from `@gobistories/utensil-vue/...`.

### UtensilBox and UtensilCard

- `UtensilCard` is the structured card, with `surface` as its default variation and its own padding, radius and column
  layout. Uses as a plain container become `UtensilBox`, which keeps the old card's props.
- `interactive` no longer adds `tabindex="0"`, and `shadow` is a shadow-border level (1–6), where it was a boolean that
  did nothing.
- `UtensilRadioCard` and `UtensilUserProfileCard` render `.utensil-box` where they rendered `.utensil-card`.

### Visual changes

- **UtensilBox**: corners are the content radius, `--radius-2`, where the old card's were `--radius-4`.
- **UtensilRadioCard and UtensilUserProfileCard**: corners are `--radius-3` and `--radius-2`, where they were
  `--radius-4`.
