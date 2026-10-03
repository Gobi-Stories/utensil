export type ColorMode = 'light' | 'dark'

export const colorInstruments = ['pen', 'pencil', 'paper'] as const
export type ColorInstrument = (typeof colorInstruments)[number]
export function validInstrument(value: unknown): value is ColorInstrument {
  return colorInstruments.includes(value as ColorInstrument)
}

export type Scale<T> = [T, T, T, T, T, T, T, T, T, T, T, T]
export type ColorScale = Scale<string>

export type ScaleConfig = {
  scale: ColorScale
  alphaScale: ColorScale
  surface: string
  /** The paper-0 inset step, "below the page": lighter than it in light mode, darker in dark mode. Paper only. */
  inset?: string
}

export type ColorConfig = {
  source: string
  background: string
  standard: ScaleConfig
  wideGamut: ScaleConfig
  contrast: string
}
