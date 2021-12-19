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
import useKeydown from "../composables/use-keydown"
export default {
  emits: ['closeModal'],
  setup(props, { emit }) {
    useKeydown([{ key: 'Escape', fn: () => emit('closeModal')  }])
  }
}
</script> 

<style lang="scss" scoped>

</style>