import type { CasePackage, Cond, Val } from '@mudafaa/case-schema';
import { typeOf } from '@mudafaa/engine';
import type { CompiledCase, ExprType } from '@mudafaa/engine';
import { error, warning } from '../issues.js';
import type { Issue } from '../issues.js';
import { allEffects, condSites, eachCondLeaf, intValSites } from '../walk.js';

/** Prototip adları kimlik ya da kayıt anahtarı olarak kullanılamaz (Ruling 25). */
const RESERVED: ReadonlySet<string> = new Set(['__proto__', 'constructor', 'prototype']);

function reservedIds(value: unknown, path: string, out: Issue[]): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => reservedIds(v, `${path}[${i}]`, out));
    return;
  }
  if (typeof value !== 'object' || value === null) return;
  for (const [key, v] of Object.entries(value)) {
    const p = path === '' ? key : `${path}.${key}`;
    if (RESERVED.has(key)) out.push(error('RESERVED_ID', p, `Ayrılmış ad anahtar olarak kullanılamaz: ${key}`));
    if (key === 'id' && typeof v === 'string' && RESERVED.has(v)) {
      out.push(error('RESERVED_ID', p, `Ayrılmış ad kimlik olarak kullanılamaz: ${v}`));
    }
    reservedIds(v, p, out);
  }
}

function discoveryChecks(pkg: CasePackage, c: CompiledCase, out: Issue[]): void {
  const keyOf = (evidence: string, type: string, id: string | undefined): string => `${evidence}|${type}|${id ?? ''}`;
  const paths = new Set(pkg.discoveryPaths.map((d) => keyOf(d.evidence, d.source.type, d.source.id)));
  const discovers = new Set<string>();
  for (const { effect, path, site } of allEffects(pkg)) {
    if (effect.type !== 'DISCOVER') continue;
    const key = keyOf(effect.evidence, site.source.type, site.source.id);
    discovers.add(key);
    if (!paths.has(key)) {
      out.push(
        error(
          'DISCOVERY_MISMATCH',
          path,
          `${effect.evidence} için ${site.source.type} ${site.source.id} bulunma yolu yok`,
        ),
      );
    }
  }
  pkg.discoveryPaths.forEach((d, i) => {
    const p = `discoveryPaths[${i}]`;
    if (d.source.type === 'INITIAL') {
      if (c.evidence.get(d.evidence)?.initiallyKnown !== true) {
        out.push(error('DISCOVERY_MISMATCH', p, `${d.evidence} INITIAL yolu taşıyor ama başlangıçta bilinmiyor`));
      }
    } else if (!discovers.has(keyOf(d.evidence, d.source.type, d.source.id))) {
      out.push(
        error(
          'DISCOVERY_MISMATCH',
          p,
          `${d.source.type} ${d.source.id ?? '?'} ${d.evidence} delilini DISCOVER etmiyor`,
        ),
      );
    }
  });
  pkg.evidence.forEach((ev, i) => {
    if (!ev.initiallyKnown && !pkg.discoveryPaths.some((d) => d.evidence === ev.id && d.source.type !== 'INITIAL')) {
      out.push(
        error('UNDISCOVERABLE_EVIDENCE', `evidence[${i}]`, `${ev.id}: ne başlangıçta biliniyor ne bulunma yolu var`),
      );
    }
  });
}

/** EVIDENCE node'unun konusu ve savcılık delili görünümde gösterilir: başlangıçta bilinmeli ya da node'a girişte bulunmalı. */
function shownEvidenceChecks(pkg: CasePackage, c: CompiledCase, out: Issue[]): void {
  pkg.nodes.forEach((n, i) => {
    const shown =
      n.type === 'EVIDENCE'
        ? { id: n.evidence, path: `nodes[${i}].evidence` }
        : n.type === 'COURTROOM' && n.prosecutionEvidence !== undefined
          ? { id: n.prosecutionEvidence, path: `nodes[${i}].prosecutionEvidence` }
          : undefined;
    if (shown === undefined || c.evidence.get(shown.id)?.initiallyKnown === true) return;
    const onEntry = [...(n.onEnter ?? []), ...(n.onFirstEnter ?? [])];
    if (!onEntry.some((e) => e.type === 'DISCOVER' && e.evidence === shown.id)) {
      out.push(
        error(
          'SHOWN_UNDISCOVERED',
          shown.path,
          `${shown.id} gösteriliyor ama başlangıçta bilinmiyor ve girişte bulunmuyor`,
        ),
      );
    }
  });
}

