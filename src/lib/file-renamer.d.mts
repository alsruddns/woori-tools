export type RenameOptions = { prefix?: string; suffix?: string; find?: string; replace?: string; startNumber?: string; padding?: string };
export function renameFileNames(names: string[], options?: RenameOptions): string[];
export function parseRenameOptions(text: string): RenameOptions;
