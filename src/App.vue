<script lang="ts" setup>
import Switcher from '@src/components/Switcher.vue';
import Grid from '@src/components/Grid.vue';
</script>

<template>
  <switcher />
  <div class="game">
    <grid />
  </div>
</template>

<style lang="scss">
#app {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;

  .game {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>
