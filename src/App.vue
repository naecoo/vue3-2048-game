<script lang="ts" setup>
import Grid from '@src/components/Grid.vue';
</script>

<template>
  <h1>Vue3 2048 Game </h1>
  <grid />
</template>

<style>
#app {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
