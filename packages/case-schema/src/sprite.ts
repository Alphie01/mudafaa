import { z } from 'zod';
import { Id } from './primitives.js';

/**
 * Karakter sprite'ı: 16×20 piksel. Her satır 1–16 karakterdir ve ortak paletin harflerinden ile saydam piksel olan
 * `.` işaretinden oluşur. `skin`, yüz ifadesinin çizildiği ten rengini seçen tek palet harfidir (`.` olamaz);
 * `noEyes` / `noMouth` ifadenin göz / ağız piksellerini çizmez.
 */
export const SpriteDef = z.strictObject({
  id: Id,
  rows: z
    .array(z.string().regex(/^[A-Za-z.]{1,16}$/, 'Geçersiz sprite satırı: 1–16 karakter, yalnızca harf ve . içermeli'))
    .length(20, 'rows tam 20 satır içermeli'),
  skin: z
    .string()
    .regex(/^[A-Za-z]$/, 'skin tek bir palet harfi olmalı')
    .optional(),
  noEyes: z.boolean().optional(),
  noMouth: z.boolean().optional(),
});
export type SpriteDef = z.infer<typeof SpriteDef>;
