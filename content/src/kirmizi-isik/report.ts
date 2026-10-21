import { all, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_fren',
        'ded_fren',
        'Fren izi ile ABS’yi birleştirmedin: 18 m kilit izi ABS’li bir araçtan çıkmaz; raporun 68 km/s hesabı yanlış araca dayanıyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_cam',
        'ded_cam',
        'Olay yerindeki far camı kırıkları ile Volkan’ın sağlam farlarını yan yana koymadın.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_yuks',
        'ded_yukseklik',
        'Otopsideki 56 cm’lik kırık ile 44 cm’lik tamponu karşılaştırmadın: ilk darbe daha yüksek bir tampondandı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_goremez',
        'ded_goremez',
        'Taksicinin durduğu köşeden Gökdere başlığının yalnızca arkası görünüyordu; gördüğü kendi kırmızısıydı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_ariza',
        'ded_ariza',
        'Kabindeki 15 Kasım etiketi ile ertelenen iş emri, arızanın önceden bilindiğini gösteriyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_saat',
        'ded_saat',
        'Büfe kamerasının saati yedi dakika ileriydi; UEDAŞ’ın gerilim kaydıyla düzeltilince Volkan’dan yedi saniye önce geçen bir araç görünüyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_sinyal',
        'ev_sinyal_log',
        'Kavşak denetleyicisinin kayıtlarını dilekçeyle istemedin (CMK 177): üst yazı “arıza yok” derken döküm “çatışan yeşil uyarısı bastırıldı” diyordu.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_edr',
        'ev_edr',
        'Aracın olay veri kaydedicisi (EDR) okutulmadı: 38 km/s ve normal fren tepkisi bilinçli taksir iddiasını çürütürdü.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_atk',
        'ev_atk',
        'Adli Tıp Kurumu Trafik İhtisas Dairesinden yaralanma mekanizması raporu istenmedi; illiyet bağı ancak bu raporla tartışılabilirdi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_olum',
        'ded_olum',
        'ATK raporunu sırttaki az kanamalı sıyrıklarla birleştirmedin: ölümcül travma birincil çarpmadaydı, Volkan’ın teması ikincildi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_bufe',
        'ev_bufe',
        'Köşedeki büfenin kamerası kavşağa bakıyordu; sahibinden kaydı gönüllü ve tutanakla alabilirdin.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_multi',
        'ev_multimedya',
        'Aracın multimedya ekranı görüşmenin eller serbest yapıldığını gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_boya',
        'ev_boya',
        'Maktulün montundaki boya parçasının kriminal incelemesini dilekçeyle istemedin (CMK 177); boya, ilk çarpan aracın rengini ve türünü gösterirdi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_arac',
        'ded_arac',
        'Boya raporu ile tek yanan stop lambasını tahtada birleştirmedin: kaçan aracın tarifi ancak bu ikisiyle kurulurdu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_sesli',
        'ev_sesli',
        'Hatice Hanım’ın o gece oğluna bıraktığı sesli mesaj dosyaya girmedi. Serkan’a saygıyla yaklaşıp annesini dinlemek, onun kendi kararıyla mesajı savcılığa vermesinin yolunu açardı.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_savcilik',
        'ev_savcilik',
        'Savcılığın panelvanı ve sürücüsünü tespit eden yazısı dosyaya hiç girmedi; aracın tarifine dayanan somut bir suç duyurusu (CMK 158) bunu sağlardı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_itiraz',
        not(flag('h1_itiraz')),
        'Bilirkişi raporuna somut gerekçelerle itiraz edip yeni heyet istemedin (CMK 67/5); rapor tartışılmamış bir zemin olarak kaldı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_yorum',
        not(flag('yorum_itiraz')),
        'Bilirkişinin “bilinçli taksirdir” cümlesine itiraz edebilirdin: bilirkişi hukuki nitelendirme yapamaz (CMK 67/3).',
        'USUL_BILGISI',
      ),
      hint(
        'h_heyet',
        all(has('ev_heyet'), not(flag('contra_heyet'))),
        'Heyet raporundaki “tali kusur” paragrafını EDR verisiyle karşılaştırmadın.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_suc',
        all(has('ded_arac'), not(flag('suc_dayanakli'))),
        'Kaçan aracın tarifi elindeydi; somut bir suç duyurusu (CMK 158) savcılığın aracı ve sürücüyü bulmasını sağlardı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_ayten',
        flag('ayten_kayip'),
        'Ayten’in sakladığı parçayı savcılığa tutanakla teslim etmesini önermeliydin; avukat delili kendi eline almaz.',
        'USUL_BILGISI',
      ),
      hint(
        'h_serkan',
        flag('serkan_kirgin'),
        'Katılana şikâyetten vazgeçme ya da para teklifi: taksirle öldürme şikâyete bağlı değildir ve beyanı etkilemeye yönelik teklif etik ihlaldir.',
        'HUKUKI_BILGI',
      ),
      hint(
        'h_kabul',
        flag('kabul'),
        'Volkan kürsüde kusurunu kabul etti. Duruşmadan önceki gece onu bilgilendirmek, kararını bilerek vermesini sağlardı.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_garaj',
        flag('etik_garaj'),
        'Kapalı bir işyerine izinsiz girerek delil toplamak suçtur ve delili hukuka aykırı kılar (TCK 116/2; CMK 206/2-a). Bilgiyi savcılığa bildirmek yeterdi.',
        'USUL_BILGISI',
      ),
    ],
  },
};
