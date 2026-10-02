const LOOKALIKES = new Set(["0", "O", "o", "1", "l", "I"]);

export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
};

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

export function charset(options: PasswordOptions): string {
  let pool = "";
  if (options.upper) pool += SETS.upper;
  if (options.lower) pool += SETS.lower;
  if (options.numbers) pool += SETS.numbers;
  if (options.symbols) pool += SETS.symbols;
  if (options.excludeSimilar) pool = [...pool].filter((char) => !LOOKALIKES.has(char)).join("");
  return pool;
}

export function generatePassword(options: PasswordOptions, random: () => number = Math.random): string {
  const pool = charset(options);
  const length = Math.min(128, Math.max(4, Math.round(options.length)));
  if (!pool) return "";
  return Array.from({ length }, () => pool[Math.floor(random() * pool.length)] ?? "").join("");
}
