<template>
  <div class="email-display">
    <h2 class="mb-0">Subject: <strong>{{ email.subject }}</strong></h2>
    <div><em>From {{ email.from }} on {{ format(new Date(email.sentAt), 'MMM do yyyy') }}</em></div>
    <div v-html="marked(email.body)"/>
  </div>
</template>

<script setup>
  import { format } from 'date-fns'
  import marked from 'marked'

  const props = defineProps({
    email: {
      type: Object,
      required: true
    },
  })
</script>

<style lang="scss" scoped>

</style>