import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { utensilIconMap, type ExtractIconMap } from '@gobistories/utensil-vue/theme/utensil-icons'

export const acmeIconMap = {
  ...utensilIconMap,
  trash: faTrash,
}

export type AcmeIcons = ExtractIconMap<typeof acmeIconMap>
