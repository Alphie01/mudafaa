import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
const N = 32;
const P = { '.':'#1d1733', ':':'#2b2350', ';':'#3a2f66', '*':'#f4e7c5', 'k':'#120d1c', 'h':'#3a2a24', 'H':'#5a3b2c',
  's':'#f2b38a', 'S':'#c9805e', 'e':'#120d1c', 'w':'#f4efe6', 'W':'#cfc9c1', 'n':'#25222e', 'N':'#3c3848', 'm':'#7b4fb0', 'u':'#5a3a8a', 'g':'#e8b13c', 'r':'#c4413a', 'f':'#e39a7c', 'L':'#4e3428' };
const G = Array.from({ length: N }, () => Array(N).fill('.'));
const set = (x, y, c) => { if (x >= 0 && x < N && y >= 0 && y < N) G[y][x] = c; };
// gökyüzü: alt yarı biraz açık, spot halka
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const d = Math.hypot(x - 15.5, y - 13);
  if (d < 10.5) set(x, y, ';'); else if (d < 13.5) set(x, y, ':');
}
for (const [x, y] of [[3, 3], [27, 4], [5, 10], [28, 12], [24, 1], [8, 2]]) set(x, y, '*');
// cübbe: omuzlardan aşağı genişleyen yamuk
for (let y = 19; y < N; y++) {
  const half = Math.min(15, 6 + Math.floor((y - 19) * 1.6));
  for (let x = 16 - half; x < 16 + half; x++) set(x, y, 'n');
  set(16 - half - 1, y, 'k'); set(16 + half, y, 'k');
}
for (let x = 10; x < 22; x++) set(x, 18, 'k');
// kıvrımlar
for (let y = 24; y < N; y++) { set(8, y, 'N'); set(23, y, 'N'); }
// mor yakalar (V)
for (let y = 19; y < N; y++) {
  const o = Math.floor((y - 19) * 0.55);
  for (const dx of [0, 1, 2]) { set(13 - o - dx, y, dx === 2 ? 'u' : 'm'); set(18 + o + dx, y, dx === 2 ? 'u' : 'm'); }
}
// beyaz yaka bandı + gömlek
for (let y = 19; y < 26; y++) { const o = Math.floor((y - 19) * 0.55); for (let x = 14 - o; x <= 17 + o; x++) set(x, y, 'w'); }
for (let y = 20; y < 25; y++) { set(15, y, 'W'); set(16, y, 'W'); }
// rozet (terazi): altın
set(20, 23, 'g'); set(21, 23, 'g'); set(20, 24, 'g'); set(21, 24, 'g');
// boyun
for (let y = 16; y < 19; y++) for (let x = 14; x < 18; x++) set(x, y, 'S');
// yüz
for (let y = 6; y < 17; y++) for (let x = 11; x < 21; x++) set(x, y, 's');
for (let y = 6; y < 17; y++) { set(10, y, 'k'); set(21, y, 'k'); }
for (let x = 11; x < 21; x++) set(x, 17, 'k');
set(11, 16, 'k'); set(20, 16, 'k');
// saç
for (let y = 3; y < 8; y++) for (let x = 10; x < 22; x++) set(x, y, 'h');
for (let x = 11; x < 21; x++) set(x, 2, 'k');
set(10, 3, 'k'); set(21, 3, 'k'); for (let y = 4; y < 10; y++) { set(9, y, 'k'); set(22, y, 'k'); set(10, y, 'h'); set(21, y, 'h'); }
for (const [x, y] of [[12, 6], [13, 6], [17, 5], [18, 5], [19, 6], [11, 4], [16, 4]]) set(x, y, 'L');
for (let x = 15; x < 21; x++) set(x, 7, 'h'); set(14, 7, 's'); set(13, 7, 's');
for (let x = 12; x < 20; x++) set(x, 8, 's');
// kaşlar, gözler, ağız, yanak
set(12, 10, 'h'); set(13, 10, 'h'); set(18, 10, 'h'); set(19, 10, 'h');
set(13, 11, 'e'); set(18, 11, 'e'); set(13, 12, 'e'); set(18, 12, 'e');
set(16, 13, 'S');
set(13, 14, 'S'); set(18, 14, 'S'); for (let x = 14; x < 18; x++) set(x, 15, 'S');
set(12, 14, 'f'); set(19, 14, 'f');
// çiz
const scale = Number(process.argv[2] ?? 32), W = N * scale;
const raw = Buffer.alloc((W * 3 + 1) * W);
for (let y = 0; y < W; y++) { raw[y * (W * 3 + 1)] = 0; for (let x = 0; x < W; x++) {
  const hex = P[G[Math.floor(y / scale)][Math.floor(x / scale)]]; const o = y * (W * 3 + 1) + 1 + x * 3;
  raw[o] = parseInt(hex.slice(1, 3), 16); raw[o + 1] = parseInt(hex.slice(3, 5), 16); raw[o + 2] = parseInt(hex.slice(5, 7), 16); } }
const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let r = 0xffffffff; for (const x of b) r = t[(r ^ x) & 0xff] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(W, 4); ihdr[8] = 8; ihdr[9] = 2;
writeFileSync(process.argv[3] ?? '/tmp/icon/icon.png', Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log(G.map((r) => r.join('')).join('\n'));
