const STOP = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
  "you",
]);

export type WordStats = {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
  keywords: { word: string; count: number; density: number }[];
};

export function countWords(text: string): string[] {
  return text
    .toLowerCase()
    .match(/[\p{L}\p{N}']+/gu)
    ?.filter(Boolean) ?? [];
}

export function analyzeText(text: string, keywordLimit = 8): WordStats {
  const characters = [...text].length;
  const charactersNoSpaces = [...text.replace(/\s/g, "")].length;
  const words = countWords(text);
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).length;
  const readingMinutes = words.length / 200;
  const freq = new Map<string, number>();
  for (const word of words) {
    if (STOP.has(word) || word.length < 2) continue;
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  const keywords = [...freq.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, keywordLimit)
    .map(([word, count]) => ({
      word,
      count,
      density: words.length > 0 ? (count / words.length) * 100 : 0,
    }));

  return {
    characters,
    charactersNoSpaces,
    words: words.length,
    sentences,
    paragraphs: text.trim() ? Math.max(1, paragraphs) : 0,
    readingMinutes,
    keywords,
  };
}
