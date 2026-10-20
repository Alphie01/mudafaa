import { all, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporunda "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      hint(
        'h_terminal',
        not(has('clue_terminal')),
        'İptal kayıtlarının terminal sütununu okumadın: 47 iptalin hepsi ön odadaki MHM-PC03’ten, hiçbiri Vezne 2’den değildi.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_cikis',
        not(has('clue_cikis')),
        'Orhan’ın turnike dökümünü iptal saatleriyle karşılaştırmadın: her akşam 17.10’dan önce çıkmıştı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_talimat',
        'ev_talimat',
        'Orhan’ın klasörlerine bakmadın; “Şifreler zarfta” diyen el yazısı not bordroların arasındaydı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_karbon',
        'ev_karbon',
        'Teslim tutanaklarının karbon kopyalarını bulmadın; dosyadaki asıllarla karşılaştırınca tutarlar farklıydı.',
        'ARASTIRMA',
      ),
      hint(
        'h_zilyet',
        not(has('ded_teslim')),
        'Paranın teslimden sonra kimin gözetiminde olduğunu kanıtlamadın (defter + karbon). Zimmetin ilk unsuru zilyetliktir (TCK 247/1).',
        'HUKUKI_BILGI',
      ),
      hint(
        'h_bilirkisi',
        not(has('ev_bilirkisi')),
        'Teftiş raporuna karşı bilişim bilirkişisi istemedin; idari inceleme bilirkişi raporu değildir (CMK 63, 67/3).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_kasa',
        'ev_kasa',
        'Kasa odasının alarm kayıtlarını istemedin; iptallerin ardından kasa her akşam aynı kodla açılmıştı.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_pdks',
        'ev_pdks_mud',
        'Müdürlük personelinin turnike kayıtlarını istemedin; iptal saatlerinde binada kimin kaldığını gösterecekti.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_ticket',
        'ev_ticket',
        'Bilgi işlemin şifre sıfırlama taleplerini istemedin; 14 Ocak akşamı sıfırlamayı isteyen Orhan değildi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_suc',
        not(flag('suc_duyurusu')),
        'Elindeki somut delillerle savcılığa suç duyurusunda bulunmadın (CMK 158); zarflar ancak aramayla emanete girebilirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_248',
        not(flag('bilgilendirdi')),
        'Etkin pişmanlık (TCK 248/3) yolunu müvekkiline dürüstçe anlatmadın; seçmek onundu, bilgilendirmek senin.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_zarf_acik',
        all(flag('fact_zarf'), not(flag('orhan_zarf_acik'))),
        'Orhan’ın zarfı kendisinin anlatmasını sağlamadın; gerçeği önce başka bir tanık söyleyince sanığın sözü değer kaybeder.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_tutanak',
        not(has('ded_sahte_tutanak')),
        'Dosyadaki tutanakların basım saatine ve imzanın eğik ışıktaki görüntüsüne bakmadın: rapor 17.56’da yeniden basılmış, imza toner. Belgenin sonradan düzenlendiğini göstermek, savcılığın “hileli davranış” dediği şeyin kime ait olduğunu sorar (TCK 247/2).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_izin',
        not(has('ded_izin')),
        '9 Ocak izin satırını iptal saatleriyle birleştirmedin: sanık hiç işe gelmediği gün bile kullanıcısı çalışmıştı. Tek bir gün, “kullanıcı = kişi” varsayımını tek başına çürütür.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_kredi',
        not(has('ded_kredi')),
        'Kredinin kaynağını tapu senediyle eşleştirmedin: savcılığın “saik” dediği ödeme miras tarlanın parasıydı. Saik delili çürütülmezse heyetin aklında bir soru olarak kalır (CMK 217).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_borc',
        not(has('ded_borc')),
        'Ön oda takvimindeki halkalı cumaları bilgi işlemin güvenlik duvarı kaydıyla birleştirmedin; iptallerin bir vadesi vardı ve borç sanığın değildi.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_zarflar_uv',
        all(has('ev_zarflar'), not(has('clue_zarf_uv'))),
        'Emanetteki zarfların kriminal raporundaki UV fotoğraflarına bakmadın: okilic zarfı açılıp yeniden kapatılmıştı. Mühürlü zarfın açıldığını göstermek, şifreye kimin eriştiği sorusunu kapatır.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_yedek',
        all(flag('fact_yedek'), not(flag('log_muhafaza'))),
        'Burak’ın aylık log yedeklerinin muhafazasını mahkemeden istemedin; sunucu kaydı doksan günde dönüyordu. Dijital delil bulunduğu yerde, usulüne uygun korunmalıdır (CMK 134).',
        'USUL_BILGISI',
      ),
      hint(
        'h_hayri',
        all(flag('fact_isik'), not(flag('hayri_tanik'))),
        'Hayri Bey’in 12 Şubat akşamı ön odada gördüğü ışığı tanık olarak bildirmedin. Saat ve yer söyleyen bağımsız bir tanık, kayıtları insan sesiyle doğrular (CMK 177–178).',
        'USUL_BILGISI',
      ),
      hint(
        'h_kesif',
        not(flag('fact_pc03')),
        'İptallerin yapıldığı ön odada bilirkişi eşliğinde keşif istemedin ya da yapmadın; yazıcı günlüğü, aşınmış tuşlar ve takvim o odadaydı (CMK 83).',
        'USUL_BILGISI',
      ),
      hint(
        'h_teklif',
        all(flag('teklif_iletildi')),
        'Tanığın “ifademi düzeltirim” teklifini müvekkiline taşıdın; bildirilmesi gereken yer savcılıktı (CMK 158).',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
