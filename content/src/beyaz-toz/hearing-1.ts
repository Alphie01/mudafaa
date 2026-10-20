import {
  all,
  any,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  has,
  hl,
  ifThen,
  inc,
  mark,
  meet,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  score,
  statement,
  story,
  choiceNode,
  met,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { HEAR1, card, court1, me, n, s, th } from './shared.js';

// 60-hearing-1: birinci celse. Açılış, iddianame, Kaan'ın savunması ve müdafiin soruları, savcının polise sorusu
// (itiraz), Kom. Yrd. Tuncay Sezer'in çapraz sorgusu, CMK 206/1 talepleri ve ara karar (tutukluluk incelemesi).

export const wrongEvidence = [dec('cred'), dec('pers'), inc('wrong')];

export const hearing1: CasePart = {
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_iddianame', 'IDDIANAME', 'H1_01'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'H1_02'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_03'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_05'],
      ]),
    ],
  },
  nodes: [
    story('H1_00K', {
      ...HEAR1,
      title: 'Adliye nezarethanesi',
      background: 'adliye',
      lines: [
        {
          lines: [
            card('26 OCAK · PAZARTESİ 09.10 — ADLİYE NEZARETHANESİ', 'adliye'),
            n(
              'Adliyenin bodrumunda, duruşma salonlarının altında, demir kapılı küçük odalar. Burada saat yukarıdakinden yavaş işler; havalandırma da öyle.',
            ),
            n(
              'Kaan bir bankta oturuyordu. Defne’nin getirdiği ceketi giymişti. Kolları bileklerinde bitiyordu; bunu fark etmiş, kollarını çekiştirip duruyordu.',
            ),
            s(
              'kaan',
              'Ceket kısa. Ablam liseden kalma ölçümü almış. O zamandan beri boyum uzamamış ama kollarım uzamış galiba. Neyse.',
            ),
            me('Ceket iyi. Önemli olan içindeki.'),
            s('kaan', 'İçindeki de kısa geliyor bugün.', 'uzgun'),
            n('Jandarma kapıda saatine baktı. Beş dakika. Avukat görüşü, bodrumda bile kısadır.'),
            th(
              'Beş dakikada bir insana ne söylenir? Doğru olan bir şey. Kısa olan bir şey. Ve onun yerine karar vermeyen bir şey.',
            ),
          ],
        },
      ],
      choices: [
        option('K_A', 'Bugün sadece doğruyu söyle. Korkarsan bana bak.', {
          effects: [inc('trust', 4)],
          responses: [
            {
              lines: [
                s(
                  'kaan',
                  'Doğruyu. Tamam. Size bakarım. Siz de bana bakın ama; salonda kimse bana bakmıyor gibi geliyor.',
                ),
                th('Bakacağım. Bir avukatın en ucuz ve en pahalı yardımı budur.'),
              ],
            },
          ],
          next: 'H1_00',
        }),
        option('K_B', 'Polis kürsüde olacak. Sen sakin kal; konuşmayı bana bırak.', {
          responses: [
            {
              lines: [
                s('kaan', 'Sakin kalırım. Sakin kalmakta iyiyim. Sadece içim sakin değil.'),
                th(
                  'Konuşmayı bana bırakmasını istedim. Ama kendi savunmasını kendisi yapacak. Bunu ona hatırlatmadım.',
                ),
              ],
            },
          ],
          next: 'H1_00',
        }),
        option('K_C', 'Mahkemede kullandığını söylemek istiyorsan, ilk sen söyle. Kimse senden önce söylemesin.', {
          visibleWhen: flag('kaan_riza'),
          effects: [inc('trust', 6)],
          responses: [
            {
              lines: [
                s('kaan', 'İlk ben. Tamam. Savcı söylemeden. Polis söylemeden. Ben.'),
                n(
                  'Kaan avucunu açtı. Avucunda tükenmez kalemle yazılmış iki kelime vardı: “Satmadım.” Gece yazmış; mürekkep terden dağılmıştı.',
                ),
                th('Bir avuç içi, bir savunma metni. Bazen en iyi dilekçe bir müvekkilin elindedir.'),
              ],
            },
          ],
          next: 'H1_00',
        }),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Birinci celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [raise('in_court'), meet('baskan'), meet('uye'), meet('savci'), meet('mubasir'), meet('tuncay')],
      lines: [
        {
          lines: [
            card('26 OCAK · PAZARTESİ 09.40 — BURSA 5. AĞIR CEZA MAHKEMESİ', 'durusma_salonu'),
            n(
              'Salonun kaloriferi ya hiç yanmıyor ya da yanıp unutulmuş gibiydi. Pencerelerin buğusunda birinin parmakla çizdiği bir kalp, yarısı silinmiş.',
            ),
            s('mubasir', 'Kaan Yıldız! Kaan Yıldız! Sanık, müdafii, tanıklar salona!'),
            n(
              'Kaan iki jandarmanın arasında girdi. Defne’nin getirdiği ceketin kolları bileklerinde bitiyordu. Gözleri dinleyici sıralarını taradı, ablasını buldu, kaçırdı.',
            ),
            n(
              'Arka sırada Defne, dizinde bir eczane poşeti, yanında boş bir sandalye. Annesi için ayırdığı ve kimseyi oturtmadığı.',
            ),
            s(
              'baskan',
              'Sanığın kimliği tespit edildi. Sanık tutuklu, bağsız olarak duruşmada. Müdafii Av. Deniz Arslan hazır. Tanık Kom. Yrd. Tuncay Sezer hazır, salon dışına alındı.',
            ),
            s('baskan', 'Muhbir tanık Tolga Kaplan tebligata rağmen gelmedi. Zorla getirilmesi için yazı yazılacak.'),
            th('Tolga gelmedi. Bugün kürsüde yalnızca polis olacak. Belki de iyi; bir seferde bir hayalet yeter.'),
            n(
              'Savcı Serap Akın dosyasını açmadı bile. Kırk altı yaşında, kısa saçlı, gözlüklerini saçına kaldırmış bir kadın. Önündeki kalemi masanın kenarına paralel dizmişti.',
            ),
            n(
              'Üye hâkim Merve Tan genç ve sessizdi; dosyanın fotokopisini kendi kalemiyle işaretlemiş, kenarlara küçük soru işaretleri koymuştu. Biri kroki sayfasındaydı.',
            ),
            th('Bir soru işareti. Krokinin kenarında. Belki de bu salonda yalnız değilim.'),
          ],
        },
      ],
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'İddianame',
      courtStage: 'IDDIANAME',
      lines: [
        {
          lines: [
            s(
              'savci',
              'Sayın Başkan, iddianamemiz okunmuş kabul edilsin. Özetle: 11 Kasım’da sanığın kiracısı olduğu dairede yapılan aramada, arka odada 46 paket, mutfakta 2 paket kokain, hassas terazi ve kilitli poşetler ele geçirilmiştir.',
            ),
            s(
              'savci',
              'Muhbir tanığın beyanı, sanığın telefonundaki yazışmalar ve paketleme biçimi, maddenin kullanım değil ticaret amacıyla bulundurulduğunu gösterir. Sanığın TCK 188/3 ve 188/4-a uyarınca cezalandırılmasını talep ediyoruz.',
            ),
            n(
              'Serap Akın konuşurken dosyasına bakmıyordu. Ezbere biliyordu. Kısa cümleler, keskin virgüller; kimseyi yormayan, kimseyi bağışlamayan bir ses.',
            ),
            th(
              'Savcının hikâyesi tek bir varsayıma dayanıyor: ev onun, oda onun, toz onun. Varsayımı devir; hikâye kendi ağırlığıyla çöker.',
            ),
          ],
        },
      ],
      choices: [cont('H101_DEVAM', 'Sanığın savunmasına geç', 'H1_02')],
    }),
    court1.stage('H1_02', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'kaan',
      witnessLabel: 'SANIK · KAAN YILDIZ',
      lines: [
        {
          when: flag('kaan_riza'),
          lines: [
            s(
              'baskan',
              'Sanık, size yüklenen suç anlatıldı. Susma hakkınız var; söyledikleriniz aleyhinize de kullanılabilir. Savunmanızı yapın.',
            ),
            s(
              'kaan',
              'Sayın Başkan. Arka oda benim değildi. Ev arkadaşım Barış’ındı. Kilidi o taktı, anahtarı ondaydı. Ben o odaya hiç girmedim.',
            ),
            s('kaan', 'Bir şey daha söyleyeceğim. Kendim söylemek istiyorum.', 'uzgun'),
            n('Salon sustu. Defne’nin elindeki poşet hışırdadı.'),
            s(
              'kaan',
              'Ben kullanıcıydım. Kokain. Babam öldükten sonra. Ekimde acile düştüm, sonra AMATEM’e başladım. Satmadım. Hiç kimseye. Bir gram bile.',
            ),
            th('Söyledi. Kendi sesiyle, kendi kararıyla. Savcı bir an kalemini bıraktı.'),
            s(
              'kaan',
              'Bunu söylemek için buraya gelmem gerekti, Sayın Başkan. Annem bugün burada. Ne duyacaksa benden duysun. Yalan söyleyerek çıkmak istemiyorum. Kullandım. Satmadım.',
            ),
            n(
              'Defne’nin yanındaki boş sandalye boş kalmadı. Kapının yanında, elinde bir ıslak şemsiyeyle, beyaz saçlı bir kadın durmuştu. Kimse onu fark etmedi; Kaan dışında.',
            ),
          ],
        },
        {
          lines: [
            s(
              'baskan',
              'Sanık, size yüklenen suç anlatıldı. Susma hakkınız var; söyledikleriniz aleyhinize de kullanılabilir. Savunmanızı yapın.',
            ),
            s(
              'kaan',
              'Sayın Başkan. Arka oda benim değildi. Ev arkadaşım Barış’ındı. Kilidi o taktı, anahtarı ondaydı. Ben o odaya hiç girmedim.',
            ),
            s(
              'kaan',
              'Paketler benim değil. Terazi benim değil. Ben… ben öğrenciyim. Kafede çalışıyorum. Neyse. Bu kadar.',
              'uzgun',
            ),
            th('“Neyse.” Mahkeme salonunda bile. Kaan’ın anlatmadığı bir şey var ve herkes bunu hissediyor.'),
          ],
        },
      ],
      choices: [cont('H102_DEVAM', 'Sanığa soru sor', 'H1_02Q')],
    }),
    choiceNode('H1_02Q', {
      ...court1.base,
      title: 'Müdafiin soruları',
      background: 'durusma_salonu',
      prompt: s('baskan', 'Müdafi, sanığa sorularınız?'),
      choices: [
        option('Q_ODA', 'Baskın sabahı hangi odada uyuyordun?', {
          score: { SORGULAMA: 40 },
          good: 'Bilgi veren, açık uçlu soru: sanığın kendi yaşam alanını kendi sözleriyle anlatması (CMK 201/1).',
          responses: [
            {
              lines: [
                s(
                  'kaan',
                  'Ön odada. Balkonlu oda. Her gece orada uyurum. Kitaplarım, gitarım, gözlüğüm orada. Polis de beni orada buldu.',
                ),
                s('uye', 'Arka odaya neden girmediniz hiç?'),
                s(
                  'kaan',
                  'Arka odaya da hiç girmedim. Bir kere kapı aralıktı, baktım. O kadar. Bir mont, bir yatak, bir dolap.',
                ),
                s('kaan', 'Kilitliydi, Sayın Hâkim. Ve… başkasının odasıydı. Başkasının odasına girilmez.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_KILIT', 'Arka odanın kapısında kilit var mıydı? Anahtarı kimdeydi?', {
          visibleWhen: any(flag('fact_arka'), has('clue_kilit')),
          score: { SORGULAMA: 40 },
          good: 'Kilitli odanın zilyetliği: anahtarı taşıyan, odanın hâkimiyetine sahip olandır. Soru, savunmanın eksenini sanığın ağzından kurdu.',
          responses: [
            {
              when: flag('fact_kilit_k'),
              lines: [
                s(
                  'kaan',
                  'Asma kilit vardı. Pirinç, büyük bir kilit. Barış taktı, eylülde. Anahtarı boynunda bir ipte taşırdı; duşa bile onunla girerdi.',
                ),
                s('kaan', 'Benim anahtarlığım emanette. Üç anahtar var: kapı, bina, posta kutusu. Dördüncüsü yok.'),
                th('Savcı emanet tutanağını çıkarıp baktı. Sonra not aldığı şeyin üstünü çizdi.'),
              ],
            },
            {
              lines: [
                s('kaan', 'Asma kilit vardı. Barış taktı, eylülde. Anahtarı boynunda bir ipte taşırdı.'),
                s('kaan', 'Benim anahtarlığım emanette. Üç anahtar var: kapı, bina, posta kutusu. Dördüncüsü yok.'),
                th('Savcı bir şey not aldı. Emanet tutanağını çıkarıp baktı. Sonra not aldığı şeyin üstünü çizdi.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_KULLANIM', 'Uyuşturucu kullandın mı?', {
          effects: [
            ifThen(
              flag('kaan_riza'),
              [score('SORGULAMA', 60), raise('kaan_durust'), inc('pers')],
              [dec('trust', 15), dec('cred'), raise('kaan_inkar'), score('SORGULAMA', -60)],
            ),
          ],
          responses: [
            {
              when: flag('kaan_riza'),
              lines: [
                s(
                  'kaan',
                  'Kullandım. Eylülde son kez. Kimden aldığımı da söyleyeceğim: Barış’tan. İki kez. Kapının önüne bırakırdı.',
                ),
                s(
                  'kaan',
                  'Ekimden beri tedavideyim. Otuz ekimde testim temizdi. Cezaevinde de temizim. Yüz on beş gün.',
                ),
                s('uye', 'Arka odadaki maddeyi biliyor muydunuz?'),
                s('kaan', 'Bilmiyordum. Sormadım. Sormamak da bir suçsa… o suçu işledim.', 'uzgun'),
                th(
                  'Kaan kendi utancını bir delile çevirdi. Kullanıcı olduğunu söyleyerek satıcı olmadığını anlattı. Bunu ona ben söyletmedim.',
                ),
              ],
            },
            {
              lines: [
                n('Kaan bana baktı. Gözlerinde bir soru vardı: “Bunu burada mı soruyorsun?”', { fx: 'shake' }),
                s('kaan', 'Hayır. Hiç… hiç kullanmadım.', 'saskin'),
                s(
                  'savci',
                  'Sayın Başkan, dosyada sanığın saç analizi var. Son üç ayda kokain kullanımıyla uyumlu. Kayda geçsin.',
                ),
                th(
                  'Rızasını almadan sırrının kapısını çaldım. Kaan kapıyı kapattı ve yalan söyledi. Ve o yalan şimdi tutanakta.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_TEDAVI', 'Tedaviye ne zaman, nasıl başladın?', {
          visibleWhen: flag('kaan_riza'),
          score: { SORGULAMA: 40 },
          good: 'Kullanım ile ticaret ayrımında sanığın kendi tedavi süreci, açık uçlu bir soruyla mahkemeye taşındı.',
          responses: [
            {
              lines: [
                s(
                  'kaan',
                  'Ekimin üçünde acile kaldırıldım. Ablam götürdü. Bir hafta sonra AMATEM’e kendim gittim. Kimse zorlamadı.',
                ),
                s(
                  'kaan',
                  'Her perşembe randevum vardı. Otuz ekimde test verdim, temizdi. On üç kasımda da randevum vardı; ben o gün cezaevindeydim.',
                ),
                s('uye', 'Tedaviye başvurduğunuzda hakkınızda bir soruşturma var mıydı?'),
                s('kaan', 'Hayır, Sayın Hâkim. Kimse bir şey bilmiyordu. Ablamdan başka.'),
                th(
                  'Merve Tan bir şey yazdı. Bir insan kendi isteğiyle tedaviye gidiyorsa, o kişinin dünyası terazi ve poşetle değil, bir randevu kartıyla ölçülür.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_PAKET', 'Paketler senin mi?', {
          neutral: 'Sanığın zaten verdiği cevabı tekrarlatan soru savunmaya bir şey eklemez.',
          responses: [{ lines: [s('kaan', 'Hayır.'), s('baskan', 'Bunu zaten söyledi, müdafi. Başka?')] }],
          next: '$stay',
        }),
        option('Q_SATICI', 'Barış’ın uyuşturucu sattığını biliyor muydun?', {
          score: { SORGULAMA: -40 },
          effects: [dec('cred')],
          bad: 'Sanığı bir üçüncü kişi hakkında tahmine zorlayan soru: savcının itirazı yerinde; sanığın bilgisi değil kanaati sorulmuş olur. Gerçek faile giden yol delilden geçer, sanığın tahmininden değil.',
          responses: [
            {
              lines: [
                s('savci', 'İtiraz ediyorum, Sayın Başkan. Müdafi sanıktan bir başkası hakkında tahmin istiyor.'),
                s('baskan', 'İtiraz yerinde. Sanık bildiği olayları anlatır. Müdafi, sorunuzu değiştirin.'),
                th('Acele ettim. Barış’ı bu salona Kaan’ın tahminiyle değil, delille getirmem gerekiyordu.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_BITIR', 'Sorularım bu kadar', {
          responses: [{ lines: [s('baskan', 'Tanığı alalım. Kom. Yrd. Tuncay Sezer.')] }],
          next: 'H1_03',
        }),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Savcının sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'tuncay',
      witnessLabel: 'TANIK · KOM. YRD. TUNCAY SEZER',
      lines: [
        {
          lines: [
            s('mubasir', 'Tanık Tuncay Sezer! Tanık Tuncay Sezer!'),
            n('Kırklı yaşlarında, kısa saçlı, ütülü bir gömlek. Kürsüye bir rapor okumaya gelir gibi geldi.'),
            s(
              'baskan',
              'Kimliğiniz tespit edildi. Gerçeği söylemekle yükümlüsünüz; yalan tanıklığın cezası size hatırlatıldı. Yemininizi edin.',
            ),
            n(
              'Tuncay Sezer sağ elini kaldırdı. Avucunun içi nasırlıydı; yıllarca bir telsiz, bir direksiyon, bir kapı kolu tutmuş bir el.',
            ),
            s('tuncay', 'Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.'),
            s(
              'savci',
              'Tanık, aramayı siz yönettiniz. Arka oda sanığın kullanımındaydı, değil mi? Ev onun adına kiralıydı.',
            ),
          ],
        },
      ],
      next: 'H1_04',
      options: [
        option('H103_A', 'İtiraz: soru telkin edici; cevabı tanığa veriyor (CMK 201/1)', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Telkin edici soru yasaktır (CMK 201/1’in ruhu ve başkanın soruyu yöneltme yetkisi, CMK 192): “değil mi?” ile biten soru cevabı tanığa söyler. İtiraz kabul edildi.',
          responses: [
            {
              lines: [
                s('baskan', 'İtiraz yerinde. Sayın Savcı, soruyu açık sorun.'),
                s('savci', 'Peki. Tanık, arka odanın kimin kullanımında olduğunu nasıl tespit ettiniz?'),
                s('tuncay', 'Ev şüphelinin adına kiralıydı. Başka kiracı yoktu. Yani… şüphelinin kullanımındaydı.'),
                th('“Yani.” Bir tespitin değil bir çıkarımın kelimesi.'),
              ],
            },
          ],
        }),
        option('H103_B', 'Sessiz kal', {
          effects: [dec('pers')],
          neutral: 'Telkin edici soru cevaplandı; tanığın ağzına savcının cümlesi girdi.',
          responses: [{ lines: [s('tuncay', 'Evet. Ev onun adınaydı; oda da onun kullanımındaydı.')] }],
        }),
        option('H103_C', 'İtiraz: tanık aramayı yapan kişidir, taraflıdır; beyanı dinlenemez (CMK 217)', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Kolluk görevlisi tanık olarak dinlenebilir; beyanının ağırlığı hükümde takdir edilir (CMK 217). Bu bir itiraz konusu değildir; güvenilirlik çapraz sorguda delille sarsılır.',
          responses: [
            {
              lines: [
                s(
                  'baskan',
                  'Müdafi, kolluk görevlisi tanık olarak dinlenir; beyanını heyet takdir eder. Usule dair bir itirazınız yoksa oturun.',
                ),
                s('tuncay', 'Ev onun adınaydı; oda da onun kullanımındaydı.'),
              ],
            },
          ],
        }),
        option('H103_D', 'Soruyu ben sormak istiyorum, Sayın Başkan', {
          neutral: 'Soru sırası savcıdadır; müdafi kendi sırasında sorar (CMK 201/1). Talep reddedildi, fırsat kaçtı.',
          responses: [
            {
              lines: [
                s('baskan', 'Sıranız gelecek, müdafi. Tanık, cevap verin.'),
                s('tuncay', 'Ev onun adınaydı; oda da onun kullanımındaydı.'),
              ],
            },
          ],
        }),
      ],
    }),
    court1.testimony('H1_04', {
      title: 'Çapraz sorgu · Kom. Yrd. Tuncay Sezer',
      courtStage: 'TANIK_DINLEME',
      witness: 'tuncay',
      witnessLabel: 'TANIK · KOM. YRD. TUNCAY SEZER',
      lines: [
        {
          lines: [
            s(
              'tuncay',
              'Arama, Sulh Ceza Hâkimliğinin kararıyla, usulüne uygun yapıldı. Ben yirmi yıldır bu işi yapıyorum.',
            ),
            s(
              'tuncay',
              'Muhbir beyanı üzerine adres tespit edildi. Sabah yedide ekibimle daireye girdik. Şüpheli ön odada uyuyordu. Arka odada materyal ele geçirildi. Mutfakta da iki paket.',
            ),
            s(
              'tuncay',
              'Ev şüphelinin adına kiralı. Başka kiracı kaydı yok. Tutanağı ben düzenledim, krokiyi ben çizdim. Tanık komşu hazır bulunduruldu.',
            ),
            th(
              'Kısa cümleler, düz bir ses. Bir tutanak okur gibi konuşuyordu. Çünkü bir tutanak okuyordu: kendi kafasındakini.',
            ),
            s('baskan', 'Tanık ifadesini verdi. Müdafi, sorularınız?'),
          ],
        },
      ],
      rulesText: 'İpucu: Önce bastır, sonra doğru delille vur. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_kanaat', 'g_telkin', 'g_duyum'],
      statements: [
        statement('S1', 1, [
          'Arama, ',
          hl('Sulh Ceza Hâkimliğinin kararına uygun', any(flag('press_s1'), has('ded_kapsam'))),
          ' yapıldı.',
        ]),
        statement('S2', 2, [
          'Arka oda ',
          hl('şüphelinin yatak odasıydı', any(flag('press_s2'), has('ded_oda'))),
          '; krokide de öyle gösterdik.',
        ]),
        statement('S3', 3, [
          'Kapılar ',
          hl('olağan şekilde açıldı', any(flag('press_s3'), has('clue_kilit'))),
          '; zor kullanılmadı.',
        ]),
        statement('S4', 4, [
          'Arama başında ',
          hl('komşu tanık hazırdı', any(flag('press_s4'), has('clue_tanik_saat'))),
          '.',
        ]),
        statement('S5', 5, [
          'Şüphelinin odasında ilaç kutuları da vardı. ',
          hl('Profil belli'),
          '; bunlar işin içinde olur.',
        ]),
        statement('S6', 6, [
          'Mutfaktaki şekerlikte de iki paket vardı; ',
          hl('ortak alanda, şüphelinin elinin altında', any(flag('press_s6'), has('ded_sekerlik'))),
          '.',
        ]),
      ],
      rules: [
        presentRule('PS_KIRA', undefined, ['ev_kira', 'ev_sac', 'ev_mesaj'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark(
              'BAD',
              'Savcılığın delilini kendi tanığına “çelişki” diye sundun: kira sözleşmesi, saç analizi ve mesaj dökümü iddianın dayanaklarıdır; tanığın anlatımını çürütmez.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                s('savci', 'Sayın Başkan, müdafi bizim delilimizi bize sunuyor. Teşekkür ederiz.'),
                s('baskan', 'Müdafi, bu belgenin tanığın beyanıyla çelişkisini göremedik. Devam edin.'),
              ],
            },
          ],
        }),
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1')],
          responses: [
            {
              lines: [
                me('Karar evin tamamında arama yapılmasına mı izin veriyordu, tanık?'),
                s('tuncay', 'Karar şüphelinin ikametinde arama yapılmasına izin veriyordu. Ev onun ikametiydi.'),
                th('“Evin tamamı” demedi. “İkametiydi” dedi. Bir kelimeyi değiştirince bir kapıyı da değiştiriyorsun.'),
              ],
            },
          ],
        }),
        presentRule('PS_S1', 'S1', ['ev_karar'], {
          enabledWhen: flag('contra_s3'),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s1'),
            inc('legal_hits'),
            mark(
              'GOOD',
              'Kararın kapsamı “şüphelinin kullanımındaki oda ve ortak alanlar”dı; kilitli üçüncü kişi odası bu kapsamın dışında (CMK 119/2-b). Tanık kapsamı aştığını kabul etti.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              when: flag('fact_talep'),
              lines: [
                me('Kararın kapsam satırını okur musunuz, tanık? Yüksek sesle.'),
                s(
                  'tuncay',
                  '“Şüphelinin kullanımındaki oda ve ortak kullanım alanları ile şüphelinin üzeri.”',
                  'saskin',
                ),
                me(
                  'Talep yazısını siz yazdınız: “şüphelinin bir ev arkadaşıyla kaldığı öğrenilmiştir.” Ev arkadaşı olduğunu bildiğiniz hâlde, kilitli arka oda şüphelinin kullanımındaki oda mıydı?',
                ),
                s(
                  'tuncay',
                  'Ev onun üstüneydi. Oda da onundur… sandık. Kilit açılınca materyal çıktı; biz de…',
                  'uzgun',
                ),
                n('Üye hâkim Merve Tan bir şey yazdı ve altını çizdi. Savcı kalemini masaya bıraktı.'),
                th(
                  '“Sandık.” Bir aramanın bütün hukuku bu kelimeye sığdı. Hâkim sınırı çizmişti; polis sınırı “sandı”.',
                ),
              ],
            },
            {
              lines: [
                me('Kararın kapsam satırını okur musunuz, tanık? Yüksek sesle.'),
                s(
                  'tuncay',
                  '“Şüphelinin kullanımındaki oda ve ortak kullanım alanları ile şüphelinin üzeri.”',
                  'saskin',
                ),
                me(
                  'Kilitli olduğunu kabul ettiğiniz arka oda, şüphelinin kullanımındaki oda mıydı? Talep yazınızda ev arkadaşından söz ettiğiniz hâlde?',
                ),
                s(
                  'tuncay',
                  'Ev onun üstüneydi. Oda da onundur… sandık. Kilit açılınca materyal çıktı; biz de…',
                  'uzgun',
                ),
                n('Üye hâkim Merve Tan bir şey yazdı ve altını çizdi. Savcı kalemini masaya bıraktı.'),
                th('“Sandık.” Bir aramanın bütün hukuku bu kelimeye sığdı.'),
              ],
            },
          ],
        }),
        presentRule('PS_S1_ERKEN', 'S1', ['ev_karar', 'ded_kapsam'], {
          enabledWhen: not(flag('contra_s3')),
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            mark(
              'GOOD',
              'Kapsamı gösterdin; ama tanık arka odanın “şüphelinin kullanımında” olduğunu savunuyor. Önce kapının nasıl açıldığını ortaya koy.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                s(
                  'tuncay',
                  'Karar şüphelinin kullanımındaki odaları kapsıyor, evet. Arka oda da onun kullanımındaydı. Kroki ortada.',
                ),
                th('Kapsamı gösterdim ama kapıyı göstermedim. Önce o kapının nasıl açıldığını söyletmeliyim.'),
              ],
            },
          ],
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s2')],
          responses: [
            {
              lines: [
                me('Şüpheliyi uyurken hangi odada buldunuz, tanık?'),
                s('tuncay', 'Ön odada. Uyuyordu. Ama orası misafir odasıydı; yatağı arka odadaydı.'),
                me('Yatağı arka odada olan biri, neden ön odada uyusun?'),
                s('tuncay', 'Bilmem. İnsanlar her yerde uyur.'),
              ],
            },
          ],
        }),
        presentRule('PS_S2', 'S2', ['ded_oda'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s2'),
            mark(
              'GOOD',
              'Tutanak sanığı ön odada, kendi yatağında buluyor; kroki aynı odaya “misafir odası” diyor. Arka odanın sanığa ait olduğu bir tespit değil, bir varsayım.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'Tutanağınızın ilk satırı: “Şüpheli ön odada yatağında uyurken bulundu.” Krokiniz: ön oda “misafir odası”. Fotoğrafınızda o odada sanığın kitabı, gözlüğü, öğrenci kartı.',
                ),
                me('Hangisi doğru, tanık? Tutanağınız mı, krokiniz mi?'),
                n('Tuncay Sezer tutanağın fotokopisine baktı. Sonra krokiye. Sonra bir süre hiçbir şeye.'),
                s(
                  'tuncay',
                  'Kroki… krokiyi ben sonradan çizdim. Ev onun adınaydı; büyük oda onundur diye düşündüm.',
                  'uzgun',
                ),
                s('uye', 'Yani arka odanın sanığa ait olduğunu tespit etmediniz. Varsaydınız.'),
                s('tuncay', 'Varsaydım, Sayın Hâkim.'),
                th('Bir kelime. Varsaydım. Savcının bütün hikâyesi bu kelimenin üstünde duruyordu.'),
                n(
                  'Kaan sanık sırasında doğruldu. Bir şey söylemek istedi; Defne arkadan, sessizce, başını iki yana salladı. Kaan oturdu.',
                ),
              ],
            },
          ],
        }),
        presentRule('PS_S2_KISMI', 'S2', ['ded_kurye', 'ded_numara', 'ded_baris', 'ded_demirel'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            mark(
              'GOOD',
              'Arka odada başka birinin yaşadığını gösterdin; ama tanığın kendi tutanağıyla çelişkisi, sanığın nerede uyuduğundadır.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                s(
                  'tuncay',
                  'Odada başkasının eşyası olabilir. Mont, ayakkabı… İnsanlar misafir ağırlar. Bu odanın kimin olduğunu değiştirmez.',
                ),
                th(
                  'Başka birinin varlığını gösterdim. Ama tanığı kendi kâğıdıyla yüzleştirmedim. Onun kendi cümlesi daha ağır basar.',
                ),
              ],
            },
          ],
        }),
        pressRule('PR_S3', 'S3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s3')],
          responses: [
            {
              when: flag('fact_anahtarlik'),
              lines: [
                me('“Olağan şekilde” ne demek, tanık? Arka odanın kapısı açık mıydı?'),
                s('tuncay', 'Kapalıydı. Açtık. Olağan şekilde.'),
                me(
                  'Sanığın emanetteki anahtarlığında üç anahtar var: kapı, bina, posta kutusu. Arka odayı hangisiyle açtınız?',
                ),
                s('tuncay', 'O… onu hatırlamıyorum.'),
              ],
            },
            {
              lines: [
                me('“Olağan şekilde” ne demek, tanık? Arka odanın kapısı açık mıydı?'),
                s('tuncay', 'Kapalıydı. Açtık.'),
                me('Nasıl?'),
                s('tuncay', 'Olağan şekilde. Tutanakta yazıyor.'),
              ],
            },
          ],
        }),
        presentRule('PS_S3', 'S3', ['ded_kapsam', 'ded_anahtar'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s3'),
            mark(
              'GOOD',
              'Olay yeri fotoğrafındaki kesik asma kilit, tutanaktaki “olağan şekilde açıldı” beyanını çürüttü. Kilitli oda, kararın kapsamı dışında zorla açıldı.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me('Sayın Başkan, savcılık dosyasındaki fotoğraf albümü, 17 numaralı kare. Arka oda kapısının eşiği.'),
                n('Fotoğraf perdeye yansıdı. Eşiğin dibinde, çelik halkası kesilmiş bir asma kilit.', { fx: 'flash' }),
                me('Bu kilit olağan şekilde mi açıldı, tanık?'),
                s('tuncay', 'Kilit… evet. Bir asma kilit vardı. Keskiyle açtık. Şüpheli anahtarı vermedi.', 'uzgun'),
                me('Vermedi mi, yok muydu?'),
                s('tuncay', '…Üzerinde yoktu. Evde de çıkmadı.'),
                th(
                  'Kilitli bir odanın anahtarı, odanın sahibinde olur. Kaan’da değildi. Bunu polis kendi ağzıyla söyledi.',
                ),
                s('uye', 'Tanık, kilidi keskiyle açtığınızı tutanağa neden yazmadınız?'),
                s('tuncay', 'Önemli görmedim, Sayın Hâkim. Kapı açılmıştı; materyal oradaydı.', 'uzgun'),
                s('uye', 'Bir kapının nasıl açıldığı, ardında ne bulunduğu kadar önemlidir.'),
              ],
            },
          ],
        }),
        pressRule('PR_S4_A', 'S4', {
          visibleWhen: flag('nesrin_saat'),
          score: { SORGULAMA: 50 },
          effects: [
            raise('press_s4'),
            raise('contra_s4'),
            inc('pers'),
            mark(
              'GOOD',
              'Tanık aramanın başında değil, kapı açıldıktan sonra çağrıldı; üstelik tekti. CMK 119/4 uyarınca savcı yokken ihtiyar heyetinden ya da komşulardan iki kişi bulundurulur. Aramanın güvencesi zayıfladı.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'Tanık Nesrin Uysal imzasının yanına saati kendi eliyle yazmış: 07.35. Arama 07.00’de başlamış. Arka oda açıldığında tanık neredeydi?',
                ),
                s('tuncay', 'Tanığı… tanığı biraz sonra çağırdık. Yaşlı bir kadın, giyinmesi lazımdı.'),
                me('Yani arka oda açılırken tanık yoktu. Ve tutanağa “arama başında hazır” yazdınız.'),
                s('tuncay', 'Matbu bir ifade. Her tutanakta öyle yazar.', 'uzgun'),
                me('Tutanakta tek bir tanık imzası var. Savcı yokken iki komşu bulundurulmaz mı?'),
                s('tuncay', 'Sabahın yedisinde bir komşu bulabildik, Sayın Başkan. O da geldi işte.', 'uzgun'),
                th('“Her tutanakta öyle yazar.” Sorun da tam olarak bu.'),
              ],
            },
          ],
        }),
        pressRule('PR_S4_B', 'S4', {
          visibleWhen: not(flag('nesrin_saat')),
          score: { SORGULAMA: 25 },
          effects: [raise('press_s4')],
          responses: [
            {
              lines: [
                me('Tanık hangi anda geldi? Kapı açılmadan önce mi, sonra mı?'),
                s('tuncay', 'Arama başında hazırdı. Tutanakta imzası var.'),
                th('İmza var. Ama imzanın ne zaman atıldığını bilmiyorum. Bunu bilen biri var: imzayı atan.'),
              ],
            },
          ],
        }),
        presentRule('PS_S5', 'S5', ['ev_tedavi', 'ded_kullanici'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('contra_s5'),
            mark(
              'GOOD',
              'Odadaki ilaçlar ve randevu kartı bir tedavi sürecine aittir; kullanıcı profili satıcı profili değildir. Kullanım ile ticaret ayrımı (TCK 188/3–191) tam da burada.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'O ilaç kutuları reçeteli, tanık. AMATEM’in yazdığı ilaçlar. Masadaki randevu kartını da siz fotoğrafladınız.',
                ),
                s('tuncay', 'Ben… kullanıcı olduğu belliydi diyorum. Satıcıların çoğu kullanır.'),
                me('Kullanıcıların çoğu satar mı, tanık?'),
                s('tuncay', 'Hayır. Çoğu satmaz.'),
              ],
            },
          ],
        }),
        objectRule('OB_S5', 'S5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            mark(
              'GOOD',
              'İtiraz yerinde: “profil belli” tanığın gözlemi değil, kişisel kanaati. Tanık gördüğünü anlatır; değerlendirme mahkemenindir (CMK 217).',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me('İtiraz, Sayın Başkan. Tanık gözlemini değil kanaatini aktarıyor.'),
                s(
                  'baskan',
                  'İtiraz yerinde. Tanık, yalnızca gördüklerinizi anlatın. “Profil” değerlendirmesi mahkemenindir.',
                ),
              ],
            },
          ],
        }),
        pressRule('PR_S6', 'S6', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s6')],
          responses: [
            {
              lines: [
                me('Şekerlik mutfakta mıydı, tanık?'),
                s('tuncay', 'Mutfaktaydı. Ya da mutfağa yakın bir yerde. Tutanakta mutfak yazdım.'),
                th('“Ya da.” Bir tutanakta olmaması gereken iki kelime.'),
              ],
            },
          ],
        }),
        presentRule('PS_S6', 'S6', ['ded_sekerlik'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s6'),
            raise('jar_cleared'),
            mark(
              'GOOD',
              'Şekerlik mutfakta değil arka oda kapısının yanındaki raftaydı; içindeki iki paket arka odadaki stokla aynı. “Ortak alan, ortak zilyetlik” tezi düştü.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'Fotoğraf albümü, 23 numaralı kare. Şekerlik mutfakta değil, koridordaki rafta: arka oda kapısına iki adım.',
                ),
                me(
                  'Kriminal rapor: şekerlikteki iki paket, arka odadaki 46 paketle aynı poşet, aynı kesim, aynı gramaj. Aynı stok.',
                ),
                s('tuncay', 'Raf… evet, koridordaydı. Ben mutfak yazdım çünkü şekerlik mutfak eşyasıdır.', 'saskin'),
                s('uye', 'Paketlerin üzerinde sanığın izi var mı, tanık?'),
                s('tuncay', 'Paketlerde elverişli iz yok, Sayın Hâkim. Kavanozun dışında var.'),
                th('Kavanozu açan el ile paketi koyan el aynı el değil. Savcının yedek planı da masada kaldı.'),
              ],
            },
          ],
        }),
        objectRule('OB_S6', 'S6', 'g_kanaat', {
          score: { SORGULAMA: -25 },
          effects: [
            dec('cred'),
            inc('wrong'),
            mark('BAD', 'Şekerliğin yeri bir gözlemdir, kanaat değil. İtiraz değil, delil gerekiyordu.', 'SORGULAMA'),
          ],
          responses: [{ lines: [s('baskan', 'İtiraz reddedildi. Tanık olay yerinde gördüğünü anlatıyor.')] }],
        }),
      ],
      presentMiss: fallback('FB_H104_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Yanlış delil: sunduğun belge bu ifadeyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: [{ lines: [s('baskan', 'Bu delilin tanığın ifadesiyle ilgisini göremedik, müdafi.')] }],
      }),
      objectMiss: fallback('FB_H104_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          inc('wrong'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA'),
        ],
        responses: [{ lines: [s('baskan', 'İtiraz reddedildi.')] }],
      }),
      finish: { id: 'H104_BITIR', next: 'H1_05' },
    }),
    choiceNode('H1_05', {
      ...court1.base,
      title: 'Talepler',
      background: 'durusma_salonu',
      prompt: s('baskan', 'Taraflar, delillere ve tutukluluğa ilişkin talepleriniz?'),
      lines: [
        {
          lines: [
            n(
              'Çapraz sorgu bitmişti. Tuncay Sezer kürsüden inerken tutanağın fotokopisini katladı, cebine koydu, sonra yeniden çıkardı ve masaya bıraktı.',
            ),
            th(
              'Şimdi talepler. Bugün kazanılan her şey kâğıtta kalacak; ikinci celseye ne taşıyacağımı şimdi seçmeliyim.',
            ),
          ],
        },
      ],
      choices: [
        option('TL_KURYE', 'Kurye şirketinden personel ve GPS kayıtlarının istenmesi', {
          visibleWhen: all(
            not(flag('kurye_istendi')),
            any(has('clue_mont'), has('ded_kurye'), has('clue_kira_defteri')),
          ),
          score: { USUL_BILGISI: 40 },
          effects: [raise('kurye_istendi')],
          good: 'Duruşmada delil istemi (CMK 206/1): sanığın ev arkadaşını kurye olarak tanımlayan delillerle somutlaştırıldığı için kabul edildi.',
          responses: [{ lines: [s('baskan', 'Talep kabul edildi. Paketçi’ye yazı yazılsın.')] }],
          next: '$stay',
        }),
        option('TL_NESRIN', 'Ev sahibi Nesrin Uysal’ın tanık olarak dinlenmesi', {
          visibleWhen: all(met('nesrin'), not(flag('nesrin_istendi'))),
          score: { USUL_BILGISI: 30 },
          effects: [raise('nesrin_istendi')],
          good: 'Arama tanığı ve ev sahibi: doğrudan bilgi sahibi tanığın duruşmada dinlenmesi (CMK 206/1, 210).',
          responses: [{ lines: [s('baskan', 'Kabul. Tanık Nesrin Uysal bir sonraki celsede dinlenecek.')] }],
          next: '$stay',
        }),
        option('TL_TAHLIYE', 'Tutukluluğun incelenmesi ve adli kontrolle tahliye', {
          score: { USUL_BILGISI: 30 },
          effects: [raise('tahliye_istendi')],
          good: 'Her celsede tutukluluk incelenir (CMK 108/3); kuvvetli şüphe sarsıldıysa adli kontrol (CMK 109) yeterlidir.',
          responses: [{ lines: [s('baskan', 'Tutukluluk hâli ara kararda değerlendirilecek.')] }],
          next: '$stay',
        }),
        option('TL_BERAAT', 'Delil yetersizliğinden sanığın bu celsede hemen beraatine karar verilmesi', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Deliller toplanmadan ve mütalaa alınmadan esas hakkında hüküm kurulmaz (CMK 216). Talep ciddiyetini zedeledi.',
          responses: [
            { lines: [s('baskan', 'Müdafi, deliller henüz toplanmadı. Bu talep bu aşamada değerlendirilemez.')] },
          ],
          next: '$stay',
        }),
        option('TL_BITIR', 'Taleplerimiz bu kadar', {
          responses: [{ lines: [s('baskan', 'Heyet ara karar için çekiliyor.')] }],
          next: 'H1_06',
        }),
      ],
    }),
    decisionNode('H1_06', [{ to: 'H1_06B' }], {
      ...court1.base,
      title: 'Ara karar',
      onEnter: [
        ifThen(all(flag('tahliye_istendi'), any(flag('contra_s2'), flag('contra_s3')), not(flag('kaan_inkar'))), [
          raise('kaan_tahliye'),
        ]),
      ],
      lines: [
        {
          lines: [
            n('Heyet döndü. Başkan gözlüğünü taktı; kâğıdı iki eliyle tuttu.'),
            s(
              'baskan',
              'Ara karar: Paketçi şirketine ve kolluğa yazılan yazıların cevaplarının beklenmesine; muhbir tanığın zorla getirilmesine; duruşmanın 16 Şubat’a ertelenmesine.',
            ),
            s(
              'baskan',
              'Kolluk tanığının beyanı ve arama tutanağı esas hakkındaki kararla birlikte değerlendirilecektir. Taraflara, ikinci celseye kadar delillerini bildirmeleri hatırlatıldı.',
            ),
          ],
        },
      ],
    }),
    decisionNode('H1_06B', [{ to: 'H1_07' }], {
      ...court1.base,
      lines: [
        {
          when: flag('kaan_tahliye'),
          lines: [
            s(
              'baskan',
              'Tutukluluk hâli: arka odanın sanığın kullanımında olduğuna ilişkin kuvvetli şüphenin zayıfladığı gözetilerek sanığın yurt dışına çıkış yasağı ve haftada bir imza yükümlülüğüyle adli kontrol altına alınarak tahliyesine.',
            ),
            n('Kaan başkana baktı, sonra bana, sonra ablasına. Defne ayağa kalkmıştı ve kalktığını fark etmemişti.', {
              fx: 'shake',
            }),
            n(
              'Jandarma kelepçenin anahtarını çıkardı. Kaan bileklerini ovuşturdu; sonra ne yapacağını bilmeden ellerini cebine soktu. Cebinde bir şey yoktu. Hiç olmamıştı.',
            ),
            th('Tahliye. Beraat değil, ama bir kapı. Kapının ötesinde bir sofra, bir telefon, bir perşembe.'),
          ],
        },
        {
          when: flag('tahliye_istendi'),
          lines: [
            s('baskan', 'Tutukluluk hâli: delil durumu ve atılı suçun niteliği gözetilerek tahliye talebinin reddine.'),
            n('Kaan’ın omuzları bir milim düştü. Jandarma koluna dokundu. Defne’nin sandalyesi gıcırdadı.'),
          ],
        },
        {
          lines: [
            s('baskan', 'Tutukluluk hâli: sanığın tutukluluğunun devamına.'),
            n('Kimse tahliye istemedi. Kaan sormadı bile. Jandarma koluna dokundu.'),
          ],
        },
      ],
    }),
    story('H1_07', {
      ...HEAR1,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        {
          when: flag('contra_s1'),
          lines: [
            card('ADLİYE KORİDORU — 12.10', 'adliye'),
            n('Koridorda Serap Akın yanımdan geçerken durdu. Elinde dosya, yüzünde hiçbir şey.'),
            s(
              'savci',
              'Kilit fotoğrafı iyiydi, avukat hanım. Ama arka odada kırk altı paket vardı. Kimin olduğunu hâlâ bilmiyoruz. Siz de bilmiyorsunuz.',
            ),
            s('savci', 'Bana bir isim getirin. Bir hayalet değil, bir isim. O zaman konuşuruz.'),
            s(
              'savci',
              'Bir de şunu bilin: o polis kötü bir polis değil. Acele eden bir polis. Benim dosyalarımın yarısı acele eden polislerle dolu.',
            ),
            th('Bir isim. Bir soyadı, bir adres, bir yüz. Üç haftam var.'),
          ],
        },
        {
          lines: [
            card('ADLİYE KORİDORU — 12.10', 'adliye'),
            n('Koridorda Serap Akın yanımdan geçerken durdu. Elinde dosya, yüzünde hiçbir şey.'),
            s(
              'savci',
              'Arka odada kırk altı paket vardı, avukat hanım. Bir oda, bir kiracı. Bana başka bir isim getirmedikçe o oda sizin müvekkilinizin.',
            ),
            th('Bir isim. Bir soyadı, bir adres, bir yüz. Üç haftam var.'),
          ],
        },
      ],
      choices: [cont('H107_DEVAM', 'Devam', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
    story('H1_08', {
      ...HEAR1,
      title: 'O akşam',
      background: 'buro_gece',
      lines: [
        {
          when: all(flag('kaan_tahliye'), any(flag('kaan_riza'), flag('anne_kaan'))),
          lines: [
            card('26 OCAK · 21.30 — MUDANYA, DEFNE’NİN EVİ', 'ev'),
            n(
              'Defne beni yemeğe çağırmıştı. Sofrada üç tabak vardı; birine kimse dokunmadı. Kaan çorbasını soğuttu, ısıttı, yine soğuttu.',
            ),
            s(
              'kaan',
              'Cezaevinde yemek beşte veriliyor. Saat beşte açlık başlıyor, dokuzda bitiyor. Şimdi dokuz buçuk. Vücudum hâlâ orada.',
            ),
            s('defne', 'Yavaş ye. Mide de alışkanlıktır.', 'mutlu'),
            n('Telefon çaldı. Ekranda: Anne. Kaan telefona baktı, bana baktı, ablasına baktı. Defne başını salladı.'),
            s('kaan', 'Anne? … Evet. Buradayım. Ablamdayım. … Biliyorum anne. Duydun. Hepsini duydun.', 'uzgun'),
            n(
              'Balkona çıktı. Camın arkasından bir süre konuştuğunu gördük; sonra sustuğunu; sonra yalnızca dinlediğini.',
            ),
            s('defne', 'On yıl sonra hatırlayacağım bu akşamı. Bir çorba, bir balkon, bir telefon.'),
            n(
              'Kaan balkondan döndüğünde gözleri kırmızıydı. Oturdu, çorbasını iki elle tuttu, içti. Bu sefer soğutmadı.',
            ),
            s('kaan', 'Annem “eve gel” dedi. “Sınav” lafını hiç açmadı. Sadece “yemeğini ye” dedi. Annem işte.'),
            th(
              'Tahliye bir beraat değil. Ama bir sofrada üçüncü tabağın dolu olması, bazen bir hükümden daha uzun yaşar.',
            ),
          ],
        },
        {
          when: flag('kaan_tahliye'),
          lines: [
            card('26 OCAK · 21.30 — MUDANYA, DEFNE’NİN EVİ', 'ev'),
            n(
              'Defne beni yemeğe çağırmıştı. Sofrada üç tabak vardı; birine kimse dokunmadı. Kaan çorbasını soğuttu, ısıttı, yine soğuttu.',
            ),
            s(
              'kaan',
              'Cezaevinde yemek beşte veriliyor. Saat beşte açlık başlıyor, dokuzda bitiyor. Şimdi dokuz buçuk. Vücudum hâlâ orada.',
            ),
            s('defne', 'Yavaş ye. Mide de alışkanlıktır.', 'mutlu'),
            n('Telefon çaldı. Ekranda: Anne. Kaan telefona baktı, bana baktı, ablasına baktı. Defne başını salladı.'),
            s('kaan', 'Anne? … Evet. Evet, buradayım. Ablamdayım. Hayır, sınav değildi anne. Sınav değildi.', 'uzgun'),
            n(
              'Balkona çıktı. Camın arkasından bir süre konuştuğunu gördük; sonra sustuğunu; sonra yalnızca dinlediğini.',
            ),
            s('defne', 'On yıl sonra hatırlayacağım bu akşamı. Bir çorba, bir balkon, bir telefon.'),
            n(
              'Kaan balkondan döndüğünde gözleri kırmızıydı. Oturdu, çorbasını iki elle tuttu, içti. Bu sefer soğutmadı.',
            ),
            s('kaan', 'Annem “eve gel” dedi. Önce kızdı, sonra ağladı, sonra “yemeğini ye” dedi. Annem işte.'),
            th(
              'Tahliye bir beraat değil. Ama bir sofrada üçüncü tabağın dolu olması, bazen bir hükümden daha uzun yaşar.',
            ),
          ],
        },
        {
          lines: [
            card('26 OCAK · 21.30 — ARSLAN HUKUK', 'buro_gece'),
            n(
              'Büro boştu. Yağmur yeniden başlamıştı. Masamda birinci celsenin tutanağı, mürekkebi hâlâ taze kokan bir fotokopi.',
            ),
            n('Telefon titredi. Defne: “Ring aracının camında elini gördüm. Ne yapacağız?”'),
            th('Ne yapacağız. Bir ablanın sorusu her zaman çoğul olur. Cevabım tekil olmak zorunda: ben ne yapacağım?'),
            n(
              'Tutanağı yeniden okudum. Polisin cümleleri, savcının cümleleri, Kaan’ın “neyse”leri. Bir isim eksikti. Hep o isim.',
            ),
          ],
        },
      ],
      choices: [
        option('H108_A', 'Gece yarısına kadar dosyayı yeniden oku', {
          score: { DELIL_ANALIZI: 20 },
          responses: [
            {
              lines: [
                th(
                  'Gece yarısı bir satır buldum; sabah onu da sildim. Ama bir dosyayı yeniden okumak, bir kapıyı yeniden yoklamaktır.',
                ),
              ],
            },
          ],
          next: 'ARA_GIRIS',
        }),
        option('H108_B', 'Defne’ye kısa ve dürüst bir cevap yaz', {
          effects: [inc('trust', 3)],
          responses: [
            {
              lines: [
                th(
                  '“Üç haftamız var. Bir isim arayacağım. Kovalamadan.” Gönder. Defne bir kalp göndermedi; bir “tamam” gönderdi. Bir eczacının kalbi.',
                ),
              ],
            },
          ],
          next: 'ARA_GIRIS',
        }),
      ],
    }),
  ],
};
