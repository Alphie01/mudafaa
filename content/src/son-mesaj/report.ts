import { all, flag, hint, missedEvidence, not, visited } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_ded_ss',
        'ded_ss',
        'Ekran görüntüleri karardan önce, imzasız bir rızayla alınmıştı; bunu tahtada birleştirip hükme esas alınmasını engelleyebilirdin (CMK 134/1, 217/2).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_ded_bagli',
        'ded_bagli',
        'Ek-3’teki “gönderen cihaz” sütunu ile hesaptaki bağlı cihaz: tehditler telefondan değil, bir masaüstü oturumundan çıkmıştı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_ded_hastane',
        'ded_hastane',
        '9 Kasım gecesi telefon kilitli ve şarjdaydı; onam formunun saati mazereti kâğıda döküyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_ev_hesap',
        'ev_hesap',
        'Hesap sahibi kendi oturum geçmişini indirebilir; noter ve hash ile bu veriyi savunman için koruyabilirdin.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_ev_isp',
        'ev_isp',
        'Üç gecenin IP adresinin abonesini mahkemeden sorgulatabilir, tehdit hattının sahibini gösterebilirdin.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_ded_laptop',
        'ded_laptop_ozan',
        'Demirbaş listesi ve koli: 07 numaralı dizüstünün ofise hiç dönmediğini gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_ev_laptop',
        'ev_laptop',
        'Somut dayanaklı bir suç duyurusu, savcılığın 07 numaralı dizüstüyü bulup el koymasını sağlayabilirdi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_ded_zincir',
        'ded_zincir',
        'Telefon mühürsüz bir zarfta iki gün durdu, hash ancak 14 Kasım’da alındı; bu boşluğu tahtada kurup kolluğa ve bilirkişiye sorabilirdin (CMK 134).',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_ded_ip',
        'ded_ip_tekin',
        'Sağlayıcının yanıtını hesap verisindeki IP ile birleştirseydin, tehdit hattının kime ait olduğu tahtada belirirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_vakif',
        'clue_vakif_yazi',
        'Vakfın gelen evrak defterinde, ses kaydından yedi saat sonra kaydın varlığını bilen bir e-posta duruyordu; ihale dosyasına bakabilirdin.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_uslup_ozan',
        'ded_uslup_ozan',
        'Tehditlerin “Sn.” ve “Saygılar.” imzası, mali müşavirin sakladığı e-postada ve vakfa giden yazıda da vardı; tahtada yan yana koyabilirdin.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_bilirkisi',
        not(flag('bilirkisi_istendi')),
        'Bağımsız bir adli bilişim bilirkişisi istemedin; avukatın teorisi, bilirkişinin ağzından delile dönüşür (CMK 63 vd.).',
        'USUL_BILGISI',
      ),
      hint(
        'h_rapor',
        all(flag('bilirkisi_istendi'), not(visited('ARA_RAPOR'))),
        'Bilirkişi raporu arada dosyaya girdi ama okumadın; Bulgu 3 ve “Sınır” satırı ikinci celsede bilirkişiyi daraltmanın anahtarıydı.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_suc',
        all(not(flag('suc_duyurusu')), not(flag('karartma'))),
        'Gerçek faile giden yol suç duyurusuydu (CMK 158): avukat şüpheliyi kovalamaz, delili savcılığa taşır.',
        'USUL_BILGISI',
      ),
      hint(
        'h_iftira',
        flag('iftira_savunma'),
        'Dayanaksız bir iftirayı savunmaya dayanak yapmak heyeti soğutur; elindeki somut delillere güven.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_uslup',
        not(flag('fact_melis_sn')),
        'Katılan, mesajların Tarık’ın diline benzemediğini ilk günden sezmişti; bunu kürsüde ortaya çıkarabilirdin.',
        'SORGULAMA',
      ),
    ],
  },
};
