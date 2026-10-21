import { all, any, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların" — neyi, nerede, hangi dayanakla.

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence(
        'h_not',
        'ev_not',
        'Ece’nin odasında, monitörün kenarındaki sarı notu bulmadın: “4471 — SGK.” Kodun aldatılarak okunduğunun en erken kanıtıydı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_simyok',
        'clue_simyok',
        'Şarjdaki eski telefonda 4 Kasım 10.13 tarihli “SIM yok” ekran görüntüsü vardı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_ekran',
        'clue_sgk_mesaj',
        'Ece her şeyin ekran görüntüsünü alıyordu. Başvuru tablosunu bulup ona ekran görüntülerini sorsaydın, Kaan’ın “SGK kodu” mesajı ve numarası eline geçerdi.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_dokum',
        'ev_sim_dokum',
        'Ece’nin kendi operatöründen alabileceği işlem dökümü (KVKK md. 11), hattın 10.12’de başka bir bayide vekille değiştirildiğini gösterirdi.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_log',
        'ev_banka_log',
        'Bankadan cihaz ve oturum kaydını istemedin (CMK 177). İşlemlerin bir Samsung’dan yapıldığını gösteren tek belgeydi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_hts',
        'ev_hts',
        'Sanığın hattı için iletişimin tespitini istemedin (CMK 135/6). Kopya SIM’in takıldığı cihazın IMEI’si oradaydı.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_bayi',
        'ev_bayi_belge',
        'SIM değişikliğinde kullanılan belgeleri istemedin: sahte vekâletname ve Ece’nin fotoğrafından basılmış fotokopi.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_kaan',
        'ded_kaan',
        'İşverenin numarası ile sahte satıcının numarası aynıydı. Bu ikisini tahtada birleştirmek, ilanın bir tuzak olduğunu gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_dongu',
        'ded_dongu',
        'Avansı gönderen IBAN kaporadan 15.000 TL geri almıştı; “kira bedeli” iddiasını çürütecek döngüydü.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_imei',
        'ev_imei_rapor',
        'Somut dayanaklı bir suç duyurusuyla IMEI sorgusu isteyebilirdin (CMK 158, 135/6). Rapor gerçek faile götürürdü.',
        'USUL_BILGISI',
      ),
      missedEvidence(
        'h_kartvizit',
        'ded_necdet',
        'İMEİ raporundaki şirket hattı, OM İş Merkezi müdürünün sana verdiği kartvizitteki numaraydı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_sozlesme',
        'ev_sozlesme',
        'İlandaki adresteki iş merkezine gidip yönetimden Nova’nın sözleşmesini istemedin. Kiracı olarak gösterilen kişinin adı oradaydı; işletme müdürü bir kartvizit de bırakırdı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_iphone',
        'clue_iphone_imei',
        'Ece’nin telefonunun kutusu Sevim Hanım’da duruyordu; altındaki etikette telefonun kendi kimlik numarası yazar. Kayıtlardaki cihazla karşılaştırmanın tek yolu buydu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_ded_imei',
        'ded_imei',
        'Kutudaki numarayı iletişim tespitindeki cihaz numarasıyla tahtada birleştirseydin, banka SMS’lerinin Ece’nin telefonuna gitmediğini gösterebilirdin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_noter',
        'ev_noter_yok',
        'Bayi işlem dosyasındaki vekâletnamenin karekodunu “Doğrula” aletiyle sorgulamadın. Belgenin hiç düzenlenmediği ortaya çıkardı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_otopark',
        'ded_otopark',
        'Kuryenin tarif ettiği teslim yerini otoparkta bulup onun anlatımıyla tahtada birleştirmedin; paranın nereye gittiği bir park yerinin tabelasında yazıyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_arda_kimlik',
        'ded_arda_kimlik',
        'Vekâletnamedeki vekilin adı, sanal ofis sözleşmesindeki kiracının adıyla aynıydı. İki belgeyi tahtada yan yana koymak, bir kimliğin iki sahte belgede kullanıldığını gösterirdi.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_inkar',
        flag('ece_inkar'),
        'Müvekkile inkâr tavsiye etmek meslek kurallarına aykırıdır (Av.K. 34) ve banka kaydı karşısında savunmayı çökertir. Doğru yol, aldatmayı belgeleriyle anlatmaktı.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_burak',
        flag('suc_burak'),
        'Burak hakkındaki suç duyurusu somut delile dayanmıyordu ve 4 Kasım sabahı dükkânında olduğu belgeliydi; iftira riski (TCK 267).',
        'USUL_BILGISI',
      ),
      hint(
        'h_illegal',
        any(flag('illegal_alindi'), flag('illegal_used')),
        'Operatör sistemine yetkisiz girişle alınan kayıt suçtur (TCK 243, 136) ve delil olamaz (CMK 206/2-a, 217/2). Aynı bilgi mahkeme yazısıyla yasal yoldan gelebilirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_arda',
        all(not(flag('arda_avukat')), flag('arda_ifade')),
        'Çıkarı müvekkilinle çatışabilecek bir kişiden yazılı beyan alındı; onu kendi avukatına yönlendirip mahkemede dinletmek gerekirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_nurettin',
        any(flag('nurettin_soz'), flag('nurettin_baski')),
        'Avukatı olmayan katılana söz vermek ya da şikâyetten vazgeçirmeye çalışmak meslek kurallarına aykırıdır; nitelikli dolandırıcılık şikâyete bağlı da değildir.',
        'USUL_BILGISI',
      ),
      hint(
        'h_tehdit',
        all(visitedAny(), not(flag('tehdit_bildirildi')), not(flag('arama_bildirildi'))),
        'Müvekkile ve sana yönelik tehditler belgelenip savcılığa bildirilmeliydi (TCK 106; CMK 158).',
        'USUL_BILGISI',
      ),
      hint(
        'h_kanaat',
        not(any(flag('obj_g4'), flag('obj_g5'))),
        'Gökhan Ateş görmediği görüntü ve kendi çıkarımı hakkında konuştu; kanaate itiraz edilebilirdi.',
        'USUL_BILGISI',
      ),
      hint(
        'h_kopya',
        all(has('clue_parlama'), not(has('ded_kopya'))),
        'Fotokopideki parlama ve kırık oje, Ece’nin masasındaki lambayla birleşince fotokopinin Nova’ya gönderilen fotoğraftan basıldığını gösterirdi.',
        'DELIL_ANALIZI',
      ),
    ],
  },
};

function visitedAny() {
  return any({ visited: 'INV1_AKSAM2' }, flag('suc_duyurusu'));
}
