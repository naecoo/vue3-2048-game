<script lang="ts" setup>
import { ref, watch, onUnmounted, onMounted, computed } from 'vue';
import { useGrid, Direction, CellState, CellWithPosition } from '@src/game';
import { useLocalStorage } from '@src/utils';
import Heading from '@src/components/Heading.vue';


// init
const size = ref(4);

const { cells, score, isEnd, move, undo, init, start } = useGrid(size.value);

const { setItem, getItem } = useLocalStorage();
const storageKey = computed(() => `size${size.value}_best`);
const bestScore = ref(getItem(storageKey.value) ?? 0);

const scoreDiff = ref(0);
watch(score, (newVal, oldVal) => {
  scoreDiff.value = newVal - oldVal;
  // todo: show score change

  // update best score
  if (newVal > bestScore.value) {
    bestScore.value = newVal;
    setItem(storageKey.value, bestScore.value);
  }
});

const gap = 8;
const gridSize = ref(0);
const cellSize = computed(() => {
  return (gridSize.value - ((size.value + 1) * gap)) / size.value;
});
const gridStyle = computed(() => {
  return `
    display: grid;
    grid-template-columns: repeat(${size.value}, 1fr);
    grid-template-rows: repeat(${size.value}, 1fr);
    gap: ${gap}px;
    padding: ${gap}px;
  `;
});
const getCellStyle = (cell: CellWithPosition) => {
  const { x, y } = cell;
  const width = cellSize.value;

  const ty = (width * y) + (gap * (y + 1));
  const tx = (width * x) + (gap * (x + 1));

  return `width: ${width}px; height: ${width}px; top: ${ty}px; left: ${tx}px;`;
};

// watch size change
const handleSizeChange = (event: Event) => {
  bestScore.value = getItem(storageKey.value) ?? 0;
  init(size.value);
  start();
  (event.target as HTMLSelectElement).blur();
}

// event
const gridRef = ref<HTMLElement>();
let touchStartX: number = 0;
let touchStartY: number = 0;
let playing = false;
let observer: ResizeObserver;

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

const onKeydown = (event: KeyboardEvent) => {
  if (playing) return;
  playing = true;

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
};
const onKeyup = () => {
  playing = false;
};

onMounted(() => {
  document.addEventListener('keydown', onKeydown, false);
  document.addEventListener('keyup', onKeyup, false);

  if (gridRef.value) {
    const el = gridRef.value
    el.addEventListener('touchstart', onTouchStart, false);
    el.addEventListener('touchmove', onTouchMove, false);
    el.addEventListener('touchend', onTouchEnd, false);
    observer = new ResizeObserver(() => {
      gridSize.value = el.clientWidth;
    });
    observer.observe(el);
  }

});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown, false);
  document.removeEventListener('keyup', onKeyup, false);

  if (gridRef.value) {
    const el = gridRef.value
    el.removeEventListener('touchstart', onTouchStart, false);
    el.removeEventListener('touchmove', onTouchMove, false);
    el.removeEventListener('touchend', onTouchEnd, false);
    observer.disconnect();
  }
});

const handleNewGame = () => {
  init();
  start();
};


// start game
start();
</script>

<template>
  <div class="grid">
    <header class="grid-header">
      <Heading :score="score" :best-score="bestScore" />

      <div class="controls">
        <div class="select-wrapper">
          <label class="label" for="select">SIZE:</label>
          <select class="select" id="select" v-model.number="size" @change="handleSizeChange">
            <template v-for="i in 9" :key="i">
              <option class="option" v-if="i > 1" :value="i">{{ i }}</option>
            </template>
          </select>
        </div>
        <div class="btns">
          <button class="btn" @click="handleNewGame">New Game</button>
          <button class="btn" @click="undo">Undo</button>
        </div>
      </div>
    </header>

    <main class="grid-main" ref="gridRef" :style="gridStyle">
      <!-- cell placeholder -->
      <div class="cell-placeholder" v-for="i in size * size" :key="i" />

      <!-- cells -->
      <div class="cell" v-for="cell in cells" :key="cell.id" :class="{
        [`cell-${cell.value}`]: true,
        'cell-merge': cell.state === CellState.MERGE,
        'cell-new': cell.state === CellState.NEW
      }" :style="getCellStyle(cell)">{{ cell.value }}</div>

      <!-- dialog wrapper -->
      <transition name="fade">
        <div v-show="isEnd" class="dialog">
          <p class="text">Game Over!</p>
        </div>
      </transition>
    </main>
  </div>
</template>

<style lang="scss">
@import '../styles/grid.scss';

.grid {
  margin-top: 40px;
}

.grid-header {
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;

    .select-wrapper {
      display: flex;
      align-items: center;

      .label {
        font-size: 14px;
      }

      .select {
        display: inline-block;
        width: 40px;
        margin-inline-start: 8px;
      }
    }

    .btns {
      .btn {
        padding: 8px 16px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        border-radius: 4px;
        color: rgb(249, 246, 242);
        background: rgb(143, 122, 102);
        border: none;
        outline: none;
        cursor: pointer;

        &:last-child {
          margin-inline-start: 10px;
        }
      }
    }
  }
}

.grid-main {
  width: 400px;
  height: 400px;
  margin-top: 12px;

  background-color: #bbada0;
  border-radius: 6px;
  resize: none;
  user-select: none;
  position: relative;

  .cell-placeholder {
    border-radius: 6px;
    background-color: #c8bbaf;
  }

  .cell {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 33px;
    font-weight: bold;
    border-radius: 6px;
    // todo: cell font-size media query

    @include buildCellStyle();
  }

  .dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background: rgba(238, 228, 218, 0.73);

    .text {
      font-size: 3em;
      font-weight: bold;
      transform: translateY(-20px);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
