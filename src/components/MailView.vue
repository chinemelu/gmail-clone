<template>
  <div class="email-display">

    <button @click="emit('toggle-archive')">{{ email.archived ? 'Move to inbox(e)' : 'Archive (e)' }}</button>
    <button @click="emit('toggle-read')">{{ email.read ? 'Mark unread (r)' : 'Mark read(r)' }}</button>
    <button @click="emit('newer-email')">Newer (k)</button>
    <button @click="emit('older-email')">Older (j)</button>

    <h2 class="mb-0">Subject: <strong>{{ email.subject }}</strong></h2>
    <div><em>From {{ email.from }} on {{ format(new Date(email.sentAt), 'MMM do yyyy') }}</em></div>
    <div v-html="marked(email.body)"/>
  </div>
</template>

<script setup>
  import { format } from 'date-fns'
  import marked from 'marked'
  import useKeydown from '../composables/use-keydown'

  const props = defineProps({
    email: {
      type: Object,
      required: true
    },
  })
  
  const emit = defineEmits(['toggle-read', 'older-email', 'newer-email', 'toggle-archive'])

  useKeydown(
    [
      { key: 'r', fn: () => emit('toggle-read')},
      { key: 'j', fn: () => emit('older-email')},
      { key: 'k', fn: () => emit('newer-email')},
      { key: 'e', fn: () => emit('toggle-archive')},
    ])

</script>

<style lang="scss" scoped>

</style>