<script lang="ts" setup>
const props = defineProps<{
  score: number;
  bestScore: number;
}>();
</script>

<template>
  <div class="heading">
    <h1 class="title">2048</h1>
    <div class="scores">
      <div class="score">
        <p class="label">{{ $t('message.score') }}</p>
        <p class="value">{{ props.score }}</p>
      </div>
      <div class="score">
        <p class="label">{{ $t('message.best_score') }}</p>
        <p class="value">{{ props.bestScore }}</p>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
.heading {
  display: flex;
  justify-content: space-between;

  .title {
    margin: 0;
    font-size: 4em;
  }

  .scores {
    display: flex;
    align-items: center;

    .score {
      min-width: 80px;
      padding: 8px 12px;
      font-weight: bold;
      text-align: center;
      border-radius: 4px;
      background: rgb(187, 173, 160);

      &:last-child {
        margin-inline-start: 8px;
      }

      .label {
        margin: 0;
        font-size: 12px;
        color: rgb(238, 228, 218)
      }

      .value {
        margin: 0;
        font-size: 18px;

        color: #fff;
      }
    }
  }
}
</style>
