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

<style lang="less">
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

      @media (prefers-reduced-motion: no-preference) {
        &.cell-new {
          animation: appear 300ms ease 100ms;
          animation-fill-mode: backwards;
        }

        &.cell-merge {
          animation: pop 200ms ease-in 100ms;
          animation-fill-mode: backwards;
        }
      }

      @keyframes appear {
        0% {
          opacity: 0;
          transform: scale(0);
        }

        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes pop {
        0% {
          transform: scale(0);
        }

        50% {
          transform: scale(1.2);
        }

        100% {
          transform: scale(1);
        }
      }
    }
  }
}
</style>

<style lang="less">

// todo: 生成2-32768的样式
@tile-color: #eee4da;
@tile-gold-color: #edc22e;
@tile-gold-glow-color: lighten($tile-gold-color, 15%);
@bright-text-color: #f9f6f2;
@base: 2;
@exponent: 1;
@limit: 15;

each(range(@exponent, @limit), {
  @power: pow(@base, @index);

  .col-@{power} {

    @gold-percent: (@index - 1) / (@limit - 1) * 100;
    @mixed-background: mix(@tile-gold-color, @tile-color, @gold-percent);

    // & when(@n >= 128) {
    //   box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0),
    //   inset 0 0 0 1px hsla(0, 0%, 100%, 0);
    // }
  }
})



.cell {
  background: #c8bbaf;
  color: #5e554c;
}

.cell-2,
.cell-4 {
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0);
}

.cell-2 {
  background: #eee4da;
}

.cell-4 {
  background: #eee2ce;
}

.cell-8 {
  color: #f9f6f2;
  background: #f3b27e;
}

.cell-16 {
  color: #f9f6f2;
  background: #f6976b;
}

.cell-32 {
  color: #f9f6f2;
  background: #f77e68;
}

.cell-64 {
  color: #f9f6f2;
  background: #f76147;
}

.cell-128 {
  color: #f9f6f2;
  background: #eed590;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.151515),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.0909091);
}

.cell-256 {
  color: #f9f6f2;
  background: #eed384;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.20202),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.121212);
}

.cell-512 {
  color: #f9f6f2;
  background: #edd178;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.252525),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.151515);
}

.cell-1024 {
  color: #f9f6f2;
  background: #edce6b;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.30303),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.181818);
}

.cell-2048 {
  color: #f9f6f2;
  background: #edcc5f;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.353535),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.212121);
}

.cell-4096 {
  color: #f9f6f2;
  background: #edc953;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.40404),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.242424);
}

.cell-8192 {
  color: #f9f6f2;
  background: #edc747;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.454545),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.272727);
}

.cell-16384 {
  color: #f9f6f2;
  background: #edc43a;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.505051),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.30303);
}

.cell-32768 {
  color: #f9f6f2;
  background: #edc22e;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.555556),
    inset 0 0 0 1px hsla(0, 0%, 100%, 0.333333);
}
</style>
