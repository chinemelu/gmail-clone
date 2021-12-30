import { reactive } from 'vue';

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

  return {
    emails: selectedEmails,
    toggle,
    clear,
    addMultiple
  }
}