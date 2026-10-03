import {
  computed,
  inject,
  provide,
  ref,
  toValue,
  type ComputedRef,
  type CSSProperties,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import {
  ThemeStateKey,
  defaultUtensilPen,
  defaultUtensilPencil,
  defaultUtensilPaper,
  defaultUtensilVariants,
  defaultUtensilIcons,
  resolveMode,
  type ColorProp,
  type ThemeName,
  type ThemeMode,
  type ThemeState,
  type Variant,
  type VariantMap,
  type TextTheme,
  type IconMap,
  type ThemeConfig,
  type Color,
  type ScaleProp,
  scaleMap,
  type RadiusScaleProp,
  radiusScaleMap,
  type ThemeContrast,
  type ThemeReducedMotion,
  defaultUtensilTextThemeClasses,
  type TextThemeClasses,
} from './utensil-theme'
import { equals } from '../lib/equality/equality'

/**
 * Theme props for the useTheme composable.
 * Values can be refs, getters, or plain values for maximum flexibility.
 */
export type UseThemeProps<Theme extends ThemeConfig = ThemeConfig> = {
  mode?: MaybeRefOrGetter<ThemeMode | undefined>
  name?: MaybeRefOrGetter<ThemeName | undefined>
  pen?: MaybeRefOrGetter<ColorProp<Theme> | undefined>
  pencil?: MaybeRefOrGetter<ColorProp<Theme> | undefined>
  paper?: MaybeRefOrGetter<ColorProp<Theme> | undefined>
  contrast?: MaybeRefOrGetter<ThemeContrast | undefined>
  reducedMotion?: MaybeRefOrGetter<ThemeReducedMotion | undefined>
  text?: MaybeRefOrGetter<TextTheme<Theme> | undefined>
  textThemeClasses?: MaybeRefOrGetter<TextThemeClasses<Theme> | undefined>
  variants?: MaybeRefOrGetter<Partial<VariantMap<Theme>> | undefined>
  icons?: MaybeRefOrGetter<Partial<IconMap<Theme>> | undefined>
  scale?: MaybeRefOrGetter<ScaleProp | undefined>
  relativeScale?: MaybeRefOrGetter<ScaleProp | undefined>
  radiusScale?: MaybeRefOrGetter<RadiusScaleProp | undefined>
  relativeRadiusScale?: MaybeRefOrGetter<RadiusScaleProp | undefined>
}

/**
 * Composable for managing theme state and applying theme classes/styles.
 *
 * This composable:
 * - Inherits theme context from parent components via provide/inject
 * - Computes local theme state based on props
 * - Calculates which CSS classes need to be applied
 * - Provides theme context to child components
 *
 * @param props - Theme configuration props
 * @returns Object containing computed classes, style, and theme state
 */
export function useTheme<Theme extends ThemeConfig = ThemeConfig>(props: UseThemeProps<Theme> = {}) {
  const name = toValue(props.name)
  if (name) {
    if (!/^-?[A-Za-z_][\w-]*$/.test(name)) {
      throw new TypeError('Theme name must be a valid CSS class name')
    }
  }

  const initialize = ref(false)
  const parentContext = inject<ComputedRef<ThemeState<Theme>> | undefined>(ThemeStateKey, undefined)

  // The base context is the framework defaults — never the props. The root
  // applies its configuration on top in localState, so config that matches the
  // base is still detected as a change and applied (classes and scale style).
  let contextState = ref<ThemeState<Theme>>({
    mode: resolveMode(),
    name: undefined,
    pen: defaultUtensilPen,
    pencil: defaultUtensilPencil,
    paper: defaultUtensilPaper,
    contrast: 'normal',
    reducedMotion: 'normal',
    text: 'ui',
    textThemeClasses: { ...(defaultUtensilTextThemeClasses as TextThemeClasses<Theme>) },
    variants: { ...(defaultUtensilVariants as VariantMap<Theme>) },
    icons: { ...(defaultUtensilIcons as IconMap<Theme>) },
    scale: 1,
    radiusScale: 1,
  }) as Ref<ThemeState<Theme>>

  if (parentContext) {
    contextState = parentContext
  } else {
    initialize.value = true
  }

  const localState = computed<ThemeState<Theme>>(() => {
    const context = contextState.value

    const name = toValue(props.name)
    const mode = toValue(props.mode)
    const pen = toValue(props.pen)
    const pencil = toValue(props.pencil)
    const paper = toValue(props.paper)
    const contrast = toValue(props.contrast)
    const reducedMotion = toValue(props.reducedMotion)
    const text = toValue(props.text)
    const textThemeClasses = toValue(props.textThemeClasses)
    const variants = toValue(props.variants)
    const icons = toValue(props.icons)
    const scale = toValue(props.scale)
    const relativeScale = toValue(props.relativeScale)
    const radiusScale = toValue(props.radiusScale)
    const relativeRadiusScale = toValue(props.relativeRadiusScale)

    // Read every dynamic per-variant prop (e.g. primary="green") so a value
    // arriving later retriggers this computed even on a pass-through run.
    let hasVariantProps = false
    for (const key in context.variants) {
      if ((props as Record<Variant, ColorProp<Theme>>)[key as Variant]) {
        hasVariantProps = true
      }
    }

    // Pass-through: no prop changes the state, so this instance shares the
    // parent state by reference — no copy, and the classes/style comparisons
    // below short-circuit on identity. Beyond unresolved props this covers
    // provable no-ops: pen="pen"/pencil="pencil" resolve to the inherited
    // instrument and a relative scale of 1 multiplies away — the defaults most
    // components pass (e.g. UtensilButton's pen: color || 'pen'). The state
    // object must never be mutated after this computed returns. The root
    // (initialize) always builds its own state.
    if (
      !initialize.value &&
      !name &&
      !mode &&
      (!pen || pen === 'pen') &&
      (!pencil || pencil === 'pencil') &&
      (!paper || paper === 'paper') &&
      contrast === undefined &&
      reducedMotion === undefined &&
      !text &&
      !textThemeClasses &&
      !variants &&
      !icons &&
      !hasVariantProps &&
      scale === undefined &&
      resolveScale(relativeScale) === 1 &&
      radiusScale === undefined &&
      resolveRadiusScale(relativeRadiusScale) === 1
    ) {
      return context
    }

    // Only `variants` is mutated per key below; `icons` and `textThemeClasses`
    // are replaced wholesale and every other field is a top-level assignment,
    // so a shallow copy (plus a fresh variants object) is all the isolation
    // this computed needs — a deep clone would copy the full icon map per
    // themed component instance.
    const state: ThemeState<Theme> = { ...context, variants: { ...context.variants } }

    if (name) {
      state.name = name
    }

    if (mode) {
      state.mode = resolveMode(mode)
    }

    if (pen || pencil || paper) {
      let { pen: statePen, pencil: statePencil, paper: statePaper } = state

      if (pen) {
        statePen = resolveColor(pen, state)
      }

      if (pencil) {
        statePencil = resolveColor(pencil, state)
      }

      if (paper) {
        statePaper = resolveColor(paper, state)
      }

      state.pen = statePen
      state.pencil = statePencil
      state.paper = statePaper
    }

    if (contrast !== undefined) {
      state.contrast = contrast
    }

    if (reducedMotion !== undefined) {
      state.reducedMotion = reducedMotion
    }

    if (text) {
      state.text = text
    }

    if (textThemeClasses) {
      state.textThemeClasses = textThemeClasses
    }

    if (variants) {
      for (const key in variants) {
        const variant = variants[key as Variant]
        if (variant) {
          state.variants[key] = resolveColor(variant, state)
        }
      }
    }

    if (icons) {
      state.icons = {
        ...state.icons,
        ...icons,
      }
    }

    for (const key in state.variants) {
      const variant = (props as Record<Variant, ColorProp<Theme>>)[key as Variant]
      if (variant) {
        state.variants[key] = resolveColor(toValue(variant), state)
      }
    }

    if (scale !== undefined) {
      state.scale = resolveScale(scale)
    }

    if (relativeScale !== undefined) {
      state.scale = state.scale * resolveScale(relativeScale)
    }

    if (radiusScale !== undefined) {
      state.radiusScale = resolveRadiusScale(radiusScale)
    }

    if (relativeRadiusScale !== undefined) {
      state.radiusScale = state.radiusScale * resolveRadiusScale(relativeRadiusScale)
    }

    return state
  })

  const updateScale = computed(() => {
    return (
      localState.value.scale !== contextState.value.scale ||
      localState.value.radiusScale !== contextState.value.radiusScale ||
      localState.value.name !== contextState.value.name
    )
  })

  const style = computed<CSSProperties>(() => {
    if (!updateScale.value) {
      return {}
    }

    return {
      '--scale': localState.value.scale,
      '--radius-scale': localState.value.radiusScale,
    }
  })

  const classes = computed<string[]>(() => {
    const classes: string[] = []
    const local = localState.value
    const context = contextState.value

    let applyReset = false
    let applyNamedTheme = false
    let recalculateSemantics = false
    let reapplyColors = false
    let recalculateColors = false
    let applyTextThemes = false

    if (initialize.value) {
      classes.push('utensil-theme')
      applyReset = true
    }

    if (local.name && (local.name !== context.name || initialize.value)) {
      applyNamedTheme = true
      applyReset = true
      reapplyColors = true
    }

    // Check if the variant map has changed
    if (local.variants && (!equals(local.variants, context.variants) || initialize.value)) {
      reapplyColors = true
    }

    if (local.mode !== context.mode || initialize.value) {
      classes.push(`${local.mode}-mode`)
      reapplyColors = true
    }

    if (reapplyColors || local.pen !== context.pen || initialize.value) {
      // Workaround: Vue SFC compiler changes pen to a Symbol so we call toString()
      classes.push(`${local.pen.toString()}-pen`)
      recalculateColors = true
    }

    if (reapplyColors || local.pencil !== context.pencil || initialize.value) {
      // Workaround: Vue SFC compiler changes pencil to a Symbol so we call toString()
      classes.push(`${local.pencil.toString()}-pencil`)
      recalculateColors = true
    }

    if (reapplyColors || local.paper !== context.paper || initialize.value) {
      // Workaround: Vue SFC compiler changes paper to a Symbol so we call toString()
      classes.push(`${local.paper.toString()}-paper`)
      recalculateColors = true
    }

    if (local.text !== context.text || !equals(local.textThemeClasses, context.textThemeClasses) || initialize.value) {
      applyReset = true
      applyNamedTheme = true
      applyTextThemes = true
      recalculateColors = true
    }

    // Apply text themes on color recalc as they are dependant
    if (recalculateColors) {
      applyTextThemes = true
    }

    if (recalculateColors && local.contrast == 'high') {
      classes.push('utensil-high-contrast')
    }

    if (recalculateColors && local.reducedMotion == 'reduced') {
      classes.push('utensil-reduced-motion')
    }

    if (recalculateColors || initialize.value) {
      classes.push('utensil-mode')
      recalculateSemantics = true
    }

    if (updateScale.value || initialize.value) {
      recalculateSemantics = true

      if (local.radiusScale >= 3) {
        classes.push('utensil-rounded')
      } else {
        classes.push('utensil-squared')
      }
    }

    if (applyTextThemes) {
      if (local.textThemeClasses[local.text]) {
        classes.push(local.textThemeClasses[local.text])
        applyReset = true
      }
    }

    if (applyReset) {
      classes.unshift('utensil-reset')
    }

    if (applyNamedTheme && local.name) {
      classes.unshift(`${local.name}-theme`)
    }

    if (recalculateSemantics || initialize.value) {
      classes.push('utensil-calculate')
    }

    return classes
  })

  function resolveColor<Theme extends ThemeConfig>(value: ColorProp<Theme>, state: ThemeState<Theme>): Color<Theme> {
    if ('pen' == value) {
      return state.pen
    }

    if ('pencil' == value) {
      return state.pencil
    }

    if ('paper' == value) {
      return state.paper
    }

    if (state.variants && state.variants[value as Variant<Theme>]) {
      return state.variants[value as Variant<Theme>] as Color<Theme>
    }

    return value as Color<Theme>
  }

  function resolveScale(value?: ScaleProp): number {
    if (undefined == value) {
      return 1
    }

    if (typeof value === 'number') {
      return value
    }

    return scaleMap[value]
  }

  function resolveRadiusScale(value?: RadiusScaleProp): number {
    if (undefined == value) {
      return 1
    }

    if (typeof value === 'number') {
      return value
    }

    return radiusScaleMap[value]
  }

  // Provide the local state to child components
  provide(ThemeStateKey, localState)

  return {
    classes,
    style,
  }
}
