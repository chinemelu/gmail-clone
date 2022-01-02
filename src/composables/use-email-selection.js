import { reactive } from 'vue';
import { updateEmail } from './email.js'

let selectedEmails = reactive(new Set());
export const useEmailSelection = () => {
  const toggle = (email) => {
    if (selectedEmails.has(email)) {
      selectedEmails.delete(email)
    } else {
      selectedEmails.add(email)
    }
  }

  const clear = () => {
    selectedEmails.clear();
  }

  const addMultiple = (emails) => {
    emails.forEach(email => selectedEmails.add(email))
  }

  const markAction = (fn) => {
    selectedEmails.forEach((email) => {
      fn(email)
      updateEmail(email)
    })
  }

  const markRead = () => markAction((email) => email.read = true)
  const markUnread = () => markAction((email) => email.read = false)
  const markArchive = () => {
    markAction((email) => email.archived = true)
    clear();
  }

  return {
    emails: selectedEmails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    markArchive
  }
}