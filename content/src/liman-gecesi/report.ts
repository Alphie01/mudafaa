import { all, any, flag, has, hint, missedEvidence, not, ref } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 80-report: dava sonu raporundaki "kaçırdıkların". Her önemli delil ve karar için bir ipucu; metin oyuncuya neyi nerede
// kaçırdığını ve hukuki dayanağını söyler.

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_hesap',
        'ev_hesap',
        'Gülay’ın evinde hesap dökümünü istemedin: 23.37 iskele büfesi, dönüşün olmadığının ilk kaydıydı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_turnike',
        'ev_turnike',
        'Turnike ve araç kapısı kayıtlarını dilekçeyle istemedin (CMK 177): 23.18 çıkış ve 16 LMN 07 oradaydı.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_projektor',
        'clue_projektor',
        'Rıhtım fotoğraflarında projektör direğindeki bakım etiketini görmedin; “gündüz gibiydi” diyen teşhis ışığa dayanıyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_pil',
        'clue_pil',
        'Şükrü Usta’ya bağıranın ağzını görüp görmediğini sormadın; işitme cihazının pili bitikti.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_darbe',
        'ded_darbe',
        'Ön rapordaki dairesel çökme kırığını, nihai raporun histopatolojisindeki karşı darbe yokluğuyla birleştirmedin; o satırı okumayı Dr. Beyaz öğretirdi: düşme değil, darbe.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_saat',
        'ded_saat',
        'Nihai rapordaki mide içeriğini son öğünün saatiyle birleştirmedin; 23.34 ayrıca kantin kaydıyla ya da Şükrü Usta’nın kürsüdeki beyanıyla kayda girmeliydi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_arama',
        'clue_arama2341',
        'Telefon tutanağındaki 23.41 aramasını görmedin; kimsenin okumadığı kâğıt Ercan’ın son iki dakikasını taşıyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_abone',
        'ev_abone',
        '23.41’de aranan hattın abone bilgisini mahkemeden istemedin (CMK 135/6 çerçevesinde hâkim kararı).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_gps',
        'ev_gps',
        'Servis kamyonetinin araç takip ve zimmet kaydını istemedin; ölüm saatinde B sahasında duran tek araçtı.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_silah',
        'ded_silah',
        'Emanetteki kilidin konisini (2,6 cm) kırığın ölçüsüyle (3,2 cm) karşılaştırmadın.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_defter',
        'ev_defter',
        'Maktulün eşine gitmedin; Ercan’ın defteri 23.41 aramasının nedenini taşıyordu.',
        'ARASTIRMA',
      ),
      hint(
        'h_yumruk',
        not(flag('fact_yumruk')),
        'Tarık’ın “ittim” dediği yumruğu ondan duymadın; haksız tahrik (TCK 29) ancak sanığın dürüst anlatımıyla kurulur.',
        'SORGULAMA',
      ),
      hint(
        'h_durust',
        all(flag('fact_yumruk'), not(flag('durust_savunma'))),
        'Sanık yumruğu sana anlattı ama duruşmada anlatmadı; dürüst savunma görgü tanığı karşısında tek sağlam zemindi.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_suc',
        all(any(has('ev_abone'), has('ev_gps')), not(flag('suc_duyurusu'))),
        'Gerçek faile giden kayıtlar elindeydi ama savcılığa yazılı suç duyurusunda bulunmadın (CMK 158). Avukat kovalamaz, yazar.',
        'USUL_BILGISI',
      ),
      hint(
        'h_uyari',
        flag('kenan_uyarildi'),
        'Vardiya şefine 23.41 aramasını sordun; tanığı uyardın ve kit envanteri “düzeltildi”. Bilgi önce mahkemeye ve savcılığa gider.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_yuzles',
        flag('kenan_yuzles'),
        'Şüpheliyle duruşma dışında yüzleştin; delili ona gösterdin. Tanığı etkileme riski (TCK 277) ve delil karartmaya davet.',
        'USUL_BILGISI',
      ),
      hint(
        'h_telkin',
        flag('sukru_telkin'),
        'Şükrü Usta’ya ne söyleyeceğini öğütledin. Tanığa cümle verilmez (TCK 277; Av.K. 34).',
        'USUL_BILGISI',
      ),
      hint(
        'h_olum',
        all(ref('donus_yok'), not(ref('olum_sonra'))),
        'Teşhisi çürüttün ama savcılığın yedek tezini (yumruk → düşme → birkaç adım → ölüm) üç ayağından kürsüde düşürmedin; mahkeme ölümü yumruğa bağladı (TCK 87/4).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_tesis',
        all(any(flag('contra_k1'), flag('contra_n1')), not(ref('donus_yok'))),
        'Tanığın saatini kayıtla çürüttün ama yüzü görüp göremeyeceğini (bakım etiketi) ya da sanığın gece yarısına kadar nerede olduğunu (büfecinin radyosu) kürsüye getirmedin; tanık saatini esnetip teşhise tutundu.',
        'SORGULAMA',
      ),
      hint(
        'h_isik',
        all(any(flag('contra_k2'), flag('contra_n2')), not(ref('donus_yok'))),
        'Teşhisin ışığını ya da gece yarısını çürüttün ama tanığın kesinleştirdiği 23.40’ı turnike ve büfe kaydıyla birlikte göstermedin.',
        'SORGULAMA',
      ),
      hint(
        'h_b1',
        all(any(flag('b1_darbe'), flag('b1_kan')), not(flag('contra_b1'))),
        'Bilirkişiye “düşme değil” demek için iki ayak gerekiyordu: kırığın şekli (karşı darbe yok) ve babadaki kan (baş çarpmadı). Birini gösterdin.',
        'SORGULAMA',
      ),
      hint(
        'h_b5',
        all(flag('contra_b1'), flag('contra_b2'), not(flag('contra_b5'))),
        'Bilirkişinin “yaralı bir süre yürümüş olabilir” cevabına B sahası fotoğraflarını (yolda kan yok, sürüklenme ve araç izi) göstermedin; bilinç açıklığı ihtimali açık kaldı.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_bastir',
        any(
          all(has('ded_cikis'), not(flag('press_k1')), not(flag('contra_n1'))),
          all(has('ded_saat'), not(flag('press_b2'))),
        ),
        'Kâğıdı göstermeden önce tanığın ya da bilirkişinin iddiasını kendi ağzıyla kesinleştirmedin (BASTIR); “gibi” diyen tanık kâğıdın etrafından dolaşır.',
        'SORGULAMA',
      ),
      hint(
        'h_sukru',
        all(has('clue_pil'), not(flag('contra_s1'))),
        'Şükrü Usta’nın pilinin bittiğini biliyordun ama kürsüde göstermedin; “seni gebertirim” sanığa yazılı kaldı.',
        'SORGULAMA',
      ),
      hint(
        'h_baba',
        all(has('ded_kan'), not(flag('contra_s2'))),
        'Yumruğun başı babaya vurdurmadığını kurdun ama görgü tanığının “kafası çarptı” beyanına karşı sunmadın.',
        'SORGULAMA',
      ),
      hint(
        'h_twist',
        not(flag('twist_itiraz')),
        'Emanetteki kilide karşı söz almadın: biyolojik iz yok, parmak izi meslekten (CMK 217).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_olcu',
        all(flag('olcu_talep'), not(has('ded_silah'))),
        'Kilidin ölçüsünün kırıkla karşılaştırılmasını istedin; ama emanet fotoğraflarında koniyi ölçmedin.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_atk',
        all(not(flag('talep_atk')), not(flag('ek_atk'))),
        'Raporu düzenleyen uzmanın duruşmada dinlenmesini ne ilk celsede ne de arada istedin (CMK 68/1, 214/1); rapor okunmakla yetinildi, “oluşabilir” sorgulanmadı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_cokus1',
        flag('cokus1'),
        'İlk celsede ilgisiz belgeler sundun; güvenilirliğin tükenince heyet tanık sorgunu kesti. Bir belgeyi ancak bir beyanla bağını kurabildiğinde sun.',
        'SORGULAMA',
      ),
      hint(
        'h_b',
        flag('b_basarisiz'),
        'Esas savunmada başka bir failden söz ettin ama bunu kayıtlarla ve savcılığa bildirimle kurmadın; bir beraat türü delilin taşıyabileceği kadardır.',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
