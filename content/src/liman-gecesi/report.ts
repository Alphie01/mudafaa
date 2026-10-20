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
        'Ön rapordaki dairesel çökme kırığını ve karşı darbe lezyonunun yokluğunu birleştirmedin: düşme değil, darbe.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_saat',
        'ded_saat',
        'Mide içeriğini kantin kaydıyla birleştirmedin: ölüm 23.34’ten sonraydı.',
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
        'Dönüşün olmadığını kanıtladın ama ölümün sonradan geldiğini kanıtlamadın; mahkeme ölümü yumruğa bağladı (TCK 87/4).',
        'DELIL_ANALIZI',
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
        not(flag('talep_atk')),
        'Raporu düzenleyen uzmanın duruşmada dinlenmesini istemedin (CMK 67/4, 211); mahkeme onu resen çağırdı.',
        'USUL_BILGISI',
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
