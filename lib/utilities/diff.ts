export type DiffKind = "equal" | "add" | "remove";
export type DiffLine = { kind: DiffKind; text: string; left?: number; right?: number };

export function diffLines(original: string, changed: string): DiffLine[] {
  const left = original.split("\n");
  const right = changed.split("\n");
  if (left.length * right.length > 250_000) {
    return [{ kind: "equal", text: "These texts are too large to compare line by line. Split them into smaller pieces." }];
  }

  const n = left.length;
  const m = right.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array.from({ length: m + 1 }, () => 0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i]![j] = left[i] === right[j] ? (dp[i + 1]![j + 1] ?? 0) + 1 : Math.max(dp[i + 1]![j] ?? 0, dp[i]![j + 1] ?? 0);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let leftNo = 1;
  let rightNo = 1;
  while (i < n && j < m) {
    if (left[i] === right[j]) {
      out.push({ kind: "equal", text: left[i] ?? "", left: leftNo, right: rightNo });
      i += 1;
      j += 1;
      leftNo += 1;
      rightNo += 1;
    } else if ((dp[i + 1]![j] ?? 0) >= (dp[i]![j + 1] ?? 0)) {
      out.push({ kind: "remove", text: left[i] ?? "", left: leftNo });
      i += 1;
      leftNo += 1;
    } else {
      out.push({ kind: "add", text: right[j] ?? "", right: rightNo });
      j += 1;
      rightNo += 1;
    }
  }
  while (i < n) {
    out.push({ kind: "remove", text: left[i] ?? "", left: leftNo });
    i += 1;
    leftNo += 1;
  }
  while (j < m) {
    out.push({ kind: "add", text: right[j] ?? "", right: rightNo });
    j += 1;
    rightNo += 1;
  }
  return out;
}
