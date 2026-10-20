import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların" — neyi, nerede, hangi dayanakla.

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_sure',
        'ded_sure_disi',
        'Dinleme kararı iki aylıktı ve uzatılmamıştı; “zarf yarın masada” kaydı süre bittikten sonra alınmıştı (CMK 135/4, 137/1). Kararın süresini kayıt #14’ün tarihiyle tahtada birleştirmek gerekiyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_hat',
        'ded_hat_disi',
        'Kayıt #9 sanığın kendi hattındandı; karar yalnızca müteahhidin hattını gösteriyordu. Savcılık talimatı hâkim kararının yerini tutmaz (CMK 135/1, 135/9).',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_cagri',
        'ded_sahte_cagri',
        'Halil takvimine arayan dahiliyi yazmıştı: 214. Koridordaki rehber, makamın 201 olduğunu gösteriyordu. Biri onu odasından uzaklaştırdı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_bos',
        'ded_bos_oda',
        'Tutanağın kendi saatleri: kayıt 10.39’da kesildi, polis 10.44’te boş odaya girdi. Zarf çekmeceye sanık yokken girdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_yetki',
        'ded_yetkisiz',
        'Muhbirin “dosyamı bekletiyordu” anlatısı, dosyanın Devir-2’de olduğunu gösteren iş dağıtım kaydıyla çökerdi; irtikabın nüfuz unsuru yoktu (TCK 250/1).',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_iki',
        'ded_iki_hikaye',
        'Muhbir 11 Mart’ta “zorla istedi”, 13 Mart’ta “anlaştık” dedi. İki ifadeyi karşılaştırmak, irtikap–rüşvet ayrımını ve beyanın güvenilirliğini tartıştırırdı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kamera',
        'ev_kamera',
        'Koridor kamerası doksan gün saklanıyordu; CMK 177 dilekçesiyle ya da duruşmada istenebilirdi. 10.41’de odaya giren kişi orada görünüyordu.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_cihaz',
        'ev_cihaz',
        '“Teknik arıza” denen kayıt cihazı bilirkişiye incelettirilebilirdi (CMK 63). Günlük, kaydın elle durdurulduğunu ve son saniyelerde ikinci bir sesi gösteriyordu.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_santral',
        'ev_santral',
        'Santral dökümü ve izin çizelgesi, sahte çağrının o sabah tek kişinin oturduğu bir odadan geldiğini gösterirdi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_zarf',
        'ded_zarf_kaynagi',
        'Zarfın barkodu 0417, arşivdeki zimmet defterinde Devir-2’ye verilen 0401–0450 destesindeydi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_defter',
        'ev_kirmizi_defter',
        'Halil’in kırmızı defteri arşivde, 1987 ciltlerinin arkasındaydı. Güven kazanarak yerini öğrenebilir, tanığın çıkarını gösterebilirdin.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_alibi',
        'ded_alibi',
        'Çay ocağının defteri, “arşivdeydim” diyen memurun ısmarladığı çayın boş bir arşive götürüldüğünü gösteriyordu.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_red',
        all(not(flag('red_14')), not(flag('contra_k1'))),
        'Hukuka aykırı delile, ortaya konulduğu anda itiraz edilir (CMK 206/2-a). Kayıtlar okunmadan önce kalkmak gerekiyordu.',
        'USUL_BILGISI',
      ),
      hint(
        'h_kiskirtma',
        not(flag('contra_k2')),
        'Seri numarası tutanağı paranın Emniyet’ten çıktığını gösteriyordu: muhbir kolluğun talimatıyla hareket eden bir ajandı. Kışkırtma tartışması (AİHS 6) bu belgeyle açılırdı.',
        'SORGULAMA',
      ),
      hint(
        'h_inkar',
        flag('halil_inkar'),
        'Müvekkile inkâr, hele bir başkasını işaret ederek, tavsiye etmek meslek kurallarına aykırıdır (Av.K. 34). Doğru yol, öncelikli randevuyu gerekçesiyle ve karşılık alınmadığını göstererek anlatmaktı.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_tanik',
        flag('tanik_etkileme'),
        'Tanığa ne söyleyeceğini dikte etmek tanığı etkilemedir (TCK 277). Muhbiri kendi avukatına, çaycıyı mahkemeye yönlendirmek gerekirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_bayram',
        all(flag('bayram_yazdirildi'), not(flag('bayram_avukat'))),
        'Kendisi de şüpheli olabilecek muhbirden yazılı beyan almak meslek kurallarına aykırıdır; onu adli yardıma yönlendirip mahkemede dinletmek gerekirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_sinan_cagri',
        all(any(has('ded_sahte_cagri'), has('ded_tek_kisi')), not(flag('sinan_cagrildi'))),
        'Sahte çağrının geldiği dahilinin kullanıcısını tanık olarak çağırtmadın; kürsüde sınanmayan bir alibi, hükümde de sınanmaz.',
        'USUL_BILGISI',
      ),
      hint(
        'h_tehdit',
        all(any({ visited: 'INV1_AKSAM2' }, { visited: 'ARA_AKSAM' }), not(flag('tehdit_bildirildi')), not(flag('sinan_bildirildi'))),
        'Sana yönelik örtülü tehditler ve tanığın kendiliğinden yaklaşması belgelenip savcılığa bildirilmeliydi (TCK 106; CMK 158).',
        'USUL_BILGISI',
      ),
      hint(
        'h_ek',
        not(any(flag('ek_savunma_tam'), flag('ek_sure'))),
        'Vasıf değişikliği bildiriminde ek savunma ya hazırlıkla verilir ya da süre istenir (CMK 226/1, 226/3). İrtikabın icbar ve nüfuz unsurlarının yokluğu belgeyle gösterilebilirdi.',
        'HUKUKI_BILGI',
      ),
    ],
  },
};
