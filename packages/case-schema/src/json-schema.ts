import { z } from 'zod';
import { CasePackage } from './package.js';

/**
 * CasePackage'ın JSON Schema'sı (draft 2020-12; her çağrıda yeni bir nesne). Editörler ve AI üretimi (M3) için
 * biçimi tarif eder; `superRefine` kuralları (ör. ChoiceDef'in tür kuralları, VariableDef sınırları) JSON Schema'ya
 * taşınmaz. İçerik bu yüzden yine `CasePackage.parse` ve doğrulayıcıdan geçmelidir.
 */
export function casePackageJsonSchema(): Record<string, unknown> {
  return z.toJSONSchema(CasePackage) as Record<string, unknown>;
}
