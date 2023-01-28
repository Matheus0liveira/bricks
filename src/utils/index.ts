export const TOTAL_COLS = 10;
export const TOTAL_ROWS = 10;

export const bricksArray = Array.from({ length: TOTAL_COLS * TOTAL_ROWS }).map(
  (_, i) => i
);
