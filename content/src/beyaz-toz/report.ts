import { all, chosen, flag, has, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
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
        'Şekerlik arka oda kapısının dibindeydi ve paketleri arka odadakilere benziyordu: kolluğa şekerliğin yerini birinci celsede kabul ettirebilirdin.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_stok',
        'ded_stok',
        'Benzerliği tespite çevirmek bir uzman ister: kriminal raporun ekleri üzerinden alınan bilimsel mütalaa (CMK 67/6) iki paketin arka odadaki stoktan ayrıldığını gösterirdi.',
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
      missedEvidence(
        'h_tedavi',
        'ev_tedavi',
        'Defne’nin getirdiği epikriz ve AMATEM kayıtları kullanıcı profilini kurardı; Kaan’ın yazılı onayıyla.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_kullanici',
        'ded_kullanici',
        'Randevu kartı ile tedavi kayıtları birlikte, odadaki ilaçların bir tedaviye ait olduğunu gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_odaya_girme',
        'clue_odaya_girme',
        'Telefon raporunda B. imzalı “odaya girme sakın” mesajı vardı: arka odanın başka birinin olduğunu Kaan’ın telefonu söylüyordu.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_baris',
        'ded_baris',
        'Mesaj ile kira defteri birlikte, arka odada Barış adında bir kiracının yaşadığını gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_sekerlik_yer',
        'clue_sekerlik',
        'Koridor fotoğrafında şekerlik mutfakta değil, arka oda kapısının dibindeki raftaydı.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_ayni_parti',
        'clue_ayni_parti',
        'Kriminal raporda şekerlikteki iki paketin poşeti ve gramajı arka odadakilere benziyordu; karşılaştırma ise yapılmamıştı.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_olcu',
        'clue_kaan_olcu',
        'Kaan’a ayakkabı numarasını ve ehliyetini sorabilirdin: 41 numara, ehliyet yok.',
        'SORGULAMA',
      ),
      missedEvidence(
        'h_kask_ded',
        'ded_kask',
        'Muhbirin “elinde kask vardı” sözü ile Kaan’ın ölçüleri birlikte, kapıyı açanın Kaan olmadığını gösterirdi.',
        'DELIL_ANALIZI',
      ),
      missedEvidence(
        'h_gps',
        'clue_gps',
        'Kurye şirketinin GPS dökümü baskın sabahı 07.16’da binanın önünde duran ve geri dönen bir motoru gösteriyordu.',
        'ARASTIRMA',
      ),
      missedEvidence(
        'h_kacis',
        'ded_kacis',
        'GPS kaydı ile Nesrin Hanım’ın gördüğü motor birlikte, baskını görüp dönen kuryeyi gösterirdi.',
        'DELIL_ANALIZI',
      ),
      hint(
        'h_tanik_saat',
        not(flag('contra_s4')),
        'Nesrin Hanım imzasının yanına saati yazmıştı: tanık aramanın başında değil, kapı açıldıktan sonra ve tek başına çağrılmıştı (CMK 119/4).',
        'SORGULAMA',
      ),
      hint(
        'h_canta_foto',
        flag('canta_foto'),
        'Fotoğraf delil değildir ve çantayı yerinde korumaz; el koyma savcılığın ve kolluğun işidir (CMK 123, 127). Çanta kayboldu.',
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
        'h_iz_talep',
        all(flag('baris_yakalandi'), not(flag('iz_istendi'))),
        'Barış yakalandı ama terazideki yabancı izin onunla karşılaştırılmasını isteyen olmadı. Delil dilekçesinde ya da birinci celsede somut bir talep yeterdi (CMK 206/1).',
        'USUL_BILGISI',
      ),
      hint(
        'h_kilit_hazirlik',
        all(chosen('Q_KILIT'), not(flag('q_kilit_tam'))),
        'Kaan kürsüde kilidin kimde olduğunu anlatamadı: görüş odasında kilidi onunla hiç konuşmamıştın. Müvekkile bildiğini sormak telkin değildir; hazırlıktır.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_seker_beyan',
        all(has('ded_stok'), not(chosen('Q_SEKER'))),
        'Uzman mütalaası paketlerin arka odanın stoğundan geldiğini gösterdi; ama kavanozdaki izin açıklamasını Kaan duruşmada hiç yapmadı. Görüşmede öğrendiğin bir olgu, sorguda sorulmadıkça dosyaya girmez.',
        'SAVUNMA_STRATEJISI',
      ),
      hint(
        'h_defter_kapsam',
        all(flag('contra_s1'), flag('contra_s2'), not(flag('defter_sunuldu'))),
        'Kapsam dışı aramayı kanıtlamak için odanın kime kiralandığı da kayda geçmeliydi: Nesrin Hanım’ın kira defteri, kendi ağzından, ikinci celsede.',
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
