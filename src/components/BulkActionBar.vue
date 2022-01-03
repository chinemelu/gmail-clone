<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input 
        type="checkbox" 
        :checked="allEmailsSelected"
        :class="[someEmailsSelected ? 'partial-check' : '']"
        @click="handleBulkAction"
      />
    </span>
    <span class="buttons">
      <button 
        @click="handleMarkRead"
        :disabled="isMarkReadButtonDisabled"
      >Mark Read</button>
      <button
        @click="handleMarkUnread"
        :disabled="isMarkUnreadButtonDisabled"
      >Mark Unread</button>
      <button
        @click="handleMarkArchive"
        :disabled="isMarkArchiveButtonDisabled"
      >Archive</button>
    </span>
  </div>
</template>

<script>
  import { useEmailSelection } from '../composables/use-email-selection'
  import { computed } from 'vue'
  export default {
    setup(props) {
      const emailSelection = useEmailSelection()
      const numberOfEmails = computed(() => props.emails.length);
      const numberOfEmailsSelected = computed(() => emailSelection.emails.size);
      const allEmailsSelected = computed(() => {
        return numberOfEmails.value === numberOfEmailsSelected.value
      })
      const someEmailsSelected = computed(() => numberOfEmailsSelected.value > 0 && numberOfEmailsSelected.value < numberOfEmails.value)

      const handleBulkAction = () => {
        if (allEmailsSelected.value) {
          emailSelection.clear();
        } else {
          emailSelection.addMultiple(props.emails)
        }
      }

      const handleMarkRead = () => {
        emailSelection.markRead()
      }
      const handleMarkUnread = () => {
        emailSelection.markUnread()
      }
      const handleMarkArchive= () => {
        emailSelection.markArchive()
      }

      const thereIsNoSelectedEmail = computed(() => {
        return !emailSelection.emails.size
      })
      
      // convert the set to an array with Array.from
      const isEverySelectedEmailRead = computed(() => Array.from(emailSelection.emails).every((email) => {
        return email.read
      }))
      const isEverySelectedEmailUnread = computed(() => Array.from(emailSelection.emails).every((email) => {
        return !email.read
      }))
      const isMarkReadButtonDisabled = computed(() => {
        return thereIsNoSelectedEmail.value || isEverySelectedEmailRead.value
      })
      const isMarkUnreadButtonDisabled = computed(() => {
        return thereIsNoSelectedEmail.value || isEverySelectedEmailUnread.value
      })
      const isMarkArchiveButtonDisabled = computed(() => {
        return thereIsNoSelectedEmail.value;
      })

      return {
        allEmailsSelected,
        someEmailsSelected, 
        handleBulkAction,
        handleMarkRead,
        handleMarkUnread,
        handleMarkArchive,
        isMarkReadButtonDisabled,
        isMarkUnreadButtonDisabled,
        isMarkArchiveButtonDisabled
      }
    },
    props: {
      emails: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>