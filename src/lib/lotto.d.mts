export type LottoOptions = {
  count?: 1 | 5;
  included?: number[];
  excluded?: number[];
  oddCount?: number | null;
  sorted?: boolean;
  min?: number;
  max?: number;
  numberCount?: number;
};
export function generateLottoGames(options?: LottoOptions): number[][];
