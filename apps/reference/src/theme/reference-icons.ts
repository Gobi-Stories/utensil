import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faCut } from '@fortawesome/free-solid-svg-icons/faCut'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faList } from '@fortawesome/free-solid-svg-icons/faList'
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import { faBold } from '@fortawesome/free-solid-svg-icons/faBold'
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic'
import { faUnderline } from '@fortawesome/free-solid-svg-icons/faUnderline'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons/faAlignLeft'
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons/faAlignCenter'
import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette'
import { faSwatchbook } from '@fortawesome/free-solid-svg-icons/faSwatchbook'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons/faLayerGroup'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons/faMicrophone'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook'
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons/faPhotoFilm'
import { faTableCells } from '@fortawesome/free-solid-svg-icons/faTableCells'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase'
import { faListCheck } from '@fortawesome/free-solid-svg-icons/faListCheck'
import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons/faArrowsUpDown'
import { faWindowMaximize } from '@fortawesome/free-solid-svg-icons/faWindowMaximize'
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench'
import { faMessage } from '@fortawesome/free-solid-svg-icons/faMessage'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faChartColumn } from '@fortawesome/free-solid-svg-icons/faChartColumn'
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons/faPuzzlePiece'
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt'

import { utensilIconMap, type ExtractIconMap } from 'utensil-vue/theme/utensil-icons'
import { faAlignRight } from '@fortawesome/free-solid-svg-icons'

export const referenceIconMap = {
  ...utensilIconMap,
  'align-left': faAlignLeft,
  'align-center': faAlignCenter,
  'align-right': faAlignRight,
  'arrows-up-down': faArrowsUpDown,
  'chevron-down': faChevronDown,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'ellipsis-v': faEllipsisV,
  'check-circle': faCheckCircle,
  'exclamation-circle': faExclamationCircle,
  'info-circle': faInfoCircle,
  'layer-group': faLayerGroup,
  'list-check': faListCheck,
  'photo-film': faPhotoFilm,
  'share-alt': faShareAlt,
  'table-cells': faTableCells,
  'trash-alt': faTrashAlt,
  'window-maximize': faWindowMaximize,
  bold: faBold,
  book: faBook,
  'chart-column': faChartColumn,
  code: faCode,
  copy: faCopy,
  cubes: faCubes,
  cut: faCut,
  database: faDatabase,
  download: faDownload,
  edit: faEdit,
  folder: faFolder,
  home: faHome,
  info: faInfo,
  italic: faItalic,
  keyboard: faKeyboard,
  list: faList,
  message: faMessage,
  microphone: faMicrophone,
  palette: faPalette,
  paste: faPaste,
  play: faPlay,
  'puzzle-piece': faPuzzlePiece,
  reactivity: faBolt,
  spinner: faSpinner,
  square: faSquare,
  swatchbook: faSwatchbook,
  trash: faTrash,
  underline: faUnderline,
  user: faUser,
  wrench: faWrench,
}

export type ReferenceIcons = ExtractIconMap<typeof referenceIconMap>
export type ReferenceIcon = keyof ReferenceIcons
