import { flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporunda "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      hint(
        'h_sivanma',
        not(has('clue_sivanma')),
        'Tapu senedindeki imzaya büyüteçle bakmadın: mürekkep sağa sıvanmıştı; imzayı sol eliyle yazan biri atmıştı.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_sag_el',
        not(has('clue_sag_el')),
        'Müvekkiline hangi elle yazdığını sormadın. Sıvanmış mürekkep ancak sağlak bir sanıkla yan yana konunca konuşur.',
        'SORGULAMA',
      ),
      hint(
        'h_mukayese',
        not(has('clue_mukayese_ozel')),
        'Raporun ekini okumadın: mukayese belgelerinin hepsi özel belgeydi; resmî makam önünde atılmış bir imza yoktu (CMK 67/5; TCK 204–207 ayrımı).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_iki_el',
        not(has('clue_iki_el')),
        'Matbaadaki irsaliye karbonlarını karşılaştırmadın: “V. Ateş” imzaları iki ayrı elden çıkmıştı.',
        'ARASTIRMA',
      ),
      hint(
        'h_g3',
        not(flag('contra_g3')),
        'Tapu memuruna kalemi hangi eliyle tuttuğunu sormadın; bastırsaydın zincirin gerildiğini hatırlayacaktı.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_rapor2',
        'ev_rapor2',
        'Resmî mukayese imzalarıyla Adli Tıp’tan yeni rapor istemedin (CMK 63, 67/5). Davanın tek ağır delili tartışmasız kaldı.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_kargo',
        'ev_kargo',
        'Takvimdeki “kargo 11.30” notunu kayda bağlamadın; kurye terminali müvekkilini 11.19–11.37 arasında matbaada gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_randevu',
        'ev_randevu',
        'Tapu randevusunu kimin aldığını sormadın; arayan numara kayıtlıydı ve mahkeme yazısıyla bir günde gelirdi.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_tutanak',
        'ev_tutanak',
        'Mukayese belgelerinin asıl teslim tutanağını istemedin; teslim edenin adı faks kopyasında okunmuyordu.',
        'USUL_BILGISI',
      ),
      hint(
        'h_suc',
        not(flag('suc_duyurusu')),
        'Bulduğun halkaları somut bir suç duyurusuyla savcılığa bildirmedin (CMK 158); savcılık üçüncü kişinin örneklerini Adli Tıp’a gönderebilirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_etik',
        flag('tarik_sir'),
        'Dosyanın ayrıntılarını müvekkilinin izni olmadan bir aile üyesine anlattın (Av.K. 36).',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
