import type { Router } from 'vue-router'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'
import { ref } from 'vue'

// Tracks whether a route navigation is in flight (lazy chunks and guards resolving), for page
// loading indicators such as the app loading strip.
export interface RouteLoading {
  loading: Ref<boolean>
}

// A navigation that settles within the delay — cached chunks, synchronous guards — never
// registers as loading; only navigations that actually wait on a fetch show the strip.
export function routeLoading(router: Router, showDelay = 100): RouteLoading {
  const loading = ref(false)
  let showTimer: ReturnType<typeof setTimeout> | undefined

  function settle() {
    clearTimeout(showTimer)
    showTimer = undefined
    loading.value = false
  }

  router.beforeEach(() => {
    // A redirect mid-delay continues the original timer rather than restarting it
    showTimer ??= setTimeout(() => (loading.value = true), showDelay)
  })

  router.afterEach(settle)
  router.onError(settle)

  return { loading }
}

let _routeLoading: RouteLoading | undefined

function getRouteLoading(router: Router): RouteLoading {
  if (!_routeLoading) {
    _routeLoading = routeLoading(router)
  }

  return _routeLoading
}

// Shared reactive state derived from the active router; no I/O, so a lazy singleton behind a use*
// accessor is enough. The router comes from the calling component's context.
export function useRouteLoading(): RouteLoading {
  return getRouteLoading(useRouter())
}
