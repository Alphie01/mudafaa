import { all, always, any, because, cmp, finalAtLeast, flag, has, not, outcome, ref, v, xp } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, W } from './dsl.js';
import { T_BERAAT, T_BERAAT_B, T_INDIRIM } from './thresholds.js';

// 90-outcomes: beş sonuç sınıfı. Öncelik: ETİK (karartma) > BERAAT_B > BERAAT_E > KISMI > MAHKUMIYET (varsayılan).
// Çöküş, mahkûmiyetin bir varyantıdır (epilog koşuluyla ayrılır). Final eşikleri eşik çubuğuyla aynı.

const sozHatirlat = W(
  flag('soz_verildi'),
  `~ “Beraat ettiririz” demiştim. Bir çocuk, babasının ağzından o sözü duymuştu. Sözlerin bir ağırlığı var; bugün onu taşıdım.`,
);

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'OTHER',
      priority: 1,
      when: flag('karartma'),
      stamp: 'MESLEKTEN',
      stampTone: 'red',
      header: '',
      sentence: 'Hakkında işlem · dosya baroya',
      verdictText:
        'Yargılama sırasında savunma tarafınca delil üzerinde oynandığı yönünde emareler tespit edilmekle, keyfiyetin Cumhuriyet Başsavcılığına ve ilgili baroya bildirilmesine; sanık yönünden yargılamaya devamla.',
      reasoning: [
        because('Mahkemeye sunulacak dijital veri üzerinde oynanması delil karartmadır (TCK 281); avukatın buna katılması meslek kurallarının ağır ihlalidir (Av.K. 34).'),
        because('Başkasının hesabına izinsiz erişim ayrıca suçtur (TCK 243) ve bu yolla elde edilen hiçbir şey delil olamaz (CMK 206/2-a).'),
      ],
      legalBasis: 'TCK 281, 243; Av.K. 34; CMK 206/2-a',
      xp: 0,
      howToReach: 'Ulaşılmaması gereken son: müvekkilin “sil” ya da “gir” teklifini kabul etmek.',
      ethicsCard:
        'Bir müvekkil, hakkındaki adaletsizliğe aynı yolla karşılık vermeni isteyebilir. Avukatın işi, o yola girmemektir. Delil karartmak, başkasının hesabına girmek: müvekkili de, seni de yakar.',
      epilogue: B(`
        > Hâkim hükmü okuduktan sonra bana ayrıca bir şey söyledi; tutanağa geçmeyen bir şey.
        feride: Siz hukuku biliyorsunuz müdafi. Bugün bildiğinizi unuttunuz.
        > Büroya döndüğümde Leyla masamda bir kitapçık bırakmıştı: meslek kuralları. Üstünde bir not yok. Nota gerek yok.
        > Tarık’ın kurşun kalemi masada unutulmuştu. Tıkırdamıyordu. Bir daha da tıkırdamadı.
        ~ Biri Tarık’a tek bir anahtar vermişti ve bütün kapıları açmıştı. Ben de bir anahtar aldım elime. Fark etmeliydim.
      `),
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(not(flag('cokus')), flag('gercek_fail'), flag('contra_o3'), cmp(v('pers'), '>=', 7), finalAtLeast(T_BERAAT_B)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Adli kontrol kaldırıldı',
      verdictText:
        'Sanık Tarık Aksoy’a atılı şantaj ve özel hayatın gizliliğini ihlal suçlarını sanığın işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; adli kontrolün kaldırılmasına; dosyadan gerçek fail yönünden suç duyurusunda bulunulmasına; telefona el koyma tedbiri nedeniyle CMK 141 vd. uyarınca tazminat isteminde bulunabileceğinin sanığa hatırlatılmasına; istinaf yolu açık olmak üzere.',
      reasoning: [
        because('Tehdit mesajları ve iletilen ses kaydı, sanığın telefonundan değil, hesabına bağlı OFIS-LAPTOP-07 masaüstü oturumundan gönderilmiştir.'),
        because('Bu dizüstü eski ortağın zimmetindedir; oturum adresleri onun firmasının iş hattıdır; mesajların dili sanığın değil, tanığınkidir.', flag('contra_o3')),
        because('Ekran görüntüleri hukuka aykırı elde edildiğinden hükme esas alınmamıştır.', flag('ss_excluded')),
        because('Savunma, baştan sona hukuka uygun yollarla yürütülmüştür.', flag('tarik_red')),
        because('Eski ortağın işyerinde el konulan dizüstü, mühür tutanakla açılıp imajı ve hash değeri alınarak korunmuştur (CMK 134/4).', flag('laptop_imaj')),
        because('Bu deliller birlikte değerlendirildiğinde, suçların sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141–142; TCK 107/2, 134/2 (beraat)',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Cihazı, hattı ve dizüstüyü delillerle göster; somut dayanaklı suç duyurusu ver; esas savunmada gerçek faili ortaya koy.',
      epilogue: [
        {
          lines: [
            { speaker: 'narrator', text: '# TÜRK MİLLETİ ADINA |bg=durusma_salonu', style: 'card' },
            { speaker: 'narrator', text: 'Hâkim hükmü okudu. “Beraatine.” Tarık uzun uzun nefes verdi; kurşun kalemini çıkarmadı bile.' },
            { speaker: 'narrator', text: 'Melis koridorda durdu. Tarık’a yaklaşamadı; yaklaşmadı.' },
            { speaker: 'melis', text: 'Neyse. Teşekkür ederim avukat hanım.', expression: 'uzgun' },
            { speaker: 'narrator', text: 'Sonra Sinan’la gittiler. Vakıf ihaleyi yeniden açacakmış; bu kez Tekin Yapı teklif veremeyecek.' },
            { speaker: 'narrator', text: 'Savcılık, Ozan Tekin hakkında soruşturma başlattı.' },
          ],
        },
        W(has('ev_laptop'), `> El konulan 07 numaralı dizüstünün imajı, mühür tutanakla açılarak alınıyor; hash değeri dosyada. Bu kez kimse bir ekranın fotoğrafını çekmeyecek.`),
        W(not(has('ev_laptop')), `> Dizüstü bulunamadı; ama bir hat, bir zimmet ve bir yemin altında susuş, bir soruşturmayı başlatmaya yetti.`),
        {
          lines: [
            { speaker: 'tarik', text: 'Telefonumu emanetten aldım. Bir şey yapacağım, izninizle.' },
            { speaker: 'narrator', text: 'PUSULA’yı açtı. “Bağlı cihazlar.” Listede hâlâ duran bütün oturumları tek tek kapattı. En sonda “OFIS-LAPTOP-07”.' },
            { speaker: 'player', text: 'Ekran karardı. Bu kez kimse yazmıyordu.', style: 'thought' },
          ],
        },
        sozHatirlat,
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(not(flag('cokus')), ref('kaynak_suphesi'), ref('ek_supheler'), finalAtLeast(T_BERAAT)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Şüpheden',
      verdictText:
        'Sanığa atılı suçların sanık tarafından işlendiği her türlü şüpheden uzak, kesin ve inandırıcı delillerle sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; istinaf yolu açık olmak üzere.',
      reasoning: [
        because('Tehdit mesajlarının sanığın telefonundan gönderildiği doğrulanamamış; aksine hesaba bağlı başka bir cihazdan gönderildiği anlaşılmıştır.'),
        because('Ekran görüntüleri hukuka aykırı elde edilmiştir.', flag('ss_excluded')),
        because('9 Kasım gecesi telefonun kilitli olduğu, iletinin başka bir oturumdan çıktığı görülmüştür.', any(flag('bilirkisi_kilit'), flag('kilit_mahkemede'))),
        because('Sanığın fail olduğuna dair kesin kanaate ulaşılamamıştır; şüpheden sanık yararlanır (Anayasa 38/4, AİHS 6/2).'),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach: 'Mesajların telefondan çıkmadığını göster ve en az iki destekleyici şüphe (hukuka aykırı delil, kilit kaydı, üslup) ortaya koy.',
      epilogue: [
        {
          lines: [
            { speaker: 'narrator', text: '# TÜRK MİLLETİ ADINA |bg=durusma_salonu', style: 'card' },
            { speaker: 'narrator', text: 'Hâkim “şüpheden sanık yararlanır” dedi. Beraat. Tokmak indi. Ama bu beraatin tadı eksikti; bir kemeri tamamlayan son taşı yerine koyamamış gibiydim.' },
            { speaker: 'narrator', text: 'Koridorda bir fısıltı dolaştı, belki bir savcı yardımcısından, belki bir izleyiciden: “Kanıtlayamadılar işte.” Kelime, ıslak taş duvarlarda yankılandı.' },
            { speaker: 'tarik', text: 'Kazandık mı?', expression: 'saskin' },
            { speaker: 'player', text: 'Beraat ettiniz Tarık Bey. Sabıkanız olmayacak. Yasak kalktı.' },
            { speaker: 'tarik', text: 'Kızıma ne diyeceğim peki? “Baban yapmadı” mı, yoksa “kanıtlayamadılar” mı? İkisi aynı cümle değil.', expression: 'uzgun' },
          ],
        },
        W(
          all(flag('suc_duyurusu'), not(flag('laptop_kayip'))),
          `
          > Cevap veremedim. Kâğıtlar ismi söylemişti: bir zimmet, bir hat, bir dizüstü. Ama esas savunmada o ismi ben söylemedim; “şüphe” dedim, “kesinlik yok” dedim. Hâkim de benden fazlasını yazamazdı.
          > Ozan Tekin hakkında soruşturma açıldı; el konulan dizüstünün imajı alınıyor. Belki bir gün başka bir salonda, başka bir hâkim o cümleyi kuracak. Bugün kurulmadı.
          > Vakıf ihaleyi askıda tuttu; “soruşturma bitsin” dediler. Tarık’ın teklifi bir rafta bekliyor, adı gibi.
          ~ Elimde bir isim vardı. Onu salona taşımaya cesaret edemedim; şüphenin güvenli odasında kaldım. Bazen avukat da kendi telefonunu kilitli bırakır.
          leyla: Beraat beraattir Deniz. Ama kâğıtların söylediğini sen söylemezsen, o cümle bir başkasının ağzında yarım kalır. Aradaki farkı hiç unutma.
        `,
        ),
        W(
          not(all(flag('suc_duyurusu'), not(flag('laptop_kayip')))),
          `
          > Cevap veremedim. Mesajların başka bir cihazdan çıktığı dosyada yazıyordu, ama o cihazın ucundaki eli bir isme bağlayamamıştık. Ozan Tekin tanık sırasından kalkıp gitmişti.
          > Vakıf ihaleyi bir başka firmaya verdi; “ortalık durulsun” dediler. Tarık’ın teklifi, suçsuzluğuyla birlikte rafa kalktı.
          ~ Bazen adalet bir kapıyı açar, ama ışığı yakmaz. İçeri girersin, ama karanlıkta. Bir yerde, bir ekran hâlâ yanıyordu; kimin elinde, bilmiyordum.
          leyla: Beraat beraattir Deniz. Ama senin yüzünden anlıyorum: bu kez “yapmadı” diyemedin, “yapamadılar” dedin. Aradaki farkı hiç unutma.
        `,
        ),
        sozHatirlat,
      ],
    }),
    outcome('KISMI', {
      class: 'REDUCED',
      priority: 4,
      when: all(not(flag('cokus')), any(flag('terditli'), flag('supheden'), flag('ss_excluded')), finalAtLeast(T_INDIRIM)),
      stamp: 'KISMEN',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '134’ten beraat · 107/2’den HAGB',
      verdictText:
        'Özel hayatın gizliliğini ihlal (TCK 134/2) suçunun sanık tarafından işlendiği sabit olmadığından bu suçtan BERAATİNE; şantaj suçundan (TCK 107/2, 43/1) 1 yıl 3 ay hapis ve adli para cezasıyla cezalandırılmasına, takdiri indirimle (TCK 62) 1 yıl 15 güne indirilmesine, hükmün açıklanmasının geri bırakılmasına (CMK 231); istinaf yolu açık olmak üzere.',
      reasoning: [
        because('Ses kaydının bizzat sanık tarafından iletildiği ispatlanamamış; ifşa suçundan beraat gerekmiştir.'),
        because('Şantaj yönünden lehe değerlendirme ve takdiri indirim uygulanmış; ceza iki yılın altında kaldığından hükmün açıklanması geri bırakılmıştır.'),
      ],
      legalBasis: 'TCK 107/2, 43/1, 62; TCK 134/2 (beraat); CMK 231',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach: 'Ekran görüntülerini düşür ya da kaynağa dair kuşku yarat; tam beraat için delil zincirini tamamla.',
      epilogue: [
        {
          lines: [
            { speaker: 'narrator', text: '# TÜRK MİLLETİ ADINA |bg=durusma_salonu', style: 'card' },
            { speaker: 'narrator', text: 'Hâkim bir suçtan beraat, bir suçtan hükmün açıklanmasının geri bırakılmasına karar verdi. Tarık bir an ne hissedeceğini bilemedi; sevinçle hüzün arasında bir yerde kaldı.' },
            { speaker: 'tarik', text: 'Yani sabıkam olmayacak. Ama bir yıl, denetim altında, başımın üstünde duracak. Bir hata yaparsam açılacak.', expression: 'uzgun' },
            { speaker: 'tarik', text: 'Yarım masumiyet. Mimarlıkta yarım kemer olmaz avukat hanım. Bir kemer ya bütün yükü taşır, ya çöker. Ortası yoktur.' },
            { speaker: 'player', text: 'Bir kuşku yarattık. Ama o kuşkuyu sonuna kadar taşıyamadık. İsmi kâğıtlar söylemeliydi; kâğıtlar yarım kaldı.', style: 'thought' },
            { speaker: 'narrator', text: 'Koridorda Melis bana bakmadan geçti. Haklıydı. Mesajları kimin yazdığı sorusu, salonda cevapsız kaldı; bir ekran, bir yerde, hâlâ yanıyordu belki.' },
            { speaker: 'leyla', text: 'Yarım da olsa bir sonuç Deniz. Ama senin yüzünden anlıyorum: bu çocuğa tam masumiyeti borçluydun. Bir dahakine, sütunu gördüğünde, elini de bul.' },
          ],
        },
        sozHatirlat,
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 6 ay + 1 yıl 3 ay hapis',
      verdictText:
        'Sanığın özel hayatın gizliliğini ihlalden (TCK 134/2) 2 yıl 6 ay, şantajdan (TCK 107/2, 43/1) 1 yıl 3 ay hapis ve adli para cezasıyla cezalandırılmasına, TCK 53’ün uygulanmasına; istinaf yolu açık olmak üzere (CMK 273/1, tebliğden itibaren iki hafta).',
      reasoning: [
        because('Mesajlar ve iletilen ses kaydı sanığa ait hesapta, sanığın telefonunda tespit edilmiş; aksi yönde yeterli delil ortaya konmamıştır.'),
        because('Savunmanın duruşmadaki inandırıcılığı yitirilmiş; heyet iddianamedeki anlatımı esas almıştır.', flag('cokus')),
      ],
      legalBasis: 'TCK 134/2, 107/2, 43/1, 53; CMK 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: mesajların kaynağına dair kuşku yaratılamazsa verilir.',
      epilogue: [
        B(`
          # TÜRK MİLLETİ ADINA |bg=durusma_salonu
          > Hâkim cezayı okudu. Rakamlar salonun içinde soğuk soğuk yankılandı. Tarık ayağa kalkmıştı; oturmayı unuttu, mübaşir koluna girdi.
        `)[0]!,
        W(
          flag('cokus'),
          `
          > Salon boşaldı. Savcı dosyasını toplarken yanımdan geçti, durdu.
          tolga: İyi bir avukat olacaksınız. Bugün değil.
          ~ Haklıydı. Elimdeki kartları birer birer yaktım; salon, en sonunda, beni dinlemeyi bıraktı.
        `,
        ),
        B(`
          > Tarık telefonunu emanetten aldı. Ekranı açtı; arşivlenmiş sohbet hâlâ oradaydı, aynı yerde, aynı “Saygılar.” ile. Kapatmadı. Bakamadı bile.
        `)[0]!,
        W(
          not(has('clue_cihaz3')),
          `~ Bir sütun vardı. Raporun ekinde, kimsenin bakmadığı son sütun. Gönderen cihaz. Ben de bakmadım. Bir insanın hayatı o sütundaydı.`,
        ),
        W(
          has('clue_cihaz3'),
          `~ Sütunu görmüştüm. Cihaz 3. Ama gördüğümü salona taşıyamadım; bir sütun, okunmadıkça yalnızca bir sütundur.`,
        ),
        B(`
          tarik/uzgun: Ece’ye ne diyeceğim avukat hanım? Bana bir cümle verin. Bir tek cümle.
          > Cümlem yoktu. Yağmur yeniden başlamıştı; camdan, bir çocuğun sorusuna benzeyen bir ses geliyordu.
        `)[0]!,
        sozHatirlat,
      ],
    }),
  ],
};
