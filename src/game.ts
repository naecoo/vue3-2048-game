import { computed, ref } from 'vue';

export enum Direction {
  UP = 1,
  DOWN,
  LEFT,
  RIGHT,
}

export type Cell = {
  value: number;
  merge?: boolean;
  new?: boolean;
};

export type GridData = Cell[][];

type GridHistoryItem = {
  score: number;
  data: GridData;
};

const createGridData = (size: number): GridData => {
  const res: GridData = [];
  for (let i = 0; i < size; i++) {
    const rows: Cell[] = [];
    for (let i = 0; i < size; i++) {
      rows.push({ value: 0 });
    }
    res.push(rows);
  }

  return res;
};

const cloneDeep = (data: GridData): GridData => {
  return data.map((row) => row.map((cell) => ({ value: cell.value })));
};

export const useGrid = (size: number) => {
  const score = ref(0);
  const gridData = ref(createGridData(size));
  const history: GridHistoryItem[] = [];

  const hasEmpty = computed(() =>
    gridData.value.some((row) => row.some((cell) => cell.value === 0))
  );
  const isEnd = computed(() => {
    if (hasEmpty.value) {
      return false;
    }

    const grid = gridData.value;
    // vertical
    for (let col = 0; col < size; col++) {
      for (let row = 1; row < size; row++) {
        if (grid[row][col].value === grid[row - 1][col].value) {
          return false;
        }
      }
    }
    // horizontal
    for (let row = 0; row < size; row++) {
      for (let col = 1; col < size; col++) {
        if (grid[row][col].value === grid[row][col - 1].value) {
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
  };

  const move = (dir: Direction) => {
    history.push({
      score: score.value,
      data: gridData.value,
    });

    const grid = cloneDeep(gridData.value);
    let scoreIncrement = 0;

    switch (dir) {
      case Direction.UP:
        for (let col = 0; col < size; col++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = -1;
          for (let row = 0; row < size; row++) {
            if (grid[row][col].value === value) {
              grid[valueIndex][col].merge = true;
              grid[valueIndex][col].value += value;
              grid[row][col].value = 0;
              value = -1;
              scoreIncrement += grid[valueIndex][col].value;
            } else if (grid[row][col].value !== 0) {
              value = grid[row][col].value;
              grid[row][col].value = 0;
              valueIndex = ++notNullIndex;
              grid[valueIndex][col].value = value;
            }
          }
        }
        break;

      case Direction.DOWN:
        for (let col = 0; col < size; col++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = size;
          for (let row = size - 1; row >= 0; row--) {
            if (grid[row][col].value === value) {
              grid[valueIndex][col].merge = true;
              grid[valueIndex][col].value += value;
              grid[row][col].value = 0;
              value = -1;
              scoreIncrement += grid[valueIndex][col].value;
            } else if (grid[row][col].value !== 0) {
              value = grid[row][col].value;
              grid[row][col].value = 0;
              valueIndex = --notNullIndex;
              grid[valueIndex][col].value = value;
            }
          }
        }
        break;

      case Direction.LEFT:
        for (let row = 0; row < size; row++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = -1;
          for (let col = 0; col < size; col++) {
            if (grid[row][col].value === value) {
              grid[row][valueIndex].merge = true;
              grid[row][valueIndex].value += value;
              grid[row][col].value = 0;
              value = -1;
              scoreIncrement += grid[row][valueIndex].value;
            } else if (grid[row][col].value !== 0) {
              value = grid[row][col].value;
              grid[row][col].value = 0;
              valueIndex = ++notNullIndex;
              grid[row][valueIndex].value = value;
            }
          }
        }
        break;

      case Direction.RIGHT:
        for (let row = 0; row < size; row++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = size;
          for (let col = size - 1; col >= 0; col--) {
            if (grid[row][col].value === value) {
              grid[row][valueIndex].merge = true;
              grid[row][valueIndex].value += value;
              grid[row][col].value = 0;
              value = -1;
              scoreIncrement += grid[row][valueIndex].value;
            } else if (grid[row][col].value !== 0) {
              value = grid[row][col].value;
              grid[row][col].value = 0;
              valueIndex = --notNullIndex;
              grid[row][valueIndex].value = value;
            }
          }
        }
        break;
    }

    gridData.value = grid;
    score.value += scoreIncrement;

    if (hasEmpty.value) {
      addRandomCell();
    }
  };

  const addRandomCell = () => {
    const positions: Array<[number, number]> = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (gridData.value[row][col].value === 0) {
          positions.push([row, col]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * positions.length);
    const [row, col] = positions[randomIndex];

    // 2-90% 4-10%
    gridData.value[row][col].value = Math.random() < 0.9 ? 2 : 4;
    gridData.value[row][col].new = true;
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
  };

  return {
    gridData,
    score,
    isEnd,
    move,
    undo,
    init,
    start,
  };
};
