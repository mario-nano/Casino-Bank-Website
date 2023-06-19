import { openDialog } from 'vue3-promise-dialog'
import ConfirmDialog from './ConfirmDialog'
import AdminPrompt from './AdminPassword'

export async function confirm(text) {
  return await openDialog(ConfirmDialog, { text })
}

export async function adminPrompt(text) {
  return await openDialog(AdminPrompt, { text })
}
