import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'acorn';

// Tasarımın Sprite.dc.html dosyası başkalarının yayımladığı güvenilmeyen veridir: içindeki betik ASLA çalıştırılmaz.
// <script type="text/x-dc"> metni acorn ile ayrıştırılır ve yalnızca şu düğümler değerlendirilir: ArrayExpression,
// string Literal, `const` ile tanımlanmış Identifier ve `<dizi>.concat(<dizi>…)` çağrısı. Bunun dışındaki her biçim
// hata verir. Satırlar tasarımdaki gibi 16 karaktere '.' ile tamamlanır.

export interface ExtractedSprite {
  id: string;
  rows: string[];
  skin?: string;
  noEyes?: boolean;
  noMouth?: boolean;
}

/** acorn düğümünün ihtiyaç duyulan kısmı; ayrıştırıcının döndürdüğü nesneler bu alanları taşır. */
interface AstNode {
  type: string;
  [key: string]: unknown;
}

const isNode = (value: unknown): value is AstNode =>
  typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string';

/** Ağacı derinlik öncelikli dolaşır (acorn-walk'a gerek kalmadan). */
const walk = (node: AstNode, visit: (n: AstNode) => void): void => {
  visit(node);
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) if (isNode(item)) walk(item, visit);
    } else if (isNode(child)) {
      walk(child, visit);
    }
  }
};

const fail = (message: string): never => {
  throw new Error(`extractSprites: ${message}`);
};

