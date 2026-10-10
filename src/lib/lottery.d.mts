export type LotteryKind = "lotto" | "powerball" | "megaMillions";
export type LotteryGame = { main: number[]; special?: number };
export const lotteryRules: Record<LotteryKind, { mainMin: number; mainMax: number; mainCount: number; specialMin?: number; specialMax?: number }> ;
export function generateLotteryGame(kind: LotteryKind): LotteryGame;
export function generateLotteryGames(kind: LotteryKind, count?: number): LotteryGame[];
