import {
  all,
  any,
  chosen,
  cmp,
  cont,
  dec,
  decisionNode,
  discover,
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
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H1, court1, wrongMove } from './shared.js';

// 60-hearing-1: Bursa 6. Ağır Ceza, 1. celse. Koridor, açılış ve iddianame, sanığın savunması (oyuncunun tavsiyesi),
// Şükrü Usta (S1–S4), savcılık delili (twistlock), vardiya şefi (K1–K4), ara karar talepleri, tutukluluk, erteleme.

export const PROSECUTION_EV = ['ev_twistlock', 'ev_kenan_ifade', 'ev_sukru_ifade', 'ev_tarik_ifade'];

export const savcilikRule = (id: string, who: string): ChoiceDef =>
  presentRule(id, undefined, PROSECUTION_EV, {
    maxUses: 3,
    effects: [
      ...wrongMove,
      score('SORGULAMA', -150, 'hatali'),
      mark(
        'BAD',
        'Savcılığın kendi delilini sanık lehine sunmaya çalıştın; bu delil iddianın dayanağıdır.',
        'SORGULAMA',
      ),
    ],
    responses: B(`
savci: Sayın Başkan, müdafi bizim delilimizi sunuyor. Teşekkür ederiz.
baskan: Müdafi, ${who} beyanıyla bu belgenin ilgisini açıklayın. … Açıklamıyorsunuz. Devam edin.
`),
  });

const presentMiss = (id: string) =>
  fallback(id, 'PRESENT', {
    effects: [
      ...wrongMove,
      score('SORGULAMA', -150, 'hatali'),
      mark('BAD', 'Yanlış delil: ifadeyle ilgisi yok.', 'SORGULAMA'),
    ],
    responses: B(`
baskan: Müdafi, bu belgenin tanığın söylediğiyle ilgisi nedir? … Heyet bir ilgi görmedi. Devam edin.
~ Salon bir saniye sustu. O saniye, bir heyetin güveninden kopan bir parçaydı.
`),
  });

