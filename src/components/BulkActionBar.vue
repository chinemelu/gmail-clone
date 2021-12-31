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
      <button>Mark Read</button>
      <button>Mark Unread</button>
      <button>Archive</button>
    </span>
  </div>
</template>

<script>
  import { useEmailSelection } from '../composables/use-email-selection'
  import { computed } from 'vue'
  export default {
    setup(props) {
      const emailSelection = useEmailSelection()
      const numberOfEmails = props.emails.length;
      const numberOfEmailsSelected = computed(() => emailSelection.emails.size);
      const allEmailsSelected = computed(() => numberOfEmails === numberOfEmailsSelected.value)
      const someEmailsSelected = computed(() => numberOfEmailsSelected.value > 0 && numberOfEmailsSelected.value < numberOfEmails)

      const handleBulkAction = () => {
        if (allEmailsSelected.value) {
          emailSelection.clear();
        } else {
          emailSelection.addMultiple(props.emails)
        }
      }

      return {
        allEmailsSelected,
        someEmailsSelected, 
        handleBulkAction
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