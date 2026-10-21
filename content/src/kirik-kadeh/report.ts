import { all, any, cmp, flag, has, hint, missedEvidence, not, ref, v } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların". Metin oyuncuya neyi nerede kaçırdığını ve dayanağını söyler.

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_adisyon',
        'clue_adisyon',
        'Gölge’deki adisyon çivisine bakmadın: masa 4’ün hesabı tanığın kartıyla ödenmişti.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_sap',
        'clue_sap',
        'Kolluk fotoğrafı 7’yi incelemedin: kırık sap katılanın elinin yanındaydı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_kan',
        'clue_kan',
        'Fotoğraf 3’teki kan tezgâhın içinde başlıyordu: ilk kesilen sanıktı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_kolon',
        'clue_kolon',
        'Masa 4’e oturup bakmadın: kolon tezgâhın önünü kapatıyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_anamnez',
        'clue_anamnez',
        'Acil kaydının anamnezini büyüteçle okumadın: katılan “yumrukla vuruldum” demişti.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_avuc',
        'clue_avuc',
        'Katılanın kesisi avucun içindeydi, enine: kırık camı kavrayan el.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_onkol',
        'clue_onkol',
        'Bora’nın darp raporundaki kesi ulnar yüzdeydi: bir savunma yarası.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_tanidik',
        'ded_tanidik',
        'Adisyon ile “müştekiyi tanımam” cümlesini tahtada birleştirmedin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kadeh',
        'ded_kadeh_serkan',
        'Fotoğraf 7 ile avuçtaki kesiyi birleştirmedin: sap katılanın elindeydi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_savunma',
        'ded_savunma',
        'Önkoldaki kesi ile tezgâhın içindeki kanı birleştirmedin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_yumruk',
        'ded_yumruk',
        'Anamnez ile tanığın “kadehle yüzüne vurdu” cümlesini birleştirmedin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_bilek',
        'ded_bilek',
        'Adli Tıp’taki bilek bası izi ile “tekme” cümlesini ara dönemde tahtada birleştirmedin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kriminal',
        'ev_kriminal',
        'Kırık kadeh hiç incelenmedi: Kriminal inceleme dilekçeyle ya da duruşmada istenebilirdi (CMK 177, 206/1).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_eczane',
        'ev_eczane',
        'Eczanenin kapıya bakan kamerası tanığı katılanla kol kola gösteriyordu; kayıt mahkemeden istenmeliydi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_video',
        'ev_video',
        'Masa 7’deki müşteri o gece hikâye çekmişti; adisyon ve Ece’nin sözü bunu gösteriyordu.',
        'ARASTIRMA',
      ),
      hint(
        'h_ece',
        all(not(flag('ece_tanikti')), not(flag('ece_coktu'))),
        'Askıdaki önlüğün sahibi Ece olayı gören tek tarafsız tanıktı; onu bulup tanık olarak dinlenmesini istemek gerekiyordu (CMK 177/1).',
        'ARASTIRMA',
      ),
      hint(
        'h_onluk',
        not(has('clue_onluk')),
        'Gölge’de mutfak kapısının yanındaki önlüğe bakmadın: dosyada adı olmayan bir garson vardı.',
        'ARASTIRMA',
      ),
      hint(
        'h_ozel',
        flag('ozel_kabul'),
        'Katılanın özel klinik raporu uzman görüşüdür (CMK 67/6); resmî Adli Tıp raporu karşısında itiraz edilmeliydi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_kamera',
        flag('kamera_ortaya'),
        'Müvekkile “kamera bozuktu” dedirtmek gerçeğe aykırı beyandı (Av.K. md. 34); zaman ayarlı priz bir kabahatti, yalan ise savunmayı yaktı.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_onur_etik',
        any(flag('onur_tehdit'), flag('onur_kayit'), flag('onur_vaat')),
        'Karşı tarafın tanığını tehdit etmek, ondan gizli beyan almak ya da ona sonuç vaat etmek tanığı etkilemektir (TCK 277). Doğru yol: savcılığa ve mahkemeye yönlendirmek.',
        'USUL_BILGISI',
      ),
      hint(
        'h_temas',
        flag('serkan_temas'),
        'Avukatla temsil edilen karşı tarafla avukatı dışında görüşülmez (TBB Meslek Kuralları).',
        'USUL_BILGISI',
      ),
      hint(
        'h_teklif',
        flag('teklif_kabul'),
        'Silahla yaralama şikâyete bağlı değildir (TCK 86/3); şikâyetten vazgeçme karşılığı para teklifi davayı düşürmezdi.',
        'HUKUKI_BILGI',
      ),
      hint(
        'h_tahta',
        cmp(v('wrong_pair'), '>=', 3),
        'Tahtada çok sayıda yanlış eşleşme denedin: iki kartı birleştirmeden önce “bu ikisi aynı gerçeği mi söylüyor?” diye sor.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_ara',
        not(ref('ara_gelisme')),
        'Ara dönemi kürsüye taşınacak bir gelişme olmadan geçti: gelen raporları okumak, tutanağı yazan memuru dinlemek, masa 7’deki kaydı istemek ya da bileği tahtada kurmak ikinci celsenin dayanağıydı.',
        'ARASTIRMA',
      ),
      hint(
        'h_supheden',
        all(not(flag('supheden')), not(flag('mm_kabul')), any(flag('contra_o1'), flag('contra_o4'))),
        'Çelişkileri açtın ama esas savunmayı onlara bağlamadın: şüphe ya da meşru savunma talebi delille kurulmalıydı.',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
