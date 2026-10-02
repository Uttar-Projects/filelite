export type TimestampView = {
  unixSeconds: number;
  unixMillis: number;
  iso: string;
  utc: string;
  local: string;
};

export function fromUnixInput(value: string): TimestampView | { error: string } {
  const trimmed = value.trim();
  if (!trimmed) return { error: "Enter a Unix timestamp." };
  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) return { error: "Enter a number of seconds or milliseconds." };
  const millis = Math.abs(numeric) >= 1e12 ? numeric : numeric * 1000;
  const date = new Date(millis);
  if (Number.isNaN(date.getTime())) return { error: "That timestamp is outside the range this browser can show." };
  return formatDate(date);
}

export function fromDateInput(value: string): TimestampView | { error: string } {
  if (!value.trim()) return { error: "Enter a date and time." };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { error: "That date could not be read." };
  return formatDate(date);
}

function formatDate(date: Date): TimestampView {
  return {
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMillis: date.getTime(),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
  };
}
