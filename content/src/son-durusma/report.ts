import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 85-report: dava sonu raporunda "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      hint(
        'h_davet',
        not(has('clue_davet')),
        'Telefon raporunu iddianameyle karşılaştırmadın: 22.47’de maktul sanığı ofise çağırmıştı. Tasarlamanın “bekleyiş” ayağı buna dayanıyordu (TCK 82/1-a).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_mesaj',
        not(has('clue_mesaj_tam')),
        'Pazartesi mesajının tamamını okumadın: “Neden yaptığını yüzüne soracağım.” Kesilmiş bir cümle bir kararı, tamamı bir soruyu söylüyordu.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_bileme',
        not(has('ded_bileme')),
        'Bileği taşının şefin cuma nişanı talimatıyla alındığını göstermedin; mutfak tahtası ve şefin mesajı oradaydı.',
        'ARASTIRMA',
      ),
      hint(
        'h_suleyman',
        not(has('clue_dolmus')),
        'Bulaşıkçıya sanığın çıkışını sormadın; dolmuş saatiyle 23.40’ta, elleri boş gördüğünü kimse sormamıştı.',
        'SORGULAMA',
      ),
      hint(
        'h_ifade',
        not(has('clue_tarik_bicak')),
        'Baş tanığın ifadesini olay yeri tutanağıyla karşılaştırmadın: bıçak ofiste, önlük askıda ve temizdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kent',
        'ev_kentkart',
        'Kentkart binişlerini istemedin; sanık 23.52’de İskele’de otobüse binmişti (CMK 177).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_z',
        'ev_z',
        'Kasanın Z raporunu istemedin; tanığın “00.15’e kadar sayım” dediği kasa 23.48’de kapanmıştı.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_dvr',
        'ev_dvr',
        '“Arızalı” denen kayıt cihazının incelenmesini istemedin; cihaz çalışıyordu ve sanık çıktıktan sonra fişi çekilmişti.',
        'USUL_BILGISI',
      ),
      hint(
        'h_sonarama',
        not(has('clue_son_arama')),
        'Maktulün HTS’indeki son aramayı vekâletnamedeki numarayla karşılaştırmadın: 23.58’de sanığın babası aranmıştı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_sesli',
        'ev_sesli',
        'Kemal Yalçın’ın telefonundaki sesli mesajı bilirkişiye göndermedin; maktul sanık otobüsteyken konuşuyordu ve kapıda biri vardı (CMK 63, 177).',
        'USUL_BILGISI',
      ),
      hint(
        'h_gomlek',
        not(has('ded_gomlek')),
        'Garsonun 23.12 fotoğrafını olay yeri karesi 44 ile karşılaştırmadın: baş tanık o gece gömlek değiştirmişti.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_mektup',
        not(has('ded_mektup')),
        'Emanetteki not bloğuna yan ışıkla bakmadın; koparılan mektubun izi oradaydı ve eşyalarda mektup yoktu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_arsiv',
        'ev_arsiv',
        '2004/311 dosyasının arama tutanağını istemedin; baş tanığın adı ve imzası o gece evde bulunanlar arasındaydı (CMK 206).',
        'USUL_BILGISI',
      ),
      hint(
        'h_leyla',
        all(flag('in_court'), not(flag('leyla_korundu'))),
        'Savcı Leyla’yı tanık olarak istediğinde doğru dayanak meslek sırrıydı: avukat, mesleği sırasında öğrendikleri hakkında tanıklıktan çekinebilir (CMK 46/1-a; Av.K. 36).',
        'USUL_BILGISI',
      ),
      hint(
        'h_salon',
        not(flag('h104_itiraz')),
        'Savcının cevabı içinde taşıyan, tanığı bir kanaate yönlendiren sorusuna itiraz edebilirdin (CMK 201).',
        'USUL_BILGISI',
      ),
      hint(
        'h_bildir',
        all(any(has('ded_mektup'), has('ded_canli'), has('ded_gomlek')), not(flag('bildirdi'))),
        'Başka bir kişinin fail olabileceğine dair bulgularını savcılığa yazılı olarak bildirmedin (CMK 158, 160). Aramayı ve soruşturmayı ancak savcı yaptırabilir.',
        'USUL_BILGISI',
      ),
      hint(
        'h_yuzles',
        flag('tarik_yuzlesme'),
        'Baş tanığın iş yerine gidip onu suçladın: avukat kovalamaz, bildirir. Yüzleşme şüpheliyi uyardı.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_etik',
        any(
          flag('suleyman_kocluk'),
          flag('cansu_vaat'),
          flag('ikrar_onerisi'),
          flag('leyla_not'),
          flag('teklif_kabul'),
        ),
        'Etik çizgiyi aştın: tanığa nasıl konuşacağını söylemek, tanığa menfaat vaat etmek, müvekkile gerçeğe aykırı ikrar önermek ya da meslek sırrına dokunmak (Av.K. 34, 36; TCK 272, 277).',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
