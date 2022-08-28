import { computed, ref } from 'vue';


export enum Direction {
  UP = 1,
  DOWN,
  LEFT,
  RIGHT
};
export type GridData = number[][];
type GridHistoryItem = {
  score: number;
  data: GridData;
};

const INIT_VALUE = 2;

const createGridData = (size: number): GridData => new Array(size).fill(null).map(() => new Array(size).fill(0));

const cloneDeep = (data: GridData): GridData => {
  return data.map(row => [...row]);
};

export const useGrid = (size: number) => {
  const score = ref(0);
  const gridData = ref(createGridData(size));
  const history: GridHistoryItem[] = [];

  const hasEmpty = computed(() => gridData.value.some(row => row.some(cell => cell === 0)));
  const isEnd = computed(() => {
    if (hasEmpty.value) {
      return false;
    }

    const grid = gridData.value;
    // vertical
    for (let col = 0; col < size; col++) {
      for (let row = 1; row < size; row++) {
        if (grid[row][col] === grid[row - 1][col]) {
          return false;
        }
      }
    }
    // horizontal
    for (let row = 0; row < size; row++) {
      for (let col = 1; col < size; col++) {
        if (grid[row][col] === grid[row][col - 1]) {
          return false;
        }
      }
    }

    return true;
  });

  const undo = () => {
    if (history.length) {
      const historyItem = history.pop()!;
      gridData.value = historyItem.data;
      score.value = historyItem.score;
    }
  }

  const move = (dir: Direction) => {
    history.push({
      score: score.value,
      data: gridData.value
    });

    const newGridData = cloneDeep(gridData.value);
    let scoreIncrement = 0;

    // todo: optimize，merge & comporess operations in one for loop
    // fixme:
    switch (dir) {
      case Direction.UP:
        // merge
        for (let col = 0; col < size; col++) {
          let prevValue = -1;
          let prevIndex = -1;
          for (let row = 0; row < size; row++) {
            if (newGridData[row][col] !== prevValue) {
              prevValue = newGridData[row][col];
              prevIndex = row;
            } else {
              newGridData[prevIndex][col] += newGridData[row][col];
              newGridData[row][col] = 0;
              scoreIncrement += newGridData[prevIndex][col]
              prevValue = -1;
              prevIndex = -1;
            }
          }
        }
        // compress
        for (let col = 0; col < size; col++) {
          let prevIndex = 0;
          for (let row = 0; row < size; row++) {
            if (newGridData[row][col] !== 0) {
              if (row !== prevIndex) {
                newGridData[prevIndex][col] = newGridData[row][col];
                newGridData[row][col] = 0;
              }
              prevIndex++;
            }
          }
        }
        break;

      case Direction.DOWN:
        // merge
        for (let col = 0; col < size; col++) {
          let prevValue = -1;
          let prevIndex = -1;
          for (let row = size - 1; row >= 0; row--) {
            if (newGridData[row][col] !== prevValue) {
              prevValue = newGridData[row][col];
              prevIndex = row;
            } else {
              newGridData[prevIndex][col] += newGridData[row][col];
              newGridData[row][col] = 0;
              scoreIncrement += newGridData[prevIndex][col]
              prevValue = -1;
              prevIndex = -1;
            }
          }
        }
        // compress
        for (let col = 0; col < size; col++) {
          let prevIndex = size - 1;
          for (let row = size - 1; row >= 0; row--) {
            if (newGridData[row][col] !== 0) {
              if (row !== prevIndex) {
                newGridData[prevIndex][col] = newGridData[row][col];
                newGridData[row][col] = 0;
              }
              prevIndex--;
            }
          }
        }
        break;

      case Direction.LEFT:
        // merge
        for (let row = 0; row < size; row++) {
          let prevValue = -1;
          let prevIndex = -1;
          for (let col = 0; col < size; col++) {
            if (newGridData[row][col] !== prevValue) {
              prevValue = newGridData[row][col];
              prevIndex = row;
            } else {
              newGridData[row][prevIndex] += newGridData[row][col];
              newGridData[row][col] = 0;
              scoreIncrement += newGridData[row][prevIndex]
              prevValue = -1;
              prevIndex = -1;
            }
          }
        }
        // compress
        for (let row = 0; row < size; row++) {
          let prevIndex = 0;
          for (let col = 0; col < size; col++) {
            if (newGridData[row][col] !== 0) {
              if (col !== prevIndex) {
                newGridData[row][prevIndex] = newGridData[row][col];
                newGridData[row][col] = 0;
              }
              prevIndex++;
            }
          }
        }
        break;

      case Direction.RIGHT:
        console.log('right');
        // merge
        for (let row = 0; row < size; row++) {
          let prevValue = -1;
          let prevIndex = -1;
          for (let col = size - 1; col >= 0; col--) {
            if (newGridData[row][col] !== prevValue) {
              prevValue = newGridData[row][col];
              prevIndex = row;
            } else {
              newGridData[row][prevIndex] += newGridData[row][col];
              newGridData[row][col] = 0;
              scoreIncrement += newGridData[row][prevIndex]
              prevValue = -1;
              prevIndex = -1;
            }
          }
        }
        // compress
        for (let row = 0; row < size; row++) {
          let prevIndex = size - 1;
          for (let col = size - 1; col >= 0; col--) {
            if (newGridData[row][col] !== 0) {
              if (col !== prevIndex) {
                newGridData[row][prevIndex] = newGridData[row][col];
                newGridData[row][col] = 0;
              }
              prevIndex--;
            }
          }
        }
        break;
    }

    gridData.value = newGridData;
    score.value += scoreIncrement;

    // add new cell
    if (hasEmpty.value) {
      addRandomCell();
    }
  };

  const addRandomCell = () => {
    const positions: Array<[number, number]> = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (gridData.value[row][col] === 0) {
          positions.push([row, col]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * positions.length);
    const [row, col] = positions[randomIndex];
    gridData.value[row][col] = INIT_VALUE;
  };

  const init = (newSize?: number) => {
    if (newSize) {
      size = newSize;
    }

    score.value = 0;
    history.length = 0;
    gridData.value = createGridData(size);
  };

  const start = () => {
    addRandomCell();
    addRandomCell();
  }

  return {
    gridData,
    score,
    isEnd,
    move,
    undo,
    init,
    start
  };
};
