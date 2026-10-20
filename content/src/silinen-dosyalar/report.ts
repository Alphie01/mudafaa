import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporunda "kaçırdıkların".

export const report: CasePart = {
  report: {
    hints: [
      hint(
        'h_hash',
        not(has('clue_hash')),
        'DataKale raporundaki iki özet değeri karşılaştırmadın; biri “…71c2”, biri “…08be” ile bitiyordu. İmajın bütünlüğü (CMK 134) buna dayanıyordu.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_kurtarma',
        not(has('clue_kurtarma')),
        'Raporun Ek-3’ünü okumadın: imajdan önce iki gün boyunca diske kurtarma yazılımı yazılmıştı. Delilin elde etme zinciri oradan kırılıyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_devir',
        'ev_devir',
        'Selim’in evindeki devir-teslim tutanağını almadın; yönetici şifrelerinin genel müdüre zarfla teslim edildiğini gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_eposta',
        'ev_eposta',
        'Gül’ün çekmecesindeki e-posta çıktısını bulmadın; 21.30 girişinin izinli olduğunun kanıtıydı (TCK 243/1 rıza).',
        'ARASTIRMA',
      ),
      hint(
        'h_cihaz',
        all(any(has('ev_tam_log'), has('ev_sema')), not(has('clue_cihaz_adi')), not(has('clue_sema_cihaz'))),
        'Ham kayıttaki cihaz adını incelemedin: 21.30 SELIM-PC, 02.14 ise NOS-GM-LT. Silme başka bir cihazdandı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_turnike',
        'ev_turnike',
        'Kart geçiş kayıtlarını istemedin; silme gecesi sunucu odasına kimin girdiğini ve NOS-GM-LT’nin kimin zimmetinde olduğunu gösteriyordu.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_operator',
        'ev_operator',
        'Silme oturumunun geldiği GSM hattını operatörden istemedin; hat genel müdüre tahsisliydi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_zeyil',
        'ev_zeyil',
        'Sigorta poliçesini istemedin; limit olaydan önce on katına çıkarılmış ve çalışan sabotajı teminatı eklenmişti (saik).',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_bilirkisi',
        not(flag('bilirkisi_atandi')),
        'İlk celsede mahkemeden bağımsız bilirkişi atanmasını ve orijinal disklerin muhafazasını isteyebilirdin (CMK 63, 134).',
        'USUL_BILGISI',
      ),
      hint(
        'h_bildir',
        all(flag('fact_gm'), not(flag('bildirdi'))),
        'Silmenin başka birinden çıktığını gösteren delilleri savcılığa yazılı olarak bildirmedin (CMK 158, 160). Faili kovalamak ya da beklemek değil, bildirmek doğru yoldur.',
        'USUL_BILGISI',
      ),
      hint(
        'h_etik',
        any(flag('yasar_kocluk'), flag('nalan_belge'), flag('tarik_yuzles'), flag('selim_giris'), flag('tarik_ziyaret')),
        'Etik çizgiyi zorladın: tanığa söz ezberletmek, çalışana belge çaldırmak, faille yüzleşmek ya da müvekkile izinsiz giriş yaptırmak (Av.K. 34; TCK 243, 272, 277; CMK 158).',
        'SAVUNMA_STRATEJISI',
      ),
    ],
  },
};
