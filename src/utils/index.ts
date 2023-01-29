export const TOTAL_COLS = 9;
export const TOTAL_ROWS = 9;

export const bricksArray = Array.from({ length: TOTAL_COLS * TOTAL_ROWS }).map(
  (_, i) => i
);