/** `<script type="text/x-dc">` bloğunun metni. */
const scriptText = (dcHtml: string): string => {
  const match = /<script\b[^>]*type=["']text\/x-dc["'][^>]*>([\s\S]*?)<\/script>/i.exec(dcHtml);
  return match?.[1] ?? fail('<script type="text/x-dc"> bulunamadı');
};

/** Betikteki tüm `const` tanımları (ad → başlangıç düğümü); aynı ad iki kez tanımlanmışsa belirsiz sayılır. */
const collectConsts = (program: AstNode): Map<string, AstNode | null> => {
  const consts = new Map<string, AstNode | null>();
  walk(program, (node) => {
    if (node.type !== 'VariableDeclaration' || node.kind !== 'const') return;
    for (const decl of node.declarations as AstNode[]) {
      const id = decl.id as AstNode;
      if (id.type !== 'Identifier' || !isNode(decl.init)) continue;
      const name = id.name as string;
      consts.set(name, consts.has(name) ? null : decl.init);
    }
  });
  return consts;
};

/** Yalnızca izin verilen düğümleri değerlendirir; sonuç bir metin ya da metin dizisidir. */
const evaluate = (node: AstNode, consts: Map<string, AstNode | null>, depth = 0): string | string[] => {
  if (depth > 32) fail('çok derin ifade');
  switch (node.type) {
    case 'Literal':
      return typeof node.value === 'string' ? node.value : fail(`metin olmayan literal: ${String(node.raw)}`);
    case 'ArrayExpression':
      return (node.elements as (AstNode | null)[]).map((element) => {
        if (element === null) return fail('dizide boşluk');
        const value = evaluate(element, consts, depth + 1);
        return typeof value === 'string' ? value : fail('iç içe dizi');
      });
    case 'Identifier': {
      const name = node.name as string;
      const init = consts.get(name);
      if (init === undefined) return fail(`tanımsız ad: ${name}`);
      if (init === null) return fail(`birden çok kez tanımlanmış ad: ${name}`);
      return evaluate(init, consts, depth + 1);
    }
    case 'CallExpression': {
      const callee = node.callee as AstNode;
      const property = callee.property as AstNode | undefined;
      if (
        callee.type !== 'MemberExpression' ||
        callee.computed === true ||
        property?.type !== 'Identifier' ||
        property.name !== 'concat'
      ) {
        return fail('yalnızca .concat(...) çağrısına izin verilir');
      }
      const base = evaluate(callee.object as AstNode, consts, depth + 1);
      if (!Array.isArray(base)) return fail('.concat bir dizi üzerinde çağrılmalı');
      const out = [...base];
      for (const arg of node.arguments as AstNode[]) {
        const value = evaluate(arg, consts, depth + 1);
        if (Array.isArray(value)) out.push(...value);
        else out.push(value);
      }
      return out;
    }
    default:
      return fail(`izin verilmeyen ifade türü: ${node.type}`);
  }
};

/** Nesne literalindeki özelliğin adı (tanımlayıcı ya da metin anahtar). */
const keyName = (prop: AstNode): string => {
  if (prop.type !== 'Property' || prop.computed === true) return fail('nesne literalinde yalnızca düz özellikler olmalı');
  const key = prop.key as AstNode;
  if (key.type === 'Identifier') return key.name as string;
  if (key.type === 'Literal' && typeof key.value === 'string') return key.value;
  return fail('desteklenmeyen özellik anahtarı');
};

const objectInit = (consts: Map<string, AstNode | null>, name: string): AstNode[] => {
  const init = consts.get(name);
  if (init == null || init.type !== 'ObjectExpression') return fail(`${name} nesne literali bulunamadı`);
  return init.properties as AstNode[];
};

/** META girdisindeki skin / noEyes / noMouth literalleri. */
const metaOf = (props: AstNode[], who: string): Pick<ExtractedSprite, 'skin' | 'noEyes' | 'noMouth'> => {
  const prop = props.find((p) => keyName(p) === who);
  if (prop === undefined) return {};
  const value = prop.value as AstNode;
  if (value.type !== 'ObjectExpression') return fail(`META.${who} nesne literali değil`);
  const meta: Pick<ExtractedSprite, 'skin' | 'noEyes' | 'noMouth'> = {};
  for (const field of value.properties as AstNode[]) {
    const name = keyName(field);
    const literal = field.value as AstNode;
    if (name === 'skin') {
      if (literal.type !== 'Literal' || typeof literal.value !== 'string') return fail(`META.${who}.skin metin değil`);
      meta.skin = literal.value;
    } else if (name === 'noEyes' || name === 'noMouth') {
      if (literal.type !== 'Literal' || typeof literal.value !== 'boolean') return fail(`META.${who}.${name} bool değil`);
      meta[name] = literal.value;
    }
  }
  return meta;
};

/** Sprite.dc.html metninden 16 × 20 sprite tanımlarını çıkarır (kod çalıştırmadan). */
export function extractSprites(dcHtml: string): Record<string, ExtractedSprite> {
  const program = parse(scriptText(dcHtml), { ecmaVersion: 'latest', sourceType: 'script' }) as unknown as AstNode;
  const consts = collectConsts(program);
  const metaProps = objectInit(consts, 'META');
  const sprites: Record<string, ExtractedSprite> = {};
  for (const prop of objectInit(consts, 'M')) {
    const who = keyName(prop);
    const rows = evaluate(prop.value as AstNode, consts);
    if (!Array.isArray(rows)) fail(`M.${who} bir satır dizisi değil`);
    sprites[who] = {
      id: who,
      rows: (rows as string[]).map((row) => row.padEnd(16, '.').slice(0, 16)),
      ...metaOf(metaProps, who),
    };
  }
  return sprites;
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

/** Tasarımdaki sprite'ları `content/shared/sprites/<who>.json` dosyalarına yazar. */
export function writeSprites(outDir = join(repoRoot, 'content/shared/sprites')): string[] {
  const html = readFileSync(join(repoRoot, 'design/reference/project/Sprite.dc.html'), 'utf8');
  const sprites = extractSprites(html);
  mkdirSync(outDir, { recursive: true });
  const ids = Object.keys(sprites);
  for (const id of ids) writeFileSync(join(outDir, `${id}.json`), `${JSON.stringify(sprites[id], null, 2)}\n`);
  return ids;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ids = writeSprites();
  console.log(`${ids.length} sprite yazıldı: ${ids.join(', ')}`);
}
