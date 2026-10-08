export function secureShuffle<T>(items: readonly T[]): T[];
export function rollDice(sides: number, count?: number): number[];
export function normalizeWheelItems(text: string, options?: { allowDuplicates?: boolean; limit?: number }): string[];
export function divideEvenly(participants: string[], teamCount: number): string[][];
