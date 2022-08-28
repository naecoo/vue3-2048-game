import { onMounted, onUnmounted } from 'vue';

export const useWindowResize = (handler: (ev: Event) => void) => {

  onMounted(() => {
    window.addEventListener('resize', handler, false);
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handler, false);
  });
};
