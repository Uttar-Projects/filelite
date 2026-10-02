import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

function crc32(buffer) {
  let crc = ~0;
  for (let index = 0; index < buffer.length; index += 1) {
    crc ^= buffer[index];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

const width = 960;
const height = 640;
const raw = Buffer.alloc((width * 3 + 1) * height);

for (let y = 0; y < height; y += 1) {
  const row = y * (width * 3 + 1);
  raw[row] = 0;
  for (let x = 0; x < width; x += 1) {
    const offset = row + 1 + x * 3;
    const nx = x / width;
    const ny = y / height;
    raw[offset] = clamp(36 + nx * 170 + Math.sin(x / 28) * 24);
    raw[offset + 1] = clamp(84 + ny * 110 + Math.cos(y / 22) * 18);
    raw[offset + 2] = clamp(96 + (1 - nx) * 70 + Math.sin((x + y) / 35) * 22);
    if (x % 64 === 0 || y % 64 === 0) {
      raw[offset] = clamp(raw[offset] - 28);
      raw[offset + 1] = clamp(raw[offset + 1] - 16);
    }
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 2;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync("public/images", { recursive: true });
writeFileSync("public/images/demo-photo.png", png);
