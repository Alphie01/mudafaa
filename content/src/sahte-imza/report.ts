import { all, flag, has, hint, missedEvidence, not, visited } from '../../../tools/content/src/kit/index.js';
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
        'h_rapor_belirsiz',
        has('ev_rapor2_belirsiz'),
        'Bilirkişi talebin gerekçesizdi: irsaliyelerdeki iki ayrı eli göstermeden ve noter, banka, nüfus imzalarını tek tek saymadan istedin. Adli Tıp tek bir mukayese imzasıyla kesin kanaate varamadı (CMK 63, 67/5).',
        'USUL_BILGISI',
      ),
      hint(
        'h_randevu_no',
        all(has('ev_randevu'), not(has('ded_randevu'))),
        'Randevu kaydındaki numarayı matbaanın duvarındaki numara çizelgesiyle yan yana koymadın; numaranın sahibi tahtada belli olurdu.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_suret',
        not(has('ded_suret_sahte')),
        'Suretteki toner mührü noterin arşiv nüshasıyla karşılaştırmadın: asılda satış yetkisi yoktu; suret asıldan kopyalanıp değiştirilmişti.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_kimlik',
        not(has('ded_kimlik')),
        'Ceketin iç cebini ve 09.52’deki “kimliğimi bulamıyorum” mesajını birleştirmedin: kimlik o sabah sahibinde değildi.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_borc',
        not(has('ded_borc')),
        'Emlak bürosundaki masa takvimine ve bahis borcu mesajlarına bakmadın: bedelin büyük kısmı nakit ödenmemiş, bir borca mahsup edilmişti.',
        'ARASTIRMA',
      ),
      hint(
        'h_kurye',
        all(has('ev_kargo'), not(flag('mazeret_tanik'))),
        'Kuryeyi tanık olarak dinletmedin ya da ona açık uçlu sormadın; terminal kaydının yanında bir insanın hatırladığı sabah, mazereti tamamlardı.',
        'SORGULAMA',
      ),
      hint(
        'h_hak',
        all(visited('C2_03C'), not(flag('hak_hatirlatildi'))),
        'Akraba tanığın çekinme hakkının ve kendini suçlayan sorulara cevap vermeme hakkının hatırlatılmasını istemedin (CMK 45, 46, 48).',
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
