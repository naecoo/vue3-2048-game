<script lang="ts" setup>
import { ref, watch, onUnmounted, onMounted } from 'vue';
import { useGrid, Direction } from '@src/game';

const { gridData, score, isEnd, move, undo, init, start } = useGrid(4);


const scoreDiff = ref(0);
watch(score, (newVal, oldVal) => {
  scoreDiff.value = newVal - oldVal;
  // todo: show score change
});


// event
const gridRef = ref<HTMLElement>();
let touchStartX: number = 0;
let touchStartY: number = 0;

const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
};

const onTouchMove = (event: TouchEvent) => {
  event.preventDefault();
};

const onTouchEnd = (event: TouchEvent) => {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;

  const dx = Math.abs(touchEndX - touchStartX);
  const dy = Math.abs(touchEndY - touchStartY);

  if (Math.max(dx, dy) <= 10) return;

  if (dx > dy) {
    touchEndX > touchStartX ? move(Direction.RIGHT) : move(Direction.LEFT);
  } else {
    touchEndY > touchStartY ? move(Direction.DOWN) : move(Direction.UP);
  }
};

const onMove = (event: KeyboardEvent) => {
  const modifier =
    event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

  if (isEnd.value || modifier) return;

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

  event.preventDefault();
};

onMounted(() => {
  gridRef.value?.addEventListener('touchstart', onTouchStart, false);
  gridRef.value?.addEventListener('touchmove', onTouchMove, false);
  gridRef.value?.addEventListener('touchend', onTouchEnd, false);
  document.addEventListener('keydown', onMove, false);
});

onUnmounted(() => {
  gridRef.value?.removeEventListener('touchstart', onTouchStart, false);
  gridRef.value?.removeEventListener('touchmove', onTouchMove, false);
  gridRef.value?.removeEventListener('touchend', onTouchEnd, false);
  document.removeEventListener('keydown', onMove, false);
});


// start game
start();
</script>

<template>
  <p>score: {{ score }}</p>
  <p>isEnd: {{ isEnd }}</p>
  <p>
    <button @click="undo">undo</button>
  </p>
  <main class="grid-container" ref="gridRef">
    <div class="row" v-for="(row, rowIndex) in gridData" :key="rowIndex">
      <div class="cell" v-for="(cell, cellIndex) in row" :key="cellIndex" :class="{
        [`cell-${cell.value}`]: true,
        'cell-merge': cell.merge,
        'cell-new': cell.new,
      }">
        {{ cell.value || void 0 }}
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import '../styles/style.scss';

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
  height: 400px;
  padding: 10px;
  background-color: #bbada0;
  border-radius: 6px;
  resize: none;
  user-select: none;

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
      border-radius: 6px;
      background-color: #c8bbaf;
      color: #5e554c;
      // transition: 100ms ease-in-out;
      // animation-fill-mode: backwards;
      @include buildCellStyle();
    }
  }
}
</style>
