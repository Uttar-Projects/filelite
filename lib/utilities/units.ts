export type UnitKind = "length" | "weight" | "temperature" | "data";

export type UnitOption = { id: string; label: string; toBase: number };

export const unitGroups: Record<UnitKind, UnitOption[]> = {
  length: [
    { id: "mm", label: "Millimetres", toBase: 0.001 },
    { id: "cm", label: "Centimetres", toBase: 0.01 },
    { id: "m", label: "Metres", toBase: 1 },
    { id: "km", label: "Kilometres", toBase: 1000 },
    { id: "in", label: "Inches", toBase: 0.0254 },
    { id: "ft", label: "Feet", toBase: 0.3048 },
    { id: "yd", label: "Yards", toBase: 0.9144 },
    { id: "mi", label: "Miles", toBase: 1609.344 },
  ],
  weight: [
    { id: "mg", label: "Milligrams", toBase: 0.001 },
    { id: "g", label: "Grams", toBase: 1 },
    { id: "kg", label: "Kilograms", toBase: 1000 },
    { id: "oz", label: "Ounces", toBase: 28.349523125 },
    { id: "lb", label: "Pounds", toBase: 453.59237 },
  ],
  temperature: [
    { id: "c", label: "Celsius", toBase: 1 },
    { id: "f", label: "Fahrenheit", toBase: 1 },
    { id: "k", label: "Kelvin", toBase: 1 },
  ],
  data: [
    { id: "b", label: "Bytes", toBase: 1 },
    { id: "kb", label: "Kilobytes (1024)", toBase: 1024 },
    { id: "mb", label: "Megabytes", toBase: 1024 ** 2 },
    { id: "gb", label: "Gigabytes", toBase: 1024 ** 3 },
    { id: "kib", label: "Kibibytes", toBase: 1024 },
  ],
};

function toCelsius(value: number, from: string): number {
  if (from === "f") return ((value - 32) * 5) / 9;
  if (from === "k") return value - 273.15;
  return value;
}

function fromCelsius(value: number, to: string): number {
  if (to === "f") return (value * 9) / 5 + 32;
  if (to === "k") return value + 273.15;
  return value;
}

export function convertUnit(kind: UnitKind, value: number, from: string, to: string): number | null {
  if (!Number.isFinite(value)) return null;
  if (kind === "temperature") return fromCelsius(toCelsius(value, from), to);
  const group = unitGroups[kind];
  const source = group.find((unit) => unit.id === from);
  const target = group.find((unit) => unit.id === to);
  if (!source || !target) return null;
  return (value * source.toBase) / target.toBase;
}
