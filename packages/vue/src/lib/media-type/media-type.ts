export type MediaIcon = 'image' | 'video' | 'font' | 'music' | 'file'

export function mediaTypeToIcon(mediaType: string): MediaIcon {
  switch (mediaType) {
    case 'image':
      return 'image'
    case 'video':
      return 'video'
    case 'font':
      return 'font'
    case 'music':
      return 'music'
    default:
      return 'file'
  }
}
