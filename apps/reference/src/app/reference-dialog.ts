import { useDialog } from 'utensil-vue/components/dialogs/useDialog'

export const {
  isOpen: dialogIsOpen,
  title: dialogTitle,
  message: dialogMessage,
  showDialog: showReferenceDialog,
  ok: referenceDialogOk,
  close: referenceDialogClose,
  closed: referenceDialogClosed,
} = useDialog()