const objectMiss = (id: string) =>
  fallback(id, 'OBJECT', {
    effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'USUL_BILGISI')],
    responses: B(`baskan: İtiraz yerinde görülmedi. Tanık devam etsin.`),
  });

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      { id: 'g_kanaat', label: 'Tanığın kişisel kanaati' },
      { id: 'g_telkin', label: 'Telkin edici soru', legalBasis: 'CMK 201/1' },
      { id: 'g_duyum', label: 'Başkasından duyduğunu aktarma' },
    ],
  },
  court: {
    sessions: [
      {
        id: 'cs_1',
        title: '1. Celse',
        stages: [
          { id: 's1_acilis', type: 'ACILIS', entryNode: 'H1_00' },
          { id: 's1_iddia', type: 'IDDIANAME', entryNode: 'H1_01' },
          { id: 's1_savunma', type: 'SANIK_SAVUNMASI', entryNode: 'H1_02' },
          { id: 's1_tanik', type: 'TANIK_DINLEME', entryNode: 'H1_03' },
          { id: 's1_delil', type: 'DELIL_TARTISMA', entryNode: 'H1_04' },
        ],
      },
    ],
  },
  nodes: [
    decisionNode('H1_00G', [{ to: 'H1_00' }], {
      ...H1,
      title: 'Adliye koridoru',
      onFirstEnter: [raise('in_court'), meet('sevim')],
      lines: [
        W(
          flag('etik_gulay'),
          `
# SALI 09.20 — BURSA ADLİYESİ, 6. AĞIR CEZA KORİDORU [bg:adliye]
> Koridor ıslak montlar ve sigara kokusuyla doluydu. Gülay bankta oturuyordu, elinde bir dosya; beni görünce gülümsedi. Rahat bir gülümseme.
gulay: Hazırım avukat hanım. On bir buçuk. Ezberledim.
~ Ezberlenmiş bir saat. Bir gün biri o saati soracak; ezber, sorunun ikinci cümlesinde çatlar.
> Koridorun öbür ucunda, siyahlar içinde bir kadın. Kimseyle konuşmuyor. Maktulün eşi. Gülay’la göz göze gelmediler.
`,
        ),
        O(`
# SALI 09.20 — BURSA ADLİYESİ, 6. AĞIR CEZA KORİDORU [bg:adliye]
> Koridor ıslak montlar ve sigara kokusuyla doluydu. Gülay bankta oturuyordu; yanında Elif’in okul çantası, içinde resim defteri.
gulay: Elif’i komşuya bıraktım. Getirseydim mi? Babasını görürdü. Ama kelepçe… Getirmedim.
> Koridorun öbür ucunda, siyahlar içinde bir kadın. Kırklarında, yorgun, sert. Kimseyle konuşmuyor; duvardaki duruşma listesine bakıyor.
gulay: O… Ercan’ın karısı. Sevim. Bana baktı mı?
- Bakmadı.
gulay/uzgun: İyi. Ne diyeceğimi bilmiyorum ona. Kocam onun kocasına vurdu. Onun kocası öldü. Benim kocam içeride. Hangimiz daha kötüyüz?
~ İki kadın, aynı koridorda, birbirine bakmadan. Bir yumruk iki evi aynı anda yıktı; biri yerle bir, biri yarı yarıya.
`),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [meet('baskan'), meet('uye'), meet('savci'), meet('mubasir')],
      lines: B(`
mubasir: Bursa Altıncı Ağır Ceza! Sanık Tarık Demireeel! Müdafii, Cumhuriyet savcısı, tanıklar… salona!
> Salon küçük ve sıcaktı. Kalorifer fazla yanıyordu; camlar buğulanmıştı. Tarık iki jandarmanın arasında getirildi, kelepçesi kapıda çözüldü.
> Bana baktı, sonra galeride Gülay’a. Gülay elini kaldırdı; parmaklarını açıp kapadı. Tarık başını eğdi.
baskan: Sanığın kimliği tespit edildi. İddianame okunmuş sayılsın mı, Sayın Savcı?
savci: Özetle okuyalım Sayın Başkan.
> Savcı Bora Kılınç, otuzlarının sonunda, kravatı düzgün, dosyası sekmelerle bölünmüş. Sanığa bakmadı; dosyaya baktı.
~ Dosyasını seven bir savcı. Sanığı değil. İyi savcı da budur; tehlikeli savcı da.
> Üye hâkim Derya Alkan, kırklarında, gözlükleri burnunun ucunda, dosyayı benden önce okumuş gibi görünüyordu. Başkan Melih Sarp sabırlı, ağır, her cümlesini bitirmeden önce bir nefes alan biri.
~ Bir heyet. Üç insan, bir masa, bir terazi. Hangisinin hangi kefeye ne koyacağını bilmeden, hepsine aynı kâğıtları göstereceğim.
`),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'İddianame',
      courtStage: 'IDDIANAME',
      background: 'durusma_salonu',
      lines: B(`
savci: Sanık, 14 Kasım günü saat 23.04 sularında Mudanya Limanı’nda maktul Ercan Yavuz’la tartışmış, maktulü darp etmiştir.
savci: Vardiya şefinin müdahalesiyle ayrılan sanık, yaklaşık yarım saat sonra B sahasına dönmüş; maktulün başının arkasına sert bir cisimle vurarak ölümüne sebep olmuştur.
savci: Tanık beyanları, sanığın “seni gebertirim” sözü, emanetteki kilit üzerindeki parmak izi birlikte değerlendirildiğinde, sanığın TCK 81/1 uyarınca cezalandırılması talep olunur.
baskan: Sanık, iddianameyi duydunuz. Susma hakkınız var; müdafiinizden yararlanma hakkınız var. Lehinize delillerin toplanmasını isteyebilirsiniz. Anladınız mı?
tarik: Anladım efendim.
baskan: Müdafi, sanıkla savunma hakkında görüştünüz mü?
~ Görüştüm. Ama ne söyleyeceğine o karar verecek. Ben yalnızca ne söylemenin ne demek olduğunu anlattım.
> Galeride Sevim Yavuz arkaya, duvarın dibine oturmuştu. Elinde bir mendil; hiç kullanmadı. Savcı “TCK 81/1” dediğinde gözlerini kapadı.
`),
      choices: [cont('H101_DEVAM', 'Sanığın savunması', 'H1_02')],
    }),
    court1.objection('H1_02', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      say: T(`
> Ara verilmeden önce Tarık’la beş dakika konuşabildim; jandarmanın iki adım ötesinde, fısıltıyla.
tarik: Ne diyeyim abla? Sen ne dersen.
~ “Sen ne dersen.” Hayır. Ben ne söylemenin ne demek olduğunu söyleyeceğim; ne diyeceğine o karar verecek.
`),
      next: 'H1_02S',
      options: [
        option('H102_A', 'Ne olduysa onu: bir kez vurduğunu, nedenini ve sonrasını kendisi anlatsın', {
          effects: [
            ifThen(
              flag('fact_yumruk'),
              [raise('durust_savunma'), inc('pers'), score('SAVUNMA_STRATEJISI', 150)],
              [score('SAVUNMA_STRATEJISI', 20)],
            ),
          ],
          quality: {
            q: 'GOOD',
            feedback:
              'Dürüst savunma, haksız tahrikin (TCK 29) ve kastın yaralamaya yönelik olduğunun tek kaynağıdır; inkâr görgü tanığı karşısında çökerdi.',
            category: 'SAVUNMA_STRATEJISI',
          },
        }),
        option('H102_B', 'Kolluktaki gibi: “ittim, düştü”', {
          effects: [raise('inkar'), score('SAVUNMA_STRATEJISI', -60)],
          bad: 'Görgü tanığının yumruğu gördüğü bir dosyada inkâr, sanığın güvenilirliğini ve tahrik zeminini birlikte yok eder.',
          category: 'SAVUNMA_STRATEJISI',
        }),
        option('H102_C', 'Meşru müdafaa: Ercan onu babaya itti, kendini korudu', {
          effects: [score('SAVUNMA_STRATEJISI', -60), dec('pers')],
          bad: 'İtiş sona ermişti; yumruk bir saldırıyı defetmek için değil, hakarete ve tükürüğe karşılıktı. TCK 25’in güncellik ve orantılılık şartı yok; doğru zemin TCK 29.',
          category: 'SAVUNMA_STRATEJISI',
        }),
        option('H102_D', 'Susma hakkını kullansın; savunmayı müdafi yapsın', {
          effects: [raise('sustu')],
          neutral: 'Susma hakkı meşrudur (CMK 147/1-e); ama yumruğun nedenini ve sonrasını anlatabilecek tek kişi o.',
        }),
      ],
    }),
    story('H1_02S', {
      ...court1.base,
      title: 'Sanığın savunması',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('durust_savunma'),
          `
tarik: Efendim, ben o gece Ercan abiye vurdum. Bir kere. Burnuna.
> Salon kıpırdadı. Savcı başını kaldırdı; ilk kez dosyasından değil, sanıktan bir şey duymuş gibi.
tarik: Polise “ittim” dedim. Utandım. Babam “elini kaldıran adam değildir” derdi. Ben elimi kaldırdım.
tarik/uzgun: Ağabeyim Emre iki yıl önce bu limanda konteyner altında kaldı. Ercan abi “ayağına bakmazdı, o yüzden ezildi” dedi. Güldü. Tükürdü yüzüme. İtti beni.
tarik: Ben de vurdum. Düştü, oturdu babanın dibine. Bağırıyordu, küfrediyordu. Kenan abi geldi, “eve git” dedi. Gittim.
tarik: Turnikeden çıktım. İskeleye indim. Çay içtim, oturdum. Ağladım. Haberler başlayınca kalktım, eve gittim.
tarik: Ben B sahasına gitmedim. Ben o adamı öldürmedim. Ben bir yumruk attım. Onun cezası neyse çekerim.
~ Bir yumruğu kabul edip bir ölümü reddetmek. En zor savunma; çünkü yarısını itiraf eder. Ve en güçlüsü; çünkü yarısı doğrudur.
`,
        ),
        W(
          chosen('H102_A'),
          `
tarik: Efendim ben… kavga ettik. İttim, düştü. Sonra Kenan abi ayırdı, eve gittim.
> Bana baktı. Bir şey söylemek istedi; söylemedi.
~ Kâğıtta ne olacağını konuştuk ama ne olduğunu hiç konuşmadık. Bir adama dürüst ol demek yetmez; önce onun doğrusunu duymuş olmak gerekir.
`,
        ),
        W(
          flag('inkar'),
          `
tarik: Efendim, ağzını bozdu, ittim, düştü. Vurmadım. Sonra eve gittim.
> Galeride Gülay gözlerini kapadı. Savcı bir şey not aldı, altını çizdi.
~ Görgü tanığı yumruğu gördü. Birazdan kürsüye çıkacak. Bir adamı yalan söylemeye bırakmak, onu düşmeye bırakmaktır.
`,
        ),
        W(
          flag('sustu'),
          `
tarik: Efendim, avukatım konuşacak. Ben susuyorum.
baskan: Bu hakkınız. Tutanağa geçsin: sanık savunma yapmayacağını bildirdi.
~ Susmak bir hak. Ama bazen bir hikâyenin en önemli cümlesi yalnızca bir kişinin ağzından çıkabilir.
`,
        ),
        O(`
tarik: Efendim, Ercan abi saldırdı, beni babaya itti. Ben kendimi korudum. Vurdum, düştü.
> Savcı hafifçe gülümsedi. Üye hâkim başını yana eğdi.
uye: Siz vurduğunuzda maktul size vuruyor muydu, sanık?
tarik: Yok… itmişti. Tükürmüştü.
~ Korunma bir saldırıya karşı olur. Hakarete karşı değil. Yanlış kapıyı çaldırdım; kapı kapandı.
`),
      ],
      choices: [cont('H102S_DEVAM', 'Sanığa sorular', 'H1_02Q')],
    }),
    court1.objection('H1_02Q', {
      title: 'Sanığa sorular',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      say: T(`
baskan: Sayın Savcı, sanığa sorunuz var mı?
savci: Var Sayın Başkan. Sanık, kavgadan sonra bir saat boyunca nerede olduğunuzu kim doğrulayabilir? B sahasına gitmediğinizi kanıtlayabilir misiniz?
> Tarık bana baktı. Sonra savcıya. Ağzını açtı, kapadı.
~ Bir soru, iki soru gibi duruyor. İkincisi bir tuzak: sanıktan masumiyetini kanıtlamasını istiyor.
`),
      next: 'H102Q_SON',
      options: [
        option('H102Q_A', 'İtiraz: sanık masumiyetini ispatla yükümlü değildir; ispat yükü iddiadadır', {
          score: { USUL_BILGISI: 80 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Masumiyet karinesi (Anayasa 38/4, AİHS 6/2): sanık suçsuzluğunu ispatlamak zorunda değildir; soru bu haliyle sorulamaz.',
          responses: B(`
- İtiraz, Sayın Başkan. Sanık bir şeyi kanıtlamak zorunda değildir. İspat yükü iddia makamındadır.
baskan: Yerinde. Sayın Savcı, sorunuzu sanığın ne yaptığını soracak biçimde sorun.
savci: Sanık, kavgadan sonra nereye gittiniz?
`),
        }),
        option('H102Q_B', 'Sanık cevaplasın', {
          neutral: 'Soru cevaplandı; ama sanıktan masumiyetini kanıtlaması istendiği tutanağa itirazsız geçti.',
          responses: B(`baskan: Sanık, cevap verin.`),
        }),
        option('H102Q_C', '“Bu soru savcının önyargısını gösteriyor!”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'İtiraz bir usul kuralına dayanmalıdır; savcıya kişisel çıkış heyetin sabrını tüketir.',
          responses: B(`baskan: Müdafi, itirazınızı hukuki dayanağıyla yapın. Sanık, cevap verin.`),
        }),
      ],
    }),
    story('H102Q_SON', {
      ...court1.base,
      title: 'Sanığa sorular',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('durust_savunma'),
          `
tarik: Turnikeden çıktım efendim. Kartım okundu. İskeleye indim, Nail Usta’nın büfesine. İki çay aldım, kartla ödedim. Oturdum.
tarik: Haberler başlayınca kalktım. Eve on ikiyi on geçe vardım. Karım bilir.
savci: Bir saat bir büfede, tek başına mı oturdunuz?
tarik/uzgun: Ağladım efendim. Bir saat ağladım. Bunu kimse görmesin istedim; şimdi herkes biliyor.
> Galeride biri burnunu çekti. Savcı bir şey not aldı; bu kez altını çizmedi.
`,
        ),
        O(`
tarik: Eve gittim efendim. Yürüdüm. Biraz oturdum yolda. Sonra eve gittim.
savci: Nerede oturdunuz? Kim gördü?
tarik: Bilmiyorum efendim… Bir yerde. Kimse görmedi herhalde.
> Savcı başını salladı; kendi kendine. Heyet bir şey yazmadı.
~ Bir saatin cevabı Tarık’ın içinde duruyor; ama o cevabı kürsüye taşıyacak kelimeleri ona kimse vermedi. Ben de vermedim.
`),
      ],
      choices: [cont('H102Q_DEVAM', 'Tanık Şükrü Balcı', 'H1_03')],
    }),
    court1.testimony('H1_03', {
      title: 'Görgü tanığı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'sukru',
      witnessLabel: 'TANIK · ŞÜKRÜ BALCI',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_kanaat', 'g_telkin', 'g_duyum'],
      onFirstEnter: [
        ifThen(flag('inkar'), [
          dec('cred'),
          dec('pers'),
          mark('BAD', 'Sanığın inkârı görgü tanığının ilk cümlesinde çöktü.', 'SAVUNMA_STRATEJISI'),
        ]),
      ],
      say: T(`
mubasir: Tanık Şükrü Balcııı!
> Şükrü Usta bayramlık ceketini giymişti; omuzları dar geliyordu. Kürsüye tutundu. Kulağının arkasında ten rengi cihaz.
baskan: Tanık, yemin ettiniz. Gördüğünüzü anlatın. Yüksek sesle, lütfen.
sukru: Ha? Gördüğümü mü? Gördüm efendim. Forkliftin kabinindeydim. Yirmi metre.
> Savcı tek bir soru sordu: “Sanığın maktulü tehdit ettiğini duydunuz mu?” Şükrü Usta başını salladı. Savcı oturdu.
~ Dürüst bir adam. Dürüst adamlar da yanılır; kürsüde bunu onlara kendileri söyletmek gerekir. Benim değil, kâğıdın sesiyle.
`),
      statements: [
        statement('S1', 1, [
          'Tarık bağırdı: ',
          hl('“Seni gebertirim!”', any(flag('press_s1'), has('clue_pil'))),
          ' Duydum.',
        ]),
        statement('S2', 2, [
          'Çocuk bir tane vurdu, ',
          hl('Ercan’ın kafası babaya çarptı', any(flag('press_s2'), has('ded_kan'))),
          '; yığıldı kaldı.',
        ]),
        statement('S3', 3, ['Sonra Kenan Bey geldi, ayırdı. Ercan kalktı, ', hl('söverek kantine yürüdü'), '.']),
        statement('S4', 4, ['O çocuk ', hl('hırslıdır, döner, yapar'), '. Bilirim ben.'], flag('press_s3')),
      ],
      rules: [
        savcilikRule('PS_SAV_S', 'tanığın'),
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1')],
          responses: B(`
- Usta, bağıranın ağzını gördünüz mü?
sukru: Ha? Ağzını mı? Yağmur vardı, far vardı… Çocuk ayaktaydı, Ercan yerdeydi. Ayaktaki bağırır diye düşündüm.
~ “Düşündüm.” Kolluk tutanağında “duydum” yazıyor.
`),
        }),
        presentRule('PS_S1', 'S1', ['clue_pil'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s1')],
          good: 'Tanığın işitme cihazının o gece çalışmadığı ortaya kondu; “seni gebertirim”i kimin söylediğini görmediği tutanağa geçti (CMK 217).',
          category: 'SORGULAMA',
          responses: B(`
- Usta, o gece cihazınızın pili var mıydı?
> Şükrü Usta elini kulağına götürdü. Bir an salonun ortasında, herkesin önünde, yalnız kaldı.
sukru: Bitikti efendim. Yedeği evde kalmıştı. Sesi duydum, kafamın içinde uğultu gibi. Kimin ağzından çıktığını görmedim.
sukru/uzgun: Polis “kim bağırdı” dedi. Çocuk ayaktaydı… Ben “o” dedim. Bilmiyorum efendim. Bilmiyorum. Ercan da bağırıyor olabilir. Yerde olan bağırır da.
baskan: Tutanağa geçsin: tanık, tehdit sözünün kimin tarafından söylendiğini görmediğini beyan etti.
> Şükrü Usta oturmak için sandalyeye baktı, sonra yeniden dikildi. Bayramlık ceketinin düğmesini kapattı.
~ “Bilmiyorum.” Bir dürüst adamın kürsüde söyleyebileceği en ağır kelime. Söyledi.
`),
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s2')],
          responses: B(`
- Kafası babaya çarparken gördünüz mü, yoksa sonra mı?
sukru: Düştü işte. Babanın dibine. Kafası… babaya çarptı herhalde. Oturdu. Sonra elleri yüzündeydi.
~ “Oturdu.” Yığılan biri oturmaz.
`),
        }),
        presentRule('PS_S2', 'S2', ['ded_kan'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s2')],
          good: 'Kan babanın gövdesinde oturma hizasında; yüz lezyonları basit tıbbi müdahalelik: yumruk başı babaya vurdurmadı.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, olay yeri fotoğrafı 9: kan babanın gövdesinde, yerden kırk santim yukarıda; tepesinde saç ya da doku yok. Ön rapor: burun ve dudak lezyonu basit tıbbi müdahaleyle giderilebilir.
- Usta, Ercan babanın dibine oturdu mu, yoksa kafasını mı çarptı?
sukru: Oturdu efendim. Oturdu, elini yüzüne kapadı. Burnu kanıyordu, kafası değil. Kafa demedim ki ben… dedim mi?
uye: Kolluk ifadenizde “kafası babaya çarptı” yazıyor.
sukru: Öyle yazmışlar efendim. Ben “babaya düştü” dedim.
`),
        }),
        presentRule('PS_S2_RAPOR', 'S2', ['ev_onrapor'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          neutral:
            'Kısmi isabet: rapordaki yüz lezyonları yumruğu küçültüyor; ama başın babaya çarpmadığını gösteren olay yeri bulgusu yoktu.',
          responses: B(`
- Ön rapor maktulün yüzündeki lezyonları basit tıbbi müdahalelik sayıyor.
sukru: Ben doktor değilim efendim. Düştü, gördüm.
`),
        }),
        pressRule('PR_S3', 'S3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s3'), ifThen(not(has('clue_kantin')), [discover('clue_kantin')])],
          responses: B(`
- Kantinde onu gördünüz mü?
sukru: Gördüm tabii. On bir buçuk gibi. Burnuna pamuk tıkamış, tost yiyordu, ayran içiyordu. Söyleniyordu: “O Karadenizliyi bitireceğim.”
sukru: Ölü adam tost yemez efendim. O çocuk da oradan çoktan gitmişti.
savci: Tanık, sanığın limandan çıktığını gördünüz mü?
sukru: Görmedim. Ama o çocuk… o çocuk hırslıdır. Döner, yapar. Bilirim ben.
`),
        }),
        objectRule('OB_S4', 'S4', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark('GOOD', 'İtiraz yerinde: tanık görgüsünü değil, sanık hakkındaki kanaatini aktarıyor.', 'SORGULAMA'),
          ],
          responses: B(`
- İtiraz, Sayın Başkan. Tanık gördüğünü değil, sanık hakkındaki kanaatini söylüyor.
baskan: Yerinde. Tanık, yalnızca gördüklerinizi anlatın. Kanaat tutanağa geçmeyecek.
sukru: Ha… Haklısınız efendim. Görmedim. Görmediğimi demem.
`),
        }),
      ],
      presentMiss: presentMiss('FB_H103_PRESENT'),
      objectMiss: objectMiss('FB_H103_OBJECT'),
      finish: { id: 'H103_BITIR', next: 'H1_04' },
    }),
    court1.objection('H1_04', {
      title: 'Savcılık delili',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      prosecutionEvidence: 'ev_twistlock',
      say: T(`
savci: Sayın Başkan, emanetteki kilit. Maktulün bulunduğu yerin yakınındaki kafesten alınmıştır. Üstünde sanığın parmak izi var. Cinayet aleti budur.
> Mübaşir naylon poşetin içindeki sarı, ağır kilidi kürsünün önüne koydu. Galeride biri yutkundu.
baskan: Müdafi, delile karşı diyeceğiniz?
`),
      next: 'H1_04B',
      options: [
        option(
          'H104_A',
          'Kriminal rapor: biyolojik iz yok; iz, işçinin her gün tuttuğu kilitte mesleki temasla açıklanır',
          {
            score: { DELIL_ANALIZI: 100 },
            effects: [inc('pers'), raise('twist_itiraz')],
            good: 'Biyolojik izin yokluğu ve iz ile meslek arasındaki bağ, aletle eylem arasında bir irtibat kurulamadığını gösterir (CMK 217).',
            responses: B(`
- Sayın Başkan, kriminal rapor kilitte kan, doku ya da saç bulunmadığını söylüyor. Kafatasını kıran bir darbe bu kilitte iz bırakırdı.
- Parmak izine gelince: sanık laşing işçisi. Her gece dört yüz kilit takıp sökerdi. Kafesteki her kilitte onun izi olması bir delil değil, bir meslek.
savci: Kilit silinmiş olabilir.
- O zaman parmak izi de silinirdi, Sayın Savcı.
> Üye hâkim kısa bir not aldı. Savcı cevap vermedi.
`),
          },
        ),
        option('H104_B', 'Delil hukuka aykırı elde edilmiştir; dışlanmalıdır', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Kilit kolluk tarafından olay yerinde usulüne uygun alınmış ve emanete konmuştur; hukuka aykırılık iddiası dayanaksız (CMK 206/2-a’nın şartları yok).',
          responses: B(`
baskan: Hangi usul kuralı ihlal edildi, müdafi? … Belirtemiyorsunuz. Talep reddedildi.
`),
        }),
        option('H104_C', 'Kilidin ölçüsü kırıkla karşılaştırılmalı; bilirkişiden sorulsun', {
          effects: [
            ifThen(
              has('clue_desen'),
              [
                score('DELIL_ANALIZI', 60),
                raise('olcu_talep'),
                mark(
                  'GOOD',
                  'Kırığın ölçüsü elindeydi; aletin ölçüsüyle karşılaştırılması bilirkişiye bırakıldı.',
                  'DELIL_ANALIZI',
                ),
              ],
              [
                score('DELIL_ANALIZI', -30),
                mark(
                  'BAD',
                  'Kırığın ölçüsünü bilmeden ölçü karşılaştırması istedin; talep havada kaldı.',
                  'DELIL_ANALIZI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              has('clue_desen'),
              `
- Sayın Başkan, ön rapordaki kırık 3,2 santim, dairesel. Bu kilidin hangi yüzünün bu yarayı açabileceği bilirkişiye sorulsun.
baskan: Bilirkişi dinlenirken sorulur. Not edildi.
`,
            ),
            O(`
- Kilidin ölçüsü yarayla karşılaştırılsın.
baskan: Yaranın ölçüsü nedir, müdafi? … Bilirkişi dinlenirken sorarsınız.
`),
          ],
        }),
        option('H104_D', 'Diyeceğimiz yok', {
          effects: [dec('pers')],
          neutral: 'Savcılığın aletine karşı söz almadın; heyet onu tartışılmamış bir delil olarak not etti.',
        }),
      ],
    }),
    story('H1_04B', {
      ...court1.base,
      title: 'Kısa ara',
      background: 'adliye',
      lines: B(`
baskan: On dakika ara.
# ADLİYE KORİDORU · 11.20 [bg:adliye]
> Koridorda pencereler buğuluydu. Bir avukat telefonda bağırıyor, bir mübaşir bir listeyi duvara asıyordu.
> Gülay bankta oturuyordu. Önünde Kenan Aksoy duruyordu; elinde plastik bir bardak su. Bardağı Gülay’a uzattı.
kenan: İç kızım, iç. Üzülme. Allah büyük. Ben ne gördüysem onu söyleyeceğim; elimden başka bir şey gelmez.
> Gülay bardağı aldı, içmedi. Kenan beni görünce başıyla selam verdi ve koridorun öbür ucuna, tanık odasına yürüdü.
gulay: İyi adam. Tarık’a iş o buldu. Şimdi onun sözüyle… Ne biçim dünya bu avukat hanım?
> Telefonum titredi. Leyla. [phone]
leyla: Forkliftçi nasıl gitti? [phone]
- Dürüst bir adam. Yanıldığını kendisi söyledi.
leyla: Güzel. Şimdi sıra kesin olanda. Ona “yanıldınız” deme; kâğıdı göster, bırak kendisi söylesin. Söylemezse heyet söyler. [phone]
> Tanık odasının kapısı aralıktı. İçeride Kenan, bir sandalyede, dirsekleri dizlerinde. Bez parçasını iki elinin arasında katlıyor, açıyor, yeniden katlıyordu.
~ Her tanığın kürsüden önce bir alışkanlığı var. Şükrü Usta’nınki cihazına dokunmaktı. Bunun ki bir bez parçası.
`),
      choices: [cont('H104B_DEVAM', 'Tanık Kenan Aksoy', 'H1_05')],
    }),
    court1.testimony('H1_05', {
      title: 'Vardiya şefi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'kenan',
      witnessLabel: 'TANIK · KENAN AKSOY',
      rulesText: 'İpucu: inanılan bir tanığı yalancı çıkarma; yanıldığını kâğıtla göster.',
      objectionGrounds: ['g_kanaat', 'g_telkin', 'g_duyum'],
      say: T(`
mubasir: Tanık Kenan Aksoooy!
> Kenan lacivert bir takım giymişti; kravatsız. Kürsüye geçerken Tarık’ın omzuna, bir babanın yapacağı gibi, eliyle hafifçe dokundu. Jandarma bir şey demedi.
baskan: Tanık, yemin ettiniz. Olayı anlatın.
kenan: Efendim, o gece vardiya şefiydim. Kavgayı ben ayırdım. Sonra…
> Bir an durdu. Elini cebine soktu, bir bez parçası çıkardı, avucunda sıktı, geri koydu.
kenan/uzgun: Sonra bu çocuğu gördüm. Söylemek istemezdim. Ama yemin ettim.
~ Kürsüde ağır bir tanık: üzgün, babacan, isteksiz. İsteksiz tanığa herkes inanır.
> Savcı ayağa kalktı. Sorularını tek tek, aceleyle değil, bir kayık yanaştırır gibi sordu.
savci: Tanık, sanığı kaç yıldır tanırsınız?
kenan: Dört yıl efendim. Ağabeyi öldükten sonra ben işe aldım. Oğlum gibidir.
savci: O gece onu gördüğünüzden eminsiniz.
kenan/uzgun: Keşke emin olmasaydım.
> Savcı oturdu. Galeride biri iç çekti. Başkan bana döndü.
`),
      statements: [
        statement('K1', 1, [
          'On bire yirmi var gibi tur attım. ',
          hl('B sahasının ağzında Tarık’ı gördüm', any(flag('press_k1'), has('ded_cikis'), has('ev_hesap'))),
          '.',
        ]),
        statement('K2', 2, [
          hl('Projektörler yanıyordu, gündüz gibiydi', any(flag('press_k2'), has('clue_projektor'))),
          '; yüzünü gördüm.',
        ]),
        statement('K3', 3, [
          'Elinde demir gibi bir şey vardı. ',
          hl('O çocuğun içinde yangın vardı; yapar', any(flag('press_k3'), has('clue_kenan_isik'))),
          '.',
        ]),
        statement('K4', 4, [
          'Ercan’ı kantine yolladım, ',
          hl('ofise döndüm, sabaha kadar ofisteydim', any(flag('press_k4'), has('clue_servis_arac'))),
          '.',
        ]),
      ],
      rules: [
        savcilikRule('PS_SAV_K', 'tanığın'),
        pressRule('PR_K1', 'K1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k1')],
          responses: B(`
- Saatten emin misiniz?
kenan: Aşağı yukarı kızım… Avukat hanım. Defteri yazdım, kalktım, tur attım. On bire yirmi var. Yirmi yıldır her gece aynı saatte tur atarım.
`),
        }),
        presentRule('PS_K1', 'K1', ['ded_cikis', 'ev_turnike', 'ev_hesap', 'ded_buf'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_k1')],
          good: 'Sanığın 23.18’de limandan çıktığı ve 23.37’de iskele büfesinde olduğu kayıtlarla gösterildi: 23.40’taki teşhis mümkün değil.',
          category: 'SORGULAMA',
          responses: [
            W(
              any(has('ded_cikis'), has('ev_turnike')),
              `
- Sayın Başkan, liman turnike dökümü: sanığın kartı 23.18.42’de 2 numaralı turnikeden çıkış. Sabaha kadar bu kartla başka geçiş yok.
- Bir de banka kaydı: 23.37, iskele büfesi, sanığın kartı. Büfe personel kapısından yirmi dakika.
> Kenan bir süre kâğıtlara baktı. Bez parçası yeniden avucundaydı.
kenan: Başka kapıdan girmiştir. Tel örgü… delik olur bazen.
baskan: Tanık, limanda tel örgüde bildiğiniz bir delik var mı?
kenan: Yok efendim. Yani… bilmiyorum.
~ İlk çatlak. Bir tanığın kendi limanını bilmediğini söylemesi.
`,
            ),
            O(`
- Sayın Başkan, sanığın banka kartıyla 23.37’de iskele büfesine ödeme yapılmış. Büfe limanın personel kapısından yirmi dakika.
kenan: Kartını başkasına vermiştir. Bilemem.
baskan: Tanık, sanığın kartını başkasına verdiğine dair bir bilginiz var mı?
kenan: Yok efendim.
~ Bir çatlak. Kâğıt bir saat söylüyor; tanık bir tahmin.
`),
          ],
        }),
        pressRule('PR_K2', 'K2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k2')],
          responses: B(`
- B sahasının projektörleri o gece yanıyor muydu?
kenan: Yanıyordu tabii. Liman gece yanar. Gündüz gibiydi.
`),
        }),
        presentRule('PS_K2', 'K2', ['ded_isik', 'clue_projektor'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_k2')],
          good: 'Projektör direğindeki bakım etiketi: 23.00–02.00 enerji yok. “Gündüz gibi” ışık yoktu; teşhisin dayanağı düştü.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, olay yeri fotoğrafı 17. B sahasının projektör direği. Etiket: “14/11 · 23.00–02.00 · bakım · enerji yok.”
> Kenan fotoğrafa baktı. Uzun uzun. Sonra gözlerini kapadı, açtı.
kenan: Bakım… Evet. Bakım vardı o gece. Unutmuşum. Rıhtımın ışığı vardı ama. Uzaktan…
uye: Rıhtımın ışığı B sahasının ağzına ne kadar uzakta, tanık?
kenan: Üç yüz metre efendim.
~ Üç yüz metre, gece, yağmur, sönük projektörler. “Gündüz gibi” değil.
`),
        }),
        pressRule('PR_K3', 'K3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k3')],
          responses: B(`
- Elindeki şeyin ne olduğunu gördünüz mü?
kenan: Demir gibi. Uzun değil. Kilit olabilir. Bilmiyorum. Karanlıktı.
~ “Karanlıktı.” Az önce gündüz gibiydi.
`),
        }),
        objectRule('OB_K3', 'K3', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark('GOOD', 'İtiraz yerinde: tanık sanığın “içindeki yangın”a dair kanaatini aktarıyor.', 'SORGULAMA'),
          ],
          responses: B(`
- İtiraz, Sayın Başkan. Tanık gördüğünü değil, sanığın karakteri hakkındaki kanaatini anlatıyor.
baskan: Yerinde. Tanık, gördüğünüzle sınırlı kalın.
kenan: Haklısınız efendim. Babalık işte… insan karışıyor.
`),
        }),
        pressRule('PR_K4', 'K4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k4')],
          responses: B(`
- O gece ofisten hiç çıkmadınız mı? Tur dışında?
kenan: Çıkmadım. Defter yazdım, telsize baktım. Gece vardiyası öyledir; sabaha kadar ofis.
`),
        }),
        presentRule('PS_K4', 'K4', ['clue_servis_arac', 'ded_tasima'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers'), raise('k4_arac')],
          neutral:
            'Kısmi isabet: 23.49’da limana bir servis kamyoneti girmiş; ama kimin kullandığı henüz belgelenmedi.',
          responses: B(`
- Turnike dökümüne göre 23.49’da araç kapısından 16 LMN 07 plakalı servis kamyoneti girmiş, 00.14’te çıkmış. Kim kullanıyordu?
kenan: Servis aracı her gece girer çıkar avukat hanım. Kimin kullandığını defter bilir, ben bilmem.
> Bez parçası avucunda. Sesi değişmedi; yalnızca biraz yavaşladı.
~ Defter bilir. Peki, defteri görelim.
`),
        }),
      ],
      presentMiss: presentMiss('FB_H105_PRESENT'),
      objectMiss: objectMiss('FB_H105_OBJECT'),
      finish: { id: 'H105_BITIR', next: 'H1_05K' },
    }),
    decisionNode('H1_05K', [{ to: 'H1_06' }], {
      ...court1.base,
      title: 'Vardiya şefi',
      lines: [
        W(
          all(flag('contra_k1'), flag('contra_k2')),
          `
> Kenan kürsünün kenarını tuttu. Bir süre kimseye bakmadı.
kenan/uzgun: Efendim… belki yanılmışımdır. Karanlıktı. Yağmur vardı. Bir yürüyüş gördüm, Tarık sandım. Yaşlanıyorum.
baskan: Tanık, 23.40’ta B sahasının ağzında gördüğünüz kişinin sanık olduğundan emin misiniz?
kenan: Emin… değilim efendim.
> Savcı kalemini masaya bıraktı. Galeride Gülay elini ağzına kapadı. Sevim Yavuz ise Kenan’a bakıyordu; dikkatle, kaşlarını çatarak.
~ Kürsüden bir teşhis düştü. Ama iyi bir adam “yanılmışım” dediğinde salon onu affeder. Kimse sormaz: neden yanıldı?
> Tarık sanık sırasında başını kaldırdı ve Kenan’a baktı. Kızgın değildi; şaşkındı. Bir çocuğun babasına bakışı gibi.
tarik: Abi… ben orada değildim.
> Kenan cevap vermedi. Kürsüden indi, Tarık’ın yanından geçerken bu kez omzuna dokunmadı; elini cebindeki bez parçasına götürdü.
`,
        ),
        W(
          any(flag('contra_k1'), flag('contra_k2')),
          `
> Kenan kürsüden indi. Tarık’ın yanından geçerken bu kez omzuna dokunmadı.
~ Bir çatlak açtım. Tek bir çatlak, bir duvarı yıkmaz; ama içinden ışık sızar.
`,
        ),
        O(`
> Kenan kürsüden indi; Tarık’ın omzuna yine dokundu. Savcı memnun bir yüzle dosyasını kapattı.
~ İyi bir adam yemin etti ve inanıldı. Elimde onu yanıltacak kâğıt yoktu. Ya da vardı, sunamadım.
`),
      ],
    }),
    story('H1_06', {
      ...court1.base,
      title: 'Ara karar talepleri',
      background: 'durusma_salonu',
      lines: B(`
baskan: Taraflar, eksik hususlar ve delil talepleri? Önce müdafi.
~ Mahkemeden üç şey isteyebilirim; fazlası okunmaz. Neyi isteyeceğim, ikinci celsenin elinde ne olacağını belirler.
> Savcı dosyasını çevirdi. Kendi talepleri kısaydı: “Tanıkların yeniden dinlenmesine gerek yoktur; ATK raporu beklenebilir.” Bir savcı için dosya kapanmıştı.
~ Bir dosya, bir savcı için kapanınca, avukat için açılır. Kapıyı neyle açık tutacağımı seçmem gerekiyor.
`),
      choices: [
        option('TL_ATK', 'ATK’dan nihai raporun alınması ve raporu düzenleyenin duruşmada dinlenmesi', {
          enabledWhen: cmp(v('talep_n'), '<', 3),
          score: { USUL_BILGISI: 50 },
          effects: [raise('talep_atk'), inc('talep_n')],
          good: 'Ölümün sebebi ve zamanı için uzman beyanı; bilirkişinin duruşmada dinlenmesi istenebilir (CMK 63, 67/4, 211).',
          responses: B(`baskan: Kabul. Kurumun nihai raporu beklenecek, raporu düzenleyen uzman dinlenecek.`),
        }),
        option('TL_GPS', 'Servis kamyoneti 16 LMN 07’nin araç takip ve zimmet kayıtları', {
          visibleWhen: any(has('clue_servis_arac'), flag('k4_arac')),
          enabledWhen: cmp(v('talep_n'), '<', 3),
          score: { USUL_BILGISI: 80 },
          effects: [raise('talep_gps'), inc('talep_n')],
          good: 'Olay saatinde limana giren tek aracın konumu ve kullanıcısı; somut, ilgili ve elde edilebilir (CMK 332).',
          responses: B(`
savci: İtirazımız yok Sayın Başkan.
baskan: Kabul. İşletmeye müzekkere yazılsın.
`),
        }),
        option('TL_ABONE', '23.41’de maktulün aradığı hattın abone bilgisi', {
          visibleWhen: has('clue_arama2341'),
          enabledWhen: cmp(v('talep_n'), '<', 3),
          score: { USUL_BILGISI: 80 },
          effects: [raise('talep_abone'), inc('talep_n')],
          good: 'Maktulün son görüşmesinin muhatabı; hâkim kararıyla BTK’dan abone bilgisi istenebilir (CMK 135/6 çerçevesinde).',
          responses: B(`
savci: Maktulün kiminle konuştuğu bizim de ilgimizi çeker. İtirazımız yok.
baskan: Kabul. BTK’ya yazılsın.
`),
        }),
        option('TL_KANTIN', 'Kantinin kart okuyucu kayıtları', {
          visibleWhen: not(has('ev_kantin')),
          enabledWhen: cmp(v('talep_n'), '<', 3),
          score: { USUL_BILGISI: 40 },
          effects: [raise('talep_kantin'), inc('talep_n')],
          good: 'Maktulün kavgadan sonraki hayatını belgeleyen kayıt (CMK 332).',
          responses: B(`baskan: Kabul.`),
        }),
        option('TL_YAKALA', 'Vardiya şefi hakkında yakalama kararı verilmesi', {
          enabledWhen: cmp(v('talep_n'), '<', 3),
          score: { USUL_BILGISI: -80 },
          effects: [dec('cred'), inc('talep_n')],
          bad: 'Müdafi bir tanık hakkında yakalama isteyemez; tanığın suç işlediği şüphesi varsa yol, Cumhuriyet Başsavcılığına suç duyurusudur (CMK 158).',
          responses: B(`
baskan: Müdafi, burası sizin müvekkilinizin yargılandığı dava. Tanık hakkında bir şüpheniz varsa yeri savcılıktır. Reddedildi.
> Savcı hafifçe başını salladı; benim için değil, başkan için.
`),
        }),
        cont('TL_BITIR', 'Taleplerimiz bu kadar', 'H1_07'),
      ],
    }),
    court1.objection('H1_07', {
      title: 'Tutukluluk',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      say: T(`
baskan: Sanığın tutukluluk hâli. Sayın Savcı?
savci: Atılı suçun vasfı ve cezanın üst sınırı gözetilerek tutukluluğun devamını talep ederiz.
baskan: Müdafi?
`),
      next: 'H1_08',
      options: [
        option('H107_A', 'Adli kontrolle tahliye: sanığın dönmediği kayıtla sabit; kaçma şüphesi yok', {
          effects: [
            ifThen(
              flag('contra_k1'),
              [
                raise('released'),
                score('USUL_BILGISI', 100),
                inc('legal_hits'),
                mark('GOOD', 'Kuvvetli suç şüphesi zayıfladı; adli kontrol yeterli (CMK 100, 109).', 'USUL_BILGISI'),
              ],
              [
                score('USUL_BILGISI', 30),
                mark('NEUTRAL', 'Talep yerindeydi; ama teşhis ayakta kaldığı için kuvvetli şüphe sürdü.'),
              ],
            ),
          ],
          responses: [
            W(
              flag('contra_k1'),
              `
- Sayın Başkan, sanığın 23.18’de limandan çıktığı kayıtla sabit. Teşhis eden tanık emin olmadığını söyledi. Kuvvetli suç şüphesi kalmamıştır; adli kontrol yeterlidir.
> Heyet kısa bir müzakere için başlarını yaklaştırdı.
baskan: Sanığın yurt dışına çıkış yasağı ve haftada iki gün imza yükümlülüğüyle tahliyesine.
> Galeride Gülay ayağa kalktı, sonra utanıp oturdu. Tarık kelepçesiz bileğine baktı; elinin ne yapacağını bilmiyormuş gibi.
`,
            ),
            O(`
- Sayın Başkan, sanık sabıkasız, ikametgâhı belli, bir çocuk babası. Adli kontrol yeterlidir.
baskan: Tanık beyanları ve delil durumu gözetilerek tutukluluğun devamına.
> Tarık başını eğdi. Gülay galeride ellerini dizlerine bastırdı.
`),
          ],
        }),
        option('H107_B', 'Tutukluluk baştan hukuka aykırıydı; tazminat hakkımızı saklı tutarız', {
          score: { USUL_BILGISI: -40 },
          effects: [dec('cred')],
          bad: 'Tutuklama kararı o tarihteki delillere göre verildi; şimdi istenmesi gereken tahliyedir, tazminat tartışması değil (CMK 141 hükümden sonra).',
          responses: B(`baskan: Tazminat hükümden sonra konuşulur, müdafi. Tutukluluğun devamına.`),
        }),
        option('H107_C', 'Takdir mahkemenizindir', {
          neutral: 'Tahliye talep edilmedi; müvekkil bir ay daha içeride.',
          responses: B(`baskan: Tutukluluğun devamına.`),
        }),
      ],
    }),
    story('H1_08', {
      ...court1.base,
      title: 'Erteleme',
      background: 'adliye',
      lines: [
        W(
          flag('released'),
          `
baskan: Eksik hususların tamamlanması için duruşma üç hafta sonraya ertelendi.
# ADLİYE ÖNÜ · 13.40 [bg:adliye]
> Tarık adliyenin merdivenlerinden indi. Gülay ona sarılmadı; elini tuttu, sıktı, bıraktı. Yağmur dinmişti.
tarik: Abla… Bitti mi?
- Bitmedi. Daha bir celse var. Ama bu akşam Elif’i öpebilirsin.
> Merdivenin dibinde, siyahlar içinde Sevim Yavuz duruyordu. Tarık onu görünce durdu. Sevim ona bakmadı. Kenan’ın gittiği yöne bakıyordu.
~ Kocasının katili diye bildiği adama değil, kocasının amirine bakan bir dul. Not aldım.
`,
        ),
        O(`
baskan: Eksik hususların tamamlanması için duruşma üç hafta sonraya ertelendi.
# ADLİYE ÖNÜ · 13.40 [bg:adliye]
> Tarık’ı jandarma götürdü. Kapıdan çıkarken bana döndü, bir şey söylemek istedi, söylemedi.
> Gülay merdivenlerde, Elif’in resim defterini göğsüne bastırmış duruyordu.
gulay: Üç hafta daha. Elif’e ne diyeceğim?
- Babası gemide diyeceksiniz. Bir sefer daha.
> Merdivenin dibinde, siyahlar içinde Sevim Yavuz duruyordu. Gözleri Kenan’ın gittiği yöndeydi.
`),
      ],
      choices: [cont('H108_DEVAM', 'Ara · üç hafta', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
};
