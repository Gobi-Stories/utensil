import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { sourceAliases } from '../../scripts/source-aliases'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  // Dev serves the Utensil packages from source for HMR. Builds use the packages' dist output,
  // the same files consumers install, unless UTENSIL_SOURCE=1.
  const fromSource = isDev || process.env.UTENSIL_SOURCE === '1'

  const config: UserConfigExport = {
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ...(fromSource ? sourceAliases : []),
      ],
    },
    plugins: [vue()],
  }

  if (isDev) {
    config.plugins?.push(vueDevTools())

    config.server = {
      host: true,
      port: parseInt(process.env.PORT ?? '12911') || 12911,
      strictPort: true,
      watch: {
        usePolling: !!process.env.USE_POLLING,
      },
    }
  }

  return config
})
