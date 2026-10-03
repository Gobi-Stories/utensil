export interface DemoManifestEntry {
  path: string
  scroll: 'none' | 'vertical' | 'horizontal'
}

export const demoManifest: DemoManifestEntry[] = [
  { path: './demo-components/SignUpFormDemo.vue', scroll: 'none' },
  { path: './demo-components/AudioEqualizerDemo.vue', scroll: 'none' },
  { path: './demo-components/DataVizDemo.vue', scroll: 'none' },
]
