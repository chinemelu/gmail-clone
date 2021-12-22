<template>
  <div class="email-display">

    <button @click="toggleArchive">{{ email.archived ? 'Move to inbox(e)' : 'Archive (e)' }}</button>
    <button @click="toggleRead">{{ email.read ? 'Mark unread (r)' : 'Mark read(r)' }}</button>
    <button @click="goNewer">Newer (k)</button>
    <button @click="goOlder">Older (j)</button>

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
  
  const emit = defineEmits(['changeEmail'])

  const toggleRead = () => {
    emit('changeEmail', { readEmail: true, saveEmail: true })
  }

  const toggleArchive = () => {
    emit('changeEmail', { archiveEmail: true, saveEmail: true, closeModal: true })
  }

  const goNewer = () => {
    emit('changeEmail', { changeIndex: -1 })
  }

  const goOlder = () => {
    emit('changeEmail', { changeIndex: 1 })
  }

  const goNewerAndArchive = () => {
    emit('changeEmail', { changeIndex: 1, toggleArchive: true, saveEmail: true })
  }

  const goOlderAndArchive = () => {
    emit('changeEmail', { changeIndex: 1, toggleArchive: true, saveEmail: true })
  }

  useKeydown(
    [
      { key: 'r', fn: toggleRead },
      { key: 'j', fn: goOlder },
      { key: 'k', fn: goNewer },
      { key: 'e', fn: toggleArchive },
      { key: '[', fn: goNewerAndArchive },
      { key: ']', fn: goOlderAndArchive },
    ])

</script>

<style lang="scss" scoped>

</style>