import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_numune',
        'clue_numune',
        'Bilirkişi raporunun materyal satırı numuneleri kolluğun değil, katılan eksperinin teslim ettiğini söylüyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_cizelge',
        'ev_cizelge',
        'Olay yerini o sabah bekçi muhafaza ediyordu; devriye çizelgesi eksperin 09.20–10.05 arasında tek başına girdiğini gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_zincir',
        'ded_zincir',
        'Numunelerin kaynağı ile bekçi çizelgesi birlikte, kopuk numune zincirini gösterirdi (CMK 217).',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_tavan',
        'clue_foto_tavan',
        'Kolluğun 04.30 karesinde salon zemini çökmüş tavanla örtülüydü.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_temiz',
        'ded_temizlenmis',
        '04.30 karesi ile eksperin 09.40 fotoğrafı yan yana, “döküntü izi”nin moloz kaldırıldıktan sonra doğduğunu gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_pano',
        'ded_pano',
        'Pano emanette kalmış, hiç incelenmemişti: “elektrik izi yok” cümlesinin dayanağı yoktu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_taze',
        'ded_taze',
        'Laboratuvarın dipnotu “düşük buharlaşma” diyordu; saatlerce ateş ve seksen dakika sudan sonra taze benzin beklenmez.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_bidon',
        'clue_bidon',
        'Atölyede, jeneratörün yanında dört litre benzinle dolu bidon duruyordu; kolluk hiç bakmamıştı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_tasima',
        'ded_tasima',
        'Restorasyon sözleşmesi odaların 15 Ocak’a kadar boşaltılmasını istiyordu; eşyalar etiketliydi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_banka',
        'ded_banka',
        'Poliçe kredinin şartıydı; dain-i mürtehin kaydı nedeniyle tazminat önce bankaya gidecekti.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_artis',
        'ded_artis',
        'Teminat artışını acente kampanya kapsamında teklif etmişti; çağrı kaydı acentenin sisteminde.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_onlem',
        'ded_onlem',
        'Elektrikçinin notu ile restorasyon sözleşmesi, uyarı üzerine yenilemenin takvime konduğunu gösterirdi; taksir hatırlatmasına cevap buydu (TCK 22/2).',
        'HUKUKI_BILGI',
      ),
      missedEvidence(
        'h_ariza',
        'ev_ariza',
        'Dağıtım şirketinin arıza kayıtlarını delil dilekçesiyle (CMK 177) ya da duruşmada (CMK 206/1) isteyebilirdin.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_ark',
        'ev_ark',
        'Emanetteki panonun elektrik bilirkişisine incelettirilmesini isteyebilirdin (CMK 63, 67/5).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_lab',
        'ev_lab',
        'Laboratuvarın ham verisi numunelerde yanma ürünü olmadığını gösterecekti.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_notr',
        'ded_notr',
        'Arıza kaydındaki 02.08 nötr kopması ile Saadet Hanım’ın yangından önce yanan televizyonu, yangının dış bir etkenle çıktığını gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_tahkim',
        'ev_tahkim',
        'Gülsüm Yaşar’ın elindeki tahkim kararı, eksperin aynı türden raporunun daha önce reddedildiğini gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_kopya',
        'ded_kopya',
        'İki rapordaki aynı paragraf ve suiistimal primi, eksperin raporunun bir kalıp olduğunu gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_elkoyma',
        'ev_elkoyma',
        'Eksper hakkında savcılığa suç duyurusunda bulunsaydın (CMK 158; TCK 267/2) aracında el koyma yapılabilirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_kendin',
        flag('eksper_uyarildi'),
        'Eksperi kendin sıkıştırmaya gittin: uyarılan şüpheli delilleri temizler. Doğru yol savcılığa bildirmekti.',
        'USUL_BILGISI',
      ),
      hint(
        'h_telkin',
        flag('saadet_telkin'),
        'Saadet Hanım’a cevabı sen verdin (“kablo kokusuydu, değil mi?”); duruşmada bu, hem tanığın hem senin güvenilirliğini götürdü.',
        'SORGULAMA',
      ),
      hint(
        'h_cevdet',
        flag('cevdet_telkin'),
        'Bekçiye görmediği bir şeyi söylemesini önerdin; tanığa ne söyleyeceği söylenmez (TCK 272, 38; Av.K. 34).',
        'SORGULAMA',
      ),
      hint(
        'h_taksir',
        all(flag('contra_b2'), not(flag('taksir_cevap'))),
        'Kasıt düşünce hâkim taksiri sordu (CMK 226); yenileme takvimi ya da nötr kopması bu kapıyı kapatırdı.',
        'HUKUKI_BILGI',
      ),
      hint(
        'h_borc',
        flag('borc_gizle'),
        'Müvekkile borcu “geçiştirmesini” söyledin; dosyada olan bir gerçeği geçiştirmek, onu yalan söyleyen biri gibi gösterir.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_eksper_itiraz',
        not(flag('h1_eksper_itiraz')),
        'Ekspertiz raporu katılanın uzman görüşüdür; yazarının tanık olarak dinlenmesini isteyebilirdin (CMK 67/6, 210/1).',
        'USUL_BILGISI',
      ),
      hint(
        'h_onlem_sor',
        all(flag('q_elektrik'), not(flag('q_onlem'))),
        'Sanığa tesisatın eski olduğunu sordun ama ardından ne yaptığını sormadın: savcı “biliyordu” cümlesini taksire taşıdı.',
        'SORGULAMA',
      ),
      hint(
        'h_sanik_sor',
        not(any(flag('q_benzin'), flag('q_esya'))),
        'Birinci celsede sanığa benzinin ve eşyaların hikâyesini sorup hâkime kendi ağzından anlattırabilirdin.',
        'SORGULAMA',
      ),
      hint(
        'h_fener',
        not(has('ded_fener')),
        'Saadet Hanım’ın gördüğü el fenerli adam, 01.30’da devriye gezen bekçiydi.',
        'DELIL_ANALIZI',
      ),
    ],
  },
};
