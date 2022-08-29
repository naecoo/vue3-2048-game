<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { useGrid, Direction } from './game';

const { gridData, score, isEnd, move, undo, init, start } = useGrid(4);
start();

const onMove = (event: KeyboardEvent) => {
  if (isEnd.value) return;

  console.log(event);
  console.log();
  switch (event.code) {
    case 'ArrowUp':
      move(Direction.UP);
      break;

    case 'ArrowDown':
      move(Direction.DOWN);
      break;

    case 'ArrowLeft':
      move(Direction.LEFT);
      break;

    case 'ArrowRight':
      move(Direction.RIGHT);
      break;
  }
};
window.addEventListener('keydown', onMove, false);
onUnmounted(() => {
  window.removeEventListener('keydown', onMove, false);
});
</script>


<template>
  <h1> The 2048 Game </h1>
  <p>
    score: {{ score }}
  </p>
  <p>
    isEnd: {{ isEnd }}
  </p>
  <main class="game-grid">
    <div class="row" v-for="(row, rowIndex) in gridData" :key="rowIndex">
      <div class="cell" v-for="(col, colIndex) in row" :key="colIndex">
        {{ col || void 0 }}
      </div>
    </div>
  </main>
</template>

<style lang="less">
.game-grid {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;

  .row {
    flex: 1;
    display: flex;
    flex-direction: row;

    .cell {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      border: 1px solid #ccc;
    }
  }
}
</style>