function evidenceUseChecks(pkg: CasePackage, c: CompiledCase, out: Issue[]): void {
  const combinable = (id: string): boolean => c.evidence.get(id)?.combinable === true;
  const presented = new Set<string>();
  pkg.nodes.forEach((n, i) => {
    if (n.type === 'DEDUCTION') {
      n.pool.forEach((id, k) => {
        if (!combinable(id))
          out.push(error('NOT_COMBINABLE', `nodes[${i}].pool[${k}]`, `${id} çıkarım tahtasında ama combinable değil`));
      });
    }
    n.choices.forEach((ch, j) => {
      const m = ch.match;
      if (m === undefined) return;
      if (ch.kind === 'COMBINE' && 'a' in m) {
        for (const id of [m.a, m.b]) {
          if (!combinable(id))
            out.push(error('NOT_COMBINABLE', `nodes[${i}].choices[${j}].match`, `${ch.id}: ${id} combinable değil`));
        }
      }
      if (ch.kind === 'PRESENT' && 'evidence' in m) for (const id of m.evidence) presented.add(id);
    });
  });
  pkg.evidence.forEach((ev, i) => {
    if (ev.presentable && !presented.has(ev.id)) {
      out.push(
        warning('UNUSED_PRESENTABLE', `evidence[${i}]`, `${ev.id} sunulabilir ama hiçbir PRESENT kuralında geçmiyor`),
      );
    }
  });
}

/** `typeOf`'u hata yerine sonuç olarak döndürür. */
function safeType(v: Val, c: CompiledCase): ExprType | string {
  try {
    return typeOf(v, c);
  } catch (e) {
    return `!${e instanceof Error ? e.message : String(e)}`;
  }
}

/** `==`/`!=` için tür uyumu: aynı tür ya da enum değişkenle (değer kümesindeki) metin sabiti. */
function equalityCompatible(lt: string, rt: string, l: Val, r: Val, c: CompiledCase): boolean {
  if (lt === rt) return true;
  const enumAndString = (et: string, st: string, lit: Val): boolean => {
    if (!et.startsWith('enum:') || st !== 'string') return false;
    const values = c.vars.get(et.slice(5))?.enumValues ?? [];
    return typeof lit !== 'string' || values.includes(lit);
  };
  return enumAndString(lt, rt, r) || enumAndString(rt, lt, l);
}

const ORDERING: ReadonlySet<string> = new Set(['<', '<=', '>', '>=']);
const FINAL_OK = /^(outcomes\[\d+\]\.(when|reasoning|xp)|report\.hints\[\d+\]\.when)/;

function typeChecks(pkg: CasePackage, c: CompiledCase, out: Issue[]): void {
  const usesFinal = (x: Cond | Val): boolean => JSON.stringify(x).includes('"score":"final"');
  for (const { cond, path } of condSites(pkg)) {
    if (usesFinal(cond) && !FINAL_OK.test(path)) {
      out.push(
        error(
          'TYPE_MISMATCH',
          path,
          "{score:'final'} yalnızca sonuç koşullarında, gerekçelerde, XP'de ve rapor ipuçlarında kullanılabilir",
        ),
      );
    }
    eachCondLeaf(cond, (leaf) => {
      if ('flag' in leaf) {
        if (c.vars.get(leaf.flag)?.type !== 'bool')
          out.push(error('TYPE_MISMATCH', path, `flag bool olmayan değişkeni gösteriyor: ${leaf.flag}`));
        return;
      }
      const [l, op, r] = leaf.cmp;
      const lt = safeType(l, c);
      const rt = safeType(r, c);
      if (lt.startsWith('!') || rt.startsWith('!')) {
        out.push(error('TYPE_MISMATCH', path, `İfade tür hatası: ${(lt.startsWith('!') ? lt : rt).slice(1)}`));
      } else if (ORDERING.has(op) ? lt !== 'int' || rt !== 'int' : !equalityCompatible(lt, rt, l, r, c)) {
        out.push(error('TYPE_MISMATCH', path, `cmp ${op} işlenen türleri uyumsuz: ${lt} ve ${rt}`));
      }
    });
  }
  for (const { path, val } of intValSites(pkg)) {
    const t = safeType(val, c);
    if (t !== 'int') out.push(error('TYPE_MISMATCH', path, `Tamsayı ifade bekleniyordu: ${t.replace(/^!/, '')}`));
    if (usesFinal(val) && !FINAL_OK.test(path))
      out.push(error('TYPE_MISMATCH', path, "{score:'final'} burada kullanılamaz"));
  }
  for (const { effect, path } of allEffects(pkg)) {
    if (effect.type !== 'VAR') continue;
    const v = c.vars.get(effect.var);
    if (v === undefined) continue;
    const t = safeType(effect.value, c);
    const ok =
      effect.op === 'set'
        ? v.type === 'int'
          ? t === 'int'
          : v.type === 'bool'
            ? t === 'bool'
            : t === `enum:${v.id}` ||
              (t === 'string' && (typeof effect.value !== 'string' || (v.enumValues ?? []).includes(effect.value)))
        : v.type === 'int' && t === 'int';
    if (!ok)
      out.push(
        error(
          'TYPE_MISMATCH',
          path,
          `${effect.var} (${v.type}) için ${effect.op} değeri uyumsuz: ${t.replace(/^!/, '')}`,
        ),
      );
  }
}

/** Tutarlılık: ayrılmış adlar, bulunma yolları, delil kullanımı ve ifade türleri. */
export function consistencyChecks(pkg: CasePackage, c: CompiledCase): Issue[] {
  const out: Issue[] = [];
  reservedIds(pkg, '', out);
  discoveryChecks(pkg, c, out);
  shownEvidenceChecks(pkg, c, out);
  evidenceUseChecks(pkg, c, out);
  typeChecks(pkg, c, out);
  return out;
}
