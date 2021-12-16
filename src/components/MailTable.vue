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
          <button @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
  <MailView v-if="openedEmail" :email="openedEmail" />
</template>

<script>
  import { format } from 'date-fns';
  import { ref, computed, reactive } from 'vue';
  import axios from 'axios'

  import MailView from './MailView';

  export default {
    components: {
      MailView
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
      let response = await axios.get('http://localhost:3000/emails');
      emails.value = response.data

      const openEmail = async (email) => {
        email.read = true;
        openedEmail = Object.assign(openedEmail, email);
        await updateEmail(email);
      }

      const archiveEmail = async (email) => {
        email.archived = true;
        await updateEmail(email);
      }

      const updateEmail = async (email) => {
        await axios.put(`http://localhost:3000/emails/${email.id}`, email)
      }

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
        } 
    },
  }
</script>

<style lang="scss" scoped>

</style>