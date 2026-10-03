import type { InjectionKey, Ref } from 'vue'
import type { ScaleProp } from '../../theme/utensil-theme'

export type AvatarVariation = 'solid' | 'soft'
export type AvatarRadius = 'none' | 'small' | 'medium' | 'large' | 'full'

export interface UtensilAvatarStackContext {
  /** Shared radius for all avatars */
  radius: Ref<AvatarRadius>
  /** Shared scale for all avatars */
  scale: Ref<ScaleProp>
}

export const UtensilAvatarStackContextKey: InjectionKey<UtensilAvatarStackContext> = Symbol('UtensilAvatarStackContext')
