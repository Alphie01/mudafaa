import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların" — neyi, nerede, hangi dayanakla.

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_kaynak',
        'clue_kaynak_dosya',
        'Aktarım formundaki kaynak dosya satırına büyüteçle bakmadın: CD bir saatlik, dört kanallı kaydın 2,5 dakikasıydı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kamera',
        'clue_dort_kamera',
        'Hat 38’e aynı saatte binip tavandaki dört kamerayı saymadın.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_son_kare',
        'clue_son_kare',
        'CD’nin son karesindeki durak ekranı (“Beşevler”) kartları Arda’nın kullanamayacağını gösteriyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_harcama',
        'clue_harcama_saat',
        'Banka dökümündeki ilk harcamanın saatine ve yerine bakmadın (18.49, Altıparmak).',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kart',
        'ded_kart_baskasi',
        'Son kare ile 18.49 harcamasını tahtada birleştirmedin: kartları kullanan Arda olamazdı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_not',
        'clue_sari_not',
        'Emanetteki sarı notu okumadın: “Yarın 9 — karakol. G. Sarı cüzdan.”',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_153',
        'clue_153_arama',
        'Arda’nın telefonundaki 153 aramasını bulmadın; çağrı merkezi her şeyi kaydeder.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_teslim',
        'ded_teslim',
        'Sarı not ile 153 aramasını birleştirmedin: teslim niyetinin en güçlü izi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_gozluk',
        'ded_hayri_gormedi',
        'Hayri Bey’in gözlüksüz gazete okuduğunu ve 9 numaranın açısını birleştirmedin.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_buldu',
        'ded_buldu',
        'Koltuk altındaki boşluk ile CD’nin ilk karelerini birleştirmedin: kayıt bir alma değil, bir bulmaydı.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_tam_kayit',
        not(any(flag('kayit_istendi'), flag('kayit_istendi_h1'))),
        'Tam sefer kaydını ne dilekçede (CMK 177) ne duruşmada (CMK 206/1) istedin. Eksik dakikalar arşivde kaldı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_cagri',
        not(any(flag('cagri_istendi'), flag('cagri_istendi_h1'))),
        '153 çağrı kaydını istemedin; teslim niyetinin tarafsız kanıtı belediyenin arşivinde kaldı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_recep',
        not(flag('recep_cagrildi')),
        'Şoför Recep Ateş’i tanık olarak dinletmedin; teslim girişiminin muhatabı oydu (CMK 210).',
        'USUL_BILGISI',
      ),
      hint(
        'h_sofor_red',
        all(flag('recep_cagrildi'), not(flag('contra_r'))),
        'Şoförün “kimse getirmedi” beyanı ön kameranın 19.05 karesiyle çürütülebilirdi.',
        'SORGULAMA',
      ),
      hint(
        'h_birakan',
        not(flag('sebeke_yakalandi')),
        'Gerçek failler için: tam kayıtta cüzdanı bırakanı ve inenleri bağla, büfedeki fişi Cemil Usta’yla oku, onu savcılığa yönlendir ve somut delillerle suç duyurusunda bulun (CMK 158).',
        'ARASTIRMA',
      ),
      hint(
        'h_gulten',
        not(flag('gulten_tanik')),
        'Arda’nın Facebook mesajını duruşmada anlatması müştekiyi harekete geçirirdi; müştekiyi yönlendirmeden dinlemek onu mahkemeye kendi sözüyle getirdi.',
        'SORGULAMA',
      ),
      hint(
        'h_ek',
        not(flag('ek_sure')),
        'Nitelendirme uyarısında ek savunma için süre istenebilirdi (CMK 226/3).',
        'USUL_BILGISI',
      ),
      hint(
        'h_kanaat',
        all(flag('press_hs2'), not(flag('ob_kanaat'))),
        'Hayri Bey yüzü görmediğini söyleyip “eminim” dedi: bu bir kanaatti ve itiraz edilebilirdi.',
        'SORGULAMA',
      ),
      hint(
        'h_duyum',
        all(flag('press_hs3'), not(flag('ob_duyum'))),
        'Hayri Bey “polis de söyledi, kamerada görmüşler” dedi: kendi gözlemi değil, duyumdu; itiraz edilebilirdi.',
        'SORGULAMA',
      ),
      hint(
        'h_hayri_kismi',
        all(flag('contra_h1_kismi'), not(flag('contra_h1'))),
        'Kolluk beyanı Hayri Bey’in gazete okuduğunu gösteriyordu; gözlük ve koltuk açısıyla kurulan çıkarım teşhisi tamamen çökertirdi.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_izle',
        all(has('ded_birakan'), not(flag('izlendi_birakma'))),
        'Tam kaydın 18.36–18.37 karelerini duruşmada ayrıca izletebilirdin.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_telkin',
        any(flag('cemil_kirli'), flag('hayri_kare_gosterildi')),
        'Bir tanığa tek bir görüntü gösterip “bu mu?” diye sormak telkinli tanımadır; karakolda Hayri Bey’e yapılan hatanın aynısı. Kimlik tespiti kolluğun işidir.',
        'SORGULAMA',
      ),
      hint(
        'h_kovalama',
        flag('yanlis_gitti'),
        'Şüphelileri durakta beklemek avukatın işi değildi; bilgi Cumhuriyet Başsavcılığına iletilmeliydi (CMK 158).',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_musteki',
        any(flag('gulten_kirildi'), flag('gulten_para')),
        'Müştekiye şikâyetten vazgeçmeyi ya da para teklif etmek onu etkileme girişimidir; hırsızlık şikâyete de bağlı değildir. Doğru yol yalnızca dinlemekti.',
        'USUL_BILGISI',
      ),
      hint(
        'h_etik',
        flag('recep_baski'),
        'Tanığı korkutmaya çalıştın; tanığa yalan tanıklığın sonuçlarını hatırlatmak hâkimin işidir (CMK 53), tanığı etkileme girişimi suç olabilir (TCK 277).',
        'USUL_BILGISI',
      ),
    ],
  },
};
