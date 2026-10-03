import { ref } from 'vue'

export function useConfirm() {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const onOk = ref<(() => void) | undefined>()

  function showConfirm(options: { title?: string; message: string; onOk?: () => void }) {
    title.value = options.title ?? ''
    message.value = options.message
    onOk.value = options.onOk
    isOpen.value = true
  }

  function ok() {
    onOk.value?.()
    isOpen.value = false
  }

  function cancel() {
    isOpen.value = false
  }

  function closed() {
    title.value = ''
    message.value = ''
    onOk.value = undefined
  }

  return { isOpen, title, message, showConfirm, ok, cancel, closed }
}
