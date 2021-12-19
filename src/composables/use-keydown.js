import { onBeforeUnmount } from 'vue';

const useKeydown  = (keyCombos) => {
  const onKeydown = (event) => {
    const kc = keyCombos.find(keyCombo => event.key === keyCombo.key)
    if (kc) {
      kc.fn()
    }
  }

  window.addEventListener('keydown', onKeydown)

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
  })
}

export default useKeydown;
