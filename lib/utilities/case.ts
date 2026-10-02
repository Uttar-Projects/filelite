export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

function words(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .match(/[\p{L}\p{N}]+/gu) ?? [];
}

function titleCase(text: string): string {
  return text.replace(/[\p{L}\p{N}]+/gu, (word) => {
    const [first = "", ...rest] = [...word.toLowerCase()];
    return `${first.toUpperCase()}${rest.join("")}`;
  });
}

export function convertCase(text: string, mode: CaseMode): string {
  if (!text) return "";
  const parts = words(text);
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return titleCase(text);
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (match, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);
    case "camel":
      return parts
        .map((word, index) => {
          const lower = word.toLowerCase();
          if (index === 0) return lower;
          return `${lower.slice(0, 1).toUpperCase()}${lower.slice(1)}`;
        })
        .join("");
    case "pascal":
      return parts.map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`).join("");
    case "snake":
      return parts.map((word) => word.toLowerCase()).join("_");
    case "kebab":
      return parts.map((word) => word.toLowerCase()).join("-");
    case "constant":
      return parts.map((word) => word.toUpperCase()).join("_");
    default:
      return text;
  }
}
