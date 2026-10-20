import { all, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_kilit',
        'clue_kilit',
        'Arka odanın fotoğrafında eşiğin dibinde kesik bir asma kilit vardı: kilitli oda, başkasının odasıdır.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_on_oda',
        'clue_on_oda',
        'Ön odanın fotoğrafı Kaan’ın orada yaşadığını gösteriyordu: kitap, gözlük, öğrenci kartı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_kroki',
        'clue_kroki',
        'Tutanak Kaan’ı ön odada buluyor, kroki o odaya “misafir odası” diyordu: tutanak ile krokiyi karşılaştırabilirdin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kapsam',
        'clue_kapsam',
        'Arama kararı yalnızca şüphelinin kullanımındaki oda ve ortak alanları kapsıyordu (CMK 119/2-b).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_oda',
        'ded_oda',
        'Ön oda ile krokiyi tahtada birleştirip polise “varsaydım” dedirtebilirdin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kapsam_ded',
        'ded_kapsam',
        'Kesik kilit ile kararın kapsamı birlikte, kapsam dışı aramayı gösterirdi (Anayasa 38/6, CMK 206/2-a, 217/2).',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_seker',
        'ded_sekerlik',
        'Şekerlikteki paketler arka odanın stoğundandı ve şekerlik arka oda kapısının dibindeydi: savcının “ortak alan” tezi buradan düşerdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kask',
        'clue_tolga_kask',
        'Muhbirin ifadesinde kapıyı açanın elinde kask vardı; Kaan’ın ehliyeti bile yok.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_kira',
        'clue_kira_defteri',
        'Ev sahibi Nesrin Uysal’ın kira defteri arka odanın kiracısını tarihiyle kaydetmişti.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_alibi',
        'ded_alibi',
        'Kafenin Z raporu Kaan’ı satış saatinde kasa başında gösteriyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_tolga',
        'ded_tolga_baris',
        'Kurye durağında Tolga’nın Barış’ı sorduğu öğrenilebilirdi: muhbir satıcıyı tanıyordu.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_kurye',
        'ev_kurye',
        'Kurye şirketinin kayıtlarını delil dilekçesiyle (CMK 177) ya da duruşmada (CMK 206/1) isteyebilirdin.',
        'USUL_BILGISI',
      ),
      hint(
        'h_riza',
        not(flag('kaan_riza')),
        'Kaan’ın kullanıcı olduğunu mahkemede kendisinin söylemesi, odanın onun olmadığını anlatmayı kolaylaştırırdı; ama bunun için rızası gerekiyordu.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_telkin',
        flag('nesrin_telkin'),
        'Nesrin Hanım’a cevabı sen verdin (“gördünüz, değil mi?”); savcı bunu kürsüde sordu. Tanığa açık uçlu sor.',
        'SORGULAMA',
      ),
      hint(
        'h_inkar',
        flag('kaan_inkar'),
        'Kaan’a rızası olmadan kullanımını sordun; inkâr etti ve saç analizi karşısında güvenilirliği sarsıldı.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_canta',
        flag('canta_deniz'),
        'Bodrumdaki çantayı kendin aldın: delil zinciri koptu. Doğrusu savcılığa bildirip el konulmasını sağlamaktı (CMK 123, 127).',
        'USUL_BILGISI',
      ),
      hint(
        'h_suc',
        not(flag('suc_duyurusu')),
        'Barış Demirel hakkında kimlik bilgisiyle suç duyurusu (CMK 158) onun yakalanmasının yolunu açardı.',
        'USUL_BILGISI',
      ),
      hint(
        'h_tel',
        all(flag('suc_duyurusu'), not(flag('tehdit_bildirildi'))),
        'Gece gelen telefonu savcılığa bildirseydin, kayıt Barış’ın yerini gösterebilirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_izesles',
        all(flag('tolga_kirildi'), not(has('ev_iz_eslesme'))),
        'Muhbir çözüldü; ama terazideki izi Barış’la eşleştiren rapor olmadan “işlenmediği sabit” denemezdi.',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
