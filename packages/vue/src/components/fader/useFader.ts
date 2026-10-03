import { computed, onMounted, ref, watch } from 'vue'

type UseFaderProps = {
  delay?: number
  speed?: 'slow' | 'normal' | 'fast'
}

export function useFader(props?: UseFaderProps) {
  const { delay: delay = 0, speed: speed = 'normal' } = props || {}

  const show = ref(false)
  const willFade = ref(!props?.delay)
  const enableFade = ref(false)
  const cancelFade = ref(false)

  onMounted(() => {
    if (props?.delay) {
      setTimeout(() => {
        willFade.value = true
      }, delay)
    }
  })

  watch(show, () => {
    if (!willFade.value) {
      cancelFade.value = true
    } else {
      enableFade.value = true
    }
  })

  const classes = computed<string>(() => {
    const classes = ['utensil-fade-in-pending']

    if (enableFade.value) {
      classes.push(`utensil-fade-in-${speed}`)
    }

    if (cancelFade.value) {
      classes.push('utensil-fade-in-cancel')
    }

    return classes.join(' ')
  })

  const outClasses = computed<string>(() => {
    const classes = ['utensil-fade-out-pending']

    if (enableFade.value) {
      classes.push(`utensil-fade-out-${speed}`)
    }

    if (cancelFade.value) {
      classes.push('utensil-fade-out-cancel')
    }

    return classes.join(' ')
  })

  return {
    show,
    classes,
    outClasses,
  }
}
