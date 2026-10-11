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
export function generateSpecialBalls(options: { count?: number; min: number; max: number; mode?: "auto" | "include" | "exclude"; number?: number | null }): number[];
export function lotteryHistoryStorageKey(slug: string): string;
