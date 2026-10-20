import { back, option, raise } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B } from './dsl.js';
import { INV } from './shared.js';

// 58-investigation-terminal: Kent Ulaşım terminali, kayıp eşya bürosu ve hareket memurluğu. Kadroda olmayan memurlar
// isimsiz seslerdir (narrator + name).

export const invTerminal: CasePart = {
  nodes: [
    {
      id: 'INV_TERMINAL',
      type: 'CHOICE',
      ...INV,
      title: 'Kent Ulaşım terminali',
      background: 'depo',
      prompt: {
        speaker: 'narrator',
        text: 'Kayıp eşya bürosunun tezgâhı. Arkada hareket memurluğunun camı. Ne soracaksın?',
      },
      lines: B(`
# depo | 09.05 — KENT ULAŞIM TERMİNALİ, KAYIP EŞYA BÜROSU
Terminalin en arka köşesinde, tuvaletlerle kantin arasında küçük bir oda. Kapısında el yazısıyla: “KAYIP EŞYA — 09.00–17.00 (CMT 09.00–13.00)”.
İçeride metal raflar. Şemsiyeler. Yüzlerce şemsiye. Bir çocuk bisikleti, bir koli anahtar, tek eşi kalmış eldivenler, bir gelinlik kutusu.
> Bir şehrin unuttukları burada bekliyor. Kimse almaya gelmiyor. Gelenler de çoğu zaman aradığını bulamıyor.
@BÜRO MEMURU: Buyurun abla. Kayıp mı, buluntu mu?
P: Ne kayıp ne buluntu. Bir dava. Avukatım.
@BÜRO MEMURU: Eyvah. Avukat gelince ya bir şey kaybolmuştur ya biri.
`),
      choices: [
        option('TR_SAAT', '“Cumartesi sabahı kaçta açılıyorsunuz?”', {
          next: '$stay',
          effects: [raise('fact_buro_dokuz')],
          score: { ARASTIRMA: 20 },
          responses: B(`
@BÜRO MEMURU: Dokuzda. Cumartesi de dokuzda, öğlene kadar. Kapıda yazıyor ama kimse okumaz.
@BÜRO MEMURU: Cuma akşamı bulan cumartesi dokuzda gelir, öyle bir alışkanlık var. Polise götüren de olur, buraya getiren de. İkisi de olur.
> Dokuz. “Yarın 9 — karakol.” Arda o saati bir yerden duymuştu. Ya da öyle bir saat, bir öğretmen adayına doğru gelmişti.
`),
        }),
        option('TR_DEFTER', '“7 Mart’ta Hat 38’den bir cüzdan teslim edildi mi?”', {
          next: '$stay',
          effects: [raise('fact_buro_defter')],
          responses: B(`
Memur kalın, mavi kapaklı bir defteri açtı, parmağını satırlarda gezdirdi.
@BÜRO MEMURU: 7 Mart… Bir şemsiye, bir kartlı cüzdan değil, bir okul çantası. Hat 38’den yok. Ama o sabah polis gelmişti, teknik odaya.
@BÜRO MEMURU: Polisler gelince ortalık karışır. Bizim defter o gün yarım kaldı zaten.
`),
        }),
        option('TR_KLASOR', 'Hareket memurluğuna: “Polis kayıt isteyince ne oluyor?”', {
          next: '$stay',
          discovers: 'clue_olay_klasoru',
          score: { ARASTIRMA: 40 },
          responses: B(`
Hareket memurluğunun camı açıldı. Kulaklıklı, kırk yaşlarında bir adam başını uzattı.
@HAREKET MEMURU: Kayıt mı? Teknik odası halleder. Polis isteyince o seferin bir saatini, dört kamerayı birden “olay klasörü”ne alırlar. İki yıl durur.
@HAREKET MEMURU: CD’ye ne isterlerse onu basarlar. Polis “şu dakika” der, o dakika basılır. Klasör yerinde kalır. Mahkeme yazı yazsın, gönderirler.
> Olay klasörü. Bir saat, dört kamera, iki yıl. Ve bir CD’ye basılmış iki buçuk dakika.
`),
        }),
        option('TR_RECEP', '“Şoför Recep Ateş’i tanıyor musunuz?”', {
          next: '$stay',
          effects: [raise('fact_recep_tutanak')],
          score: { SORGULAMA: 20 },
          responses: B(`
@HAREKET MEMURU: Recep abi? Tanımayan yok. İyi adamdır. Yorgundur. Geçen yıl iki tutanak yedi; unutulan çanta, geç teslim falan.
@HAREKET MEMURU: Üçüncüsü olursa… Neyse. Ben bir şey demedim abla. Siz de duymadınız.
> Duydum. Bir adamın neden yalan söyleyebileceğini öğrenmek, yalan söylediğini öğrenmek değildir. Ama bir başlangıçtır.
`),
        }),
        option('TR_ISIM', '“O sabah polise CD’yi kim hazırladı? Adını verir misiniz?”', {
          next: '$stay',
          effects: [raise('fact_volkan_adi')],
          responses: B(`
@HAREKET MEMURU: Volkan. Teknikte. Gece vardiyası. Formda adı yazar zaten, imzalar o.
@HAREKET MEMURU: Ama Volkan’ı sıkıştırmayın abla. Gece yarısı polis gelir, “şunu bas” der, basar. Çocuk teknik adam, hukukçu değil.
`),
        }),
        back('TR_BITIR', 'Teşekkür edip çık'),
      ],
    },
  ],
};
