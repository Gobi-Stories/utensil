import { useConfirm } from '@gobistories/utensil-vue/components/dialogs/useConfirm'

export const {
  isOpen: confirmIsOpen,
  title: confirmTitle,
  message: confirmMessage,
  showConfirm: showReferenceConfirm,
  ok: referenceConfirmOk,
  cancel: referenceConfirmCancel,
  closed: referenceConfirmClosed,
} = useConfirm()
