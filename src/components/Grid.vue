<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { useGrid, Direction } from '@src/game';

const { gridData, score, isEnd, move, undo, init, start } = useGrid(4);
start();

const onMove = (event: KeyboardEvent) => {
  if (isEnd.value) return;

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
  <p>
    score: {{ score }}
  </p>
  <p>
    isEnd: {{ isEnd }}
  </p>
  <p>
    <button @click="undo">undo</button>
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
  gap: 10px;
  width: 400px;
  height: 400px;
  padding: 10px;
  background-color: #bbada0;
  border-radius: 6px;

  .row {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 10px;

    .cell {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 33px;
      font-weight: bold;
      background: #c8bbaf;
      color: #5e554c;
      border-radius: 6px;
    }
  }
}
</style>
