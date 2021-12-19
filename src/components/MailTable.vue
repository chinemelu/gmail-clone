<template>
  <table class="mail-table">
    <tbody>
      <tr 
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="[email.read ? 'read' : '', 'clickable']"
        @click="openEmail(email)"
      >
        <td>
          <input type="checkbox" />
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
  <ModalView v-if="openedEmail.id" @closeModal="onModalClose">
    <MailView 
      @toggle-read="toggleRead" 
      @toggle-archive="toggleArchive" 
      :email="openedEmail" 
      
    />
  </ModalView>
</template>

<script>
  import { format } from 'date-fns';
  import { ref, computed, reactive } from 'vue';
  import axios from 'axios';
  import { updateEmail, fetchEmails, toggleEmailProperty } from '../composables/email';

  import MailView from './MailView';
  import ModalView from './ModalView';

  export default {
    components: {
      MailView,
      ModalView
    },
    async setup() {
      let emails = ref([])
      let openedEmail = reactive({
        id : null,
        from: "",
        subject: "",
        body: "",
        sentAt: new Date(),
        archived: false,
        read: true
      })

      emails.value = await fetchEmails();

      const openEmail = async (email) => {
        email.read = true
        // this assigns openedEmail variable to the email variable and makes it reactive
        openedEmail = Object.assign(openedEmail, email);
        await updateEmail(email);
      }

      const archiveEmail = async (email) => {
        email.archived = true;
        await updateEmail(email);
      }

      const onModalClose = async () => {
        await updateEmail(openedEmail);
        openedEmail.id = null
        emails.value = await fetchEmails()
      }

      const toggleRead = async () =>  await toggleEmailProperty({ emails, email: openedEmail, property: 'read' })
      const toggleArchive = async () => await toggleEmailProperty({ emails, email: openedEmail, property: 'archive' })

      const sortedEmails = computed(() => {
         return emails.value.sort((e1, e2) => {
          return e1.sentAt < e2.sentAt ? 1 : - 1   
        })
      })
      const unarchivedEmails = computed(() => {
        return sortedEmails.value.filter(email => !email.archived)
      })

      return {
          format,
          emails,
          openEmail,
          sortedEmails,
          archiveEmail,
          unarchivedEmails,
          updateEmail,
          openedEmail,
          toggleRead,
          onModalClose,
          toggleArchive,
        } 
    },
  }
</script>

<style lang="scss" scoped>

</style>