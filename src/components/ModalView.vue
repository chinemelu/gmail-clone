<template>
  <!-- <div class="modal" @click="emit('closeModal')"> -->
  <div class="modal">
    <div class="overlay" @click="$emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>


<script>
import { onBeforeUnmount } from 'vue';
export default {
  emits: ['closeModal'],
  setup(props, { emit }) {
    const onKeydown = (event) => {
      if (event.key === 'Escape') {
        emit('closeModal');
      }
    }
    
    window.addEventListener('keydown', onKeydown)

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeydown);
    })
  }
}
</script> 

<style lang="scss" scoped>

</style>