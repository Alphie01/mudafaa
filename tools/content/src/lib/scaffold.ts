import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { UsageError, assertSlug, caseSrcDir, repoRoot } from './paths.js';

// case:new: tools/content/templates/case/** → content/src/<slug>/, belge şablonları → docs/content ve docs/legal.
// Yer tutucular: __SLUG__, __NUMBER__, __NN__ (iki basamaklı numara), __KIT__ (kitin göreli içe aktarma yolu).
// TypeScript ve HTML çıktısı depodaki Prettier ayarlarıyla biçimlenir.

const templatesDir = join(repoRoot, 'tools/content/templates');
const kitIndex = join(repoRoot, 'tools/content/src/kit/index.js');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

export interface ScaffoldResult {
  files: string[];
}

/** Yeni dava iskeleti yazar; hedef dizin ya da belgeler varsa yazmaz (UsageError). */
export async function scaffoldCase(slugArg: string | undefined, numberArg: string | undefined, root = repoRoot) {
  const slug = assertSlug(slugArg);
  const number = Number(numberArg);
  if (!Number.isInteger(number) || number < 1 || number > 99) {
    throw new UsageError(`Geçersiz dava numarası: ${String(numberArg)} (1–99)`);
  }
  const nn = String(number).padStart(2, '0');
  const srcDir = caseSrcDir(slug, root);
  const docs = [
    { from: join(templatesDir, 'docs/content.md'), to: join(root, 'docs/content', `${slug}.md`) },
    { from: join(templatesDir, 'docs/legal.md'), to: join(root, 'docs/legal', `${slug}.md`) },
  ];
  const taken = [srcDir, ...docs.map((d) => d.to)].filter((p) => existsSync(p));
  if (taken.length > 0) throw new UsageError(`Zaten var (üzerine yazılmaz): ${taken.join(', ')}`);

  let kit = relative(srcDir, kitIndex).split(sep).join('/');
  if (!kit.startsWith('.')) kit = `./${kit}`;
  const fill = (text: string): string =>
    text
      .replaceAll('__SLUG__', slug)
      .replaceAll('__NUMBER__', String(number))
      .replaceAll('__NN__', nn)
      .replaceAll('__KIT__', kit);

  const written: string[] = [];
  const caseTemplates = join(templatesDir, 'case');
  for (const file of walk(caseTemplates).sort()) {
    const to = join(srcDir, relative(caseTemplates, file));
    mkdirSync(dirname(to), { recursive: true });
    let text = fill(readFileSync(file, 'utf8'));
    if (/\.(ts|html)$/.test(to)) text = await format(text, { ...((await resolveConfig(to)) ?? {}), filepath: to });
    writeFileSync(to, text);
    written.push(to);
  }
  for (const d of docs) {
    mkdirSync(dirname(d.to), { recursive: true });
    writeFileSync(d.to, fill(readFileSync(d.from, 'utf8')));
    written.push(d.to);
  }
  return { files: written } satisfies ScaffoldResult;
}
