import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp'
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons/faCirclePlay'
import { faCirclePause } from '@fortawesome/free-solid-svg-icons/faCirclePause'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons/faCircleHalfStroke'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile'
import { faFont } from '@fortawesome/free-solid-svg-icons/faFont'
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic'
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon'
import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette'
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faPlusCircle, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowRightArrowLeft'
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faSwatchbook } from '@fortawesome/free-solid-svg-icons/faSwatchbook'
import { faTag } from '@fortawesome/free-solid-svg-icons/faTag'
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield'
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons/faVolumeHigh'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute'
import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi'

// Used to inject a UtensilIconMap
export const utensilIconMapKey = Symbol('utensil-icon-map')

// Utility type to extract the type from a concrete icon map
export type ExtractIconMap<T extends Record<string, IconDefinition>> = {
  [K in keyof T]: T[K] extends IconDefinition ? IconDefinition : never
}

export const utensilIconMap = {
  ban: faBan,
  bars: faBars,
  calendar: faCalendar,
  cog: faCog,
  check: faCheck,
  'chevron-down': faChevronDown,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'chevron-up': faChevronUp,
  circle: faCircle,
  'circle-half-stroke': faCircleHalfStroke,
  'circle-play': faCirclePlay,
  'circle-pause': faCirclePause,
  'cloud-upload-alt': faCloudUploadAlt,
  copy: faCopy,
  envelope: faEnvelope,
  'exclamation-triangle': faExclamationTriangle,
  eye: faEye,
  'eye-slash': faEyeSlash,
  file: faFile,
  font: faFont,
  hashtag: faHashtag,
  heart: faHeart,
  image: faImage,
  inbox: faInbox,
  lock: faLock,
  music: faMusic,
  moon: faMoon,
  palette: faPalette,
  pause: faPause,
  play: faPlay,
  plus: faPlus,
  'plus-circle': faPlusCircle,
  refresh: faRefresh,
  swap: faArrowRightArrowLeft,
  search: faSearch,
  star: faStar,
  sun: faSun,
  swatchbook: faSwatchbook,
  tag: faTag,
  tags: faTags,
  times: faTimes,
  upload: faUpload,
  'user-shield': faUserShield,
  video: faVideo,
  'volume-high': faVolumeHigh,
  'volume-mute': faVolumeMute,
  wifi: faWifi,
} as const

export type UtensilIcons = ExtractIconMap<typeof utensilIconMap>
export type UtensilIcon = keyof UtensilIcons
