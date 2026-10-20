import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 80-report: dava sonu raporunda "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      hint(
        'h_112',
        not(has('clue_halka')),
        'İhbar formuyla birlikte gelen ses kaydını dinlemedin; kâtibin “anlaşılamadı” dediği yerde “sol kulağında halka” vardı.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_bicak',
        not(has('clue_bicak_yok')),
        '112 dökümünü kolluk ifadesiyle karşılaştırmadın: ilk çağrıda bıçak yok. Silah unsuru (TCK 149/1-a) buna dayanıyordu.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_teshis',
        not(has('clue_foto_farkli')),
        'Teşhis tutanağındaki fotoğrafları karşılaştırmadın: biri renkli ve büyüktü (PVSK ek md. 6: aynı büyüklük ve özellik).',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_gozlem',
        'ev_gozlem',
        'Acil servisin hemşire gözlem formunu istemedin; teşhisten önce gösterilen tek fotoğrafın belgesiydi (CMK 177).',
        'ARASTIRMA',
      ),
      hint(
        'h_kadir',
        not(has('clue_kadir')),
        'Kılınçların evinde balkona bakmadın; üst kattaki komşu kesinti sırasında Barış’la konuşmuştu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_uedas',
        'ev_uedas',
        'Kadir Usta’nın andığı kesintiyi UEDAŞ kaydıyla saate bağlamadın; tanık saati bilmiyordu, kayıt biliyordu.',
        'USUL_BILGISI',
      ),
      hint(
        'h_selfie',
        not(has('ev_selfie')),
        'HızlıPaket’ten giriş cihazını ve kimlik doğrulama özçekimini istemedin; hesabı kimin taşıdığını gösteren kayıt oydu.',
        'USUL_BILGISI',
      ),
      hint(
        'h_cihaz',
        all(has('ev_gps'), not(has('clue_cihaz'))),
        'Konum dökümünde giriş cihazını kayıtlı cihazla karşılaştırmadın: kayıt hesabın yerini gösterir, kişinin değil.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_186',
        all(has('ev_tel'), not(has('clue_186'))),
        'Telefon raporundaki 23.40 aramasını kesinti kaydıyla birleştirmedin; Barış evinden arıza hattını aramıştı.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_salon',
        not(flag('h104_itiraz')),
        'Salonda, sanık sandalyesindeki tek kişiye yöneltilen teşhis sorusuna itiraz edebilirdin (CMK 201/1).',
        'USUL_BILGISI',
      ),
      hint(
        'h_bildir',
        all(flag('fact_tolga'), not(flag('bildirdi'))),
        'Başka bir kişinin fail olabileceğini öğrendiğinde savcılığa yazılı bildirimde bulunmadın (CMK 158, 160). Kovalamak avukatın işi değildir.',
        'USUL_BILGISI',
      ),
      hint(
        'h_etik',
        any(flag('nermin_baski'), flag('kadir_kocluk'), flag('ali_kocluk'), flag('zarf_tuttu'), flag('etik_kirlik')),
        'Etik çizgiyi aştın: tanığa söz ezberletmek, mağdurun kapısında ısrar etmek ya da çıkar çatışmasını saklamak (Av.K. 34; TCK 277).',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
