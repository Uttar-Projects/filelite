const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

export type LoremMode = "paragraphs" | "words";

function sentence(start: number, length: number): string {
  const bits: string[] = [];
  for (let index = 0; index < length; index += 1) {
    bits.push(WORDS[(start + index) % WORDS.length] ?? "lorem");
  }
  const [first = "lorem", ...rest] = bits;
  return `${first.charAt(0).toUpperCase()}${first.slice(1)} ${rest.join(" ")}.`;
}

export function generateLorem(mode: LoremMode, count: number, startWithClassic = true): string {
  const safe = Math.min(40, Math.max(1, Math.round(count)));
  if (mode === "words") {
    const list = startWithClassic
      ? ["Lorem", "ipsum", "dolor", "sit", "amet", ...WORDS.slice(5)]
      : WORDS;
    const words = Array.from({ length: safe }, (_, index) => list[index % list.length]);
    const text = words.join(" ");
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
  }

  const paragraphs: string[] = [];
  for (let index = 0; index < safe; index += 1) {
    const sentences = [
      index === 0 && startWithClassic
        ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        : sentence(index * 7, 8),
      sentence(index * 11 + 3, 9),
      sentence(index * 5 + 1, 7),
    ];
    paragraphs.push(sentences.join(" "));
  }
  return paragraphs.join("\n\n");
}
