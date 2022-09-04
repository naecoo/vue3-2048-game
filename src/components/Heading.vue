<script lang="ts" setup>
import { watchEffect, ref } from 'vue';

const props = defineProps<{
  score: number;
  scoreIncrement: { value: number; };
  bestScore: number;
}>();

const increment = ref(0);
let timer: ReturnType<typeof setTimeout>
watchEffect(() => {
  const diff = props.scoreIncrement.value;
  if (diff <= 0) return;

  increment.value = props.scoreIncrement.value;
  clearTimeout(timer);
  timer = setTimeout(() => {
    increment.value = 0;
  }, 500);
});

</script>

<template>
  <div class="heading">
    <h1 class="title">2048</h1>
    <div class="scores">
      <div class="score score-now">
        <p class="label">{{ $t('message.score') }}</p>
        <p class="value">{{ props.score }}</p>
        <span v-if="increment > 0" class="score-increment">+{{ increment }}</span>
      </div>
      <div class="score">
        <p class="label">{{ $t('message.best_score') }}</p>
        <p class="value">{{ props.bestScore }}</p>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
@import '../styles/grid.scss';

.heading {
  display: flex;
  justify-content: space-between;

  .title {
    margin: 0;
    font-size: 4em;

    @include smaller(500px) {
      font-size: 3em;
    }
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

      @include smaller(720px) {
        padding: 2px 4px;
      }

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

    .score-now {
      position: relative;

      .score-increment {
        position: absolute;
        top: 0;
        left: 20px;
        z-index: 100;
        font-size: 2em;
        font-weight: bold;
        animation: popup 500ms linear;
        animation-fill-mode: forwards;
      }

      @keyframes popup {
        0% {
          opacity: 0.5;
          transform: translateY(30px);
        }

        50% {
          opacity: 1;
          transform: translateY(0);
        }

        100% {
          opacity: 0;
          transform: translateY(-30px);
        }
      }
    }
  }
}
</style>
