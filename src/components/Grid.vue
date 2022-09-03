<script lang="ts" setup>
import { ref, watch, onUnmounted, onMounted, watchEffect } from 'vue';
import { useGrid, Direction, CellState, CellWithPosition } from '@src/game';


// init
const size = ref(4);
const { cells, score, isEnd, move, undo, init, start } = useGrid(size.value);

// todo: auto resize
const gap = 10;
const cellSise = 92.5;
const getCellStyle = (cell: CellWithPosition) => {
  const { x, y } = cell;

  const ty = (cellSise * y) + (gap * (y + 1));
  const tx = (cellSise * x) + (gap * (x + 1));

  return `top: ${ty}px; left: ${tx}px;`;
};

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
    <div class="row" v-for="row in size" :key="row">
      <div class="cell-placeholder" v-for="col in size" :key="col" />
    </div>

    <div class="cell" v-for="cell in cells" :key="cell.id" :class="{
      [`cell-${cell.value}`]: true,
      'cell-merge': cell.state === CellState.MERGE,
      'cell-new': cell.state === CellState.NEW
    }" :style="getCellStyle(cell)">{{ cell.value }}</div>
  </main>
</template>

<style lang="scss">
@import '../styles/grid.scss';

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
  position: relative;

  .row {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 10px;

    .cell-placeholder {
      flex: 1;
      display: flex;
      border-radius: 6px;
      background-color: #c8bbaf;
    }
  }

  .cell {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 92.5px;
    height: 92.5px;
    font-size: 33px;
    font-weight: bold;
    border-radius: 6px;

    @include buildCellStyle();
  }
}
</style>
