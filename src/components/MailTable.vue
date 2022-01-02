<template>
  <button
    @click="selectInboxEmails"
    :disabled="selectedScreen === 'inbox'"
  >Inbox</button>
  <button
    @click="selectArchivedEmails"
    :disabled="selectedScreen === 'archive'"
  >Archived</button>
  <BulkActionBar  :emails="filteredEmails"/>
  <table class="mail-table">
    <tbody>
      <tr 
        v-for="email in filteredEmails"
        :key="email.id"
        :class="[email.read ? 'read' : '', 'clickable']"
        @click="openEmail(email)"
      >
        <td>
          <input 
            type="checkbox" 
            @click.stop="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)"
          />
        </td>
        <td> 
          {{ email.from }}
        </td>
        <td> 
          <p><strong>{{ email.subject }}</strong> - {{ email.body }} </p>
        </td>
        <td class="date"> {{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
        <td>
          <button @click.stop="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="onModalClose">
    <MailView 
      @changeEmail="changeEmail"
      :email="openedEmail" 
    />
  </ModalView>
</template>

<script>
  import { format } from 'date-fns';
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import { updateEmail, fetchEmails, toggleEmailProperty } from '../composables/email';
  import { useEmailSelection } from '../composables/use-email-selection';
  import BulkActionBar from '../components/BulkActionBar.vue'

  import MailView from './MailView';
  import ModalView from './ModalView';

  export default {
    components: {
      MailView,
      ModalView,
      BulkActionBar
    },
    async setup() {
      let emails = ref([]);
      
      let openedEmail = ref(null);

      let selectedScreen = ref('inbox');
      
      const useEmailSelection = useEmailSelection()

      emails.value = await fetchEmails();

      const openEmail = async (email) => {
        // if there is an email when the navigation buttons or shortcut keys for the navigation buttons are pressed,
        // let the email be read and become the openedEmail
        if (email) {
          email.read = true
          // this assigns openedEmail variable to the email variable and makes it reactive
          // equivalent of this.openedEmail = this.email
          openedEmail.value =  email
          await updateEmail(email);
          return
        }
        // else close the modal
        openedEmail.value = null
      }

      const archiveEmail = async (email) => {
        email.archived = true;
        await updateEmail(email);
      }

      const onModalClose = async () => {
        // await updateEmail(openedEmail.value);
        openedEmail.value = null
        // emails.value = await fetchEmails()
      }

      const changeEmail = ({ archiveEmail, saveEmail, readEmail, closeModal, changeIndex }) => {
        /** Example equivalent of this.email = this.openedEmail
        in this example, openedEmail was a reactive;
        let openedEmail = reactive({
          id: null,
          from: "",
          subject": "",
          "body": "",
          "sentAt": new Date(),
          "archived": false,
          "read": false
        })
        let email = {}
        // openedEmail is the target and email is an empty object with properties that will be applied to openedEmail
        // openedEmail will be returned
        email = Object.assign(openedEmail, email); // works
        debugger;

        **/

        // second example equivalent of this.email = this.openedEmail

        const email = ref({})

        email.value = openedEmail.value

        if (readEmail) { email.value.read = !email.value.read }

        if (archiveEmail) { email.value.archived = !email.value.archived }

        if (saveEmail) { updateEmail(email.value) }

        if (closeModal) { email.value = null }

        if (changeIndex) {
          // debugger;
          const currentEmailIndex = filteredEmails.value.indexOf(openedEmail.value);
          let newEmail = emails.value[currentEmailIndex + changeIndex];
          openEmail(newEmail);
        }
      }

      

      // const toggleRead = async () =>  await toggleEmailProperty({ emails, email: openedEmail, property: 'read' })
      // const toggleArchive = async () => await toggleEmailProperty({ emails, email: openedEmail, property: 'archive' })

      const sortedEmails = computed(() => {
         return emails.value.sort((e1, e2) => {
          return e1.sentAt < e2.sentAt ? 1 : - 1   
        })
      })
      const filteredEmails = computed(() => {
        if (selectedScreen.value === 'inbox') {
          return sortedEmails.value.filter(email => !email.archived)
        }
        return  sortedEmails.value.filter(email => email.archived)
      })

      const selectInboxEmails = () => {
        selectedScreen.value = 'inbox';
        useEmailSelection
      }
      const selectArchivedEmails = () => {
        selectedScreen.value = 'archive'
      }

      // const changeEmail = ({  }) => {
      //   emails.value = await fetchEmails();
      //   await updateEmail(email);
      // }

      return {
        format,
        emails,
        openEmail,
        archiveEmail,
        filteredEmails,
        updateEmail,
        openedEmail,
        onModalClose,
        emailSelection,
        changeEmail,
        selectedScreen,
        selectInboxEmails,
        selectArchivedEmails
      } 
    },
  }
</script>

<style lang="scss" scoped>

</style>