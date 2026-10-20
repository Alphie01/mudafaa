LEGAL CASE SIMULATOR

Flutter + TypeScript + PostgreSQL

Seçim Tabanlı İnteraktif Avukatlık ve Hukuk Simülasyonu

1. PROJENİN AMACI

Flutter, TypeScript ve PostgreSQL kullanarak avukatlar, hukuk fakültesi öğrencileri, stajyer avukatlar ve hukuk meraklıları için hikâye ve seçim tabanlı bir hukuk simülasyonu oyunu geliştir.

Bu uygulama, kullanıcıların avukat rolünü üstlenerek farklı davaları çözmesini, olay yerlerini incelemesini, tanıklarla görüşmesini, delilleri toplamasını, hukuki kararlar vermesini ve mahkeme süreçlerini yönetmesini sağlayacak.

Oyun, interaktif bir hikâye ve karar verme sistemi üzerine kurulacak.

Oyuncular önceden oluşturulmuş dava senaryoları üzerinden ilerleyecek.

Her senaryoda:

* Karakterler
* Diyaloglar
* Olay yerleri
* Deliller
* Karar noktaları
* Seçenekler
* Puanlar
* Hikâye dallanmaları
* Alternatif sonuçlar

önceden tanımlanmış olacak.

ÇOK ÖNEMLİ: OYUN SIRASINDA LLM KULLANILMAYACAK.

Oyuncunun verdiği cevaplar yapay zekâya gönderilmeyecek.

Karakterlerle serbest metin üzerinden konuşulmayacak.

Oyuncu yalnızca sistem tarafından sunulan seçenekleri kullanarak ilerleyecek.

Bütün oyun mantığı backend içerisinde çalışan deterministik bir oyun motoruyla yönetilecek.

Yapay zekâ yalnızca yönetim tarafında yeni dava ve hikâye üretmek amacıyla kullanılabilir.

Üretilen içerikler doğrulandıktan sonra PostgreSQL üzerinde saklanacak ve oyunculara hazır senaryolar olarak sunulacak.

⸻

2. TASARIM REFERANSI VE TASARIMA SADAKAT

Tasarım referansı:

https://claude.ai/artifact/A674ys9xVyXBt3hQiHbyr1#page-dcb81aee8d83

Bu tasarım projenin ana tasarım sistemidir.

Geliştirmeye başlamadan önce referans tasarımı incele.

Mevcut tasarımda bulunan bütün ekranları, bileşenleri, animasyonları ve navigasyon yapısını analiz et.

Kesin Tasarım Kuralları

1. Mevcut ana ekran tasarımlarını değiştirme.
2. Renk paletini koru.
3. Tipografiyi koru.
4. Kart yapılarını koru.
5. Buton tasarımlarını koru.
6. Navigasyon yapısını koru.
7. Animasyon karakterini koru.
8. Mevcut ekranları yeniden tasarlama.
9. Eksik özellikler için yeni sayfalar oluştur.
10. Yeni sayfaları mevcut tasarım diliyle tamamen uyumlu geliştir.

Referans tasarıma erişilemiyorsa bunu bildir; tasarımın görülmeyen özelliklerini tahmin ederek uygulama.

Flutter üzerinde mobil öncelikli responsive tasarım geliştir.

Uygulama Android, iOS ve Web platformlarını desteklemelidir.

⸻

3. TEKNOLOJİ MİMARİSİ

Frontend

* Flutter
* Dart
* Riverpod
* GoRouter
* Dio
* Freezed
* JSON Serialization
* Flutter Secure Storage

Frontend yalnızca backend tarafından sağlanan oyun verilerini işleyecek.

Flutter içerisinde hikâyeler, diyaloglar, deliller veya karar sonuçları hardcoded olmayacak.

Backend

* Node.js
* TypeScript
* NestJS
* PostgreSQL
* Prisma ORM
* Redis
* BullMQ
* REST API
* JWT Authentication
* Docker

Backend bütün oyun mantığından sorumlu olacak.

Backend içerisinde:

* Case Management
* Story Management
* Dialogue Management
* Decision Engine
* Evidence Engine
* Investigation Engine
* Courtroom Engine
* Scoring Engine
* Progression Engine
* Content Generation
* Admin Management

modülleri bulunacak.

⸻

4. OYUNUN GENEL ÇALIŞMA MANTIĞI

Oyuncu uygulamaya giriş yaptıktan sonra ana ekrandan bir dava seçecek.

Her dava bağımsız bir hikâye içerecek.

Örnek:

Dava: Kayıp Tanık

Kategori: Ceza Hukuku

Zorluk: Orta

Tahmini Süre: 30 dakika

Açıklama:

Bir iş insanı ofisinde ölü bulunmuştur. Olaydan önce maktulle tartışan kişi cinayetle suçlanmaktadır.

Oyuncu sanığın müdafii olarak görevlendirilir.

Dava başladıktan sonra oyuncuya olayla ilgili ilk bilgiler gösterilir.

Ardından oyuncuya seçenekler sunulur.

Örnek:

Müvekkilinize ilk olarak ne sormak istersiniz?

A) Olay günü nerede olduğunu sor.

B) Maktulle ilişkisini sor.

C) Tartışmanın nedenini sor.

D) Olayla ilgili elinde delil olup olmadığını sor.

Oyuncunun seçimine göre önceden tanımlanmış diyalog gösterilir.

Her seçenek farklı bir bilgi açabilir.

Bazı seçenekler yeni karar noktalarına götürebilir.

Bazıları oyuncuya puan kazandırabilir.

Bazıları ise yanlış strateji nedeniyle puan kaybettirebilir.

Bütün cevaplar ve sonuçlar veritabanında önceden tanımlanmış olacak.

⸻

5. DAVA VE HİKÂYE MOTORU

Backend içerisinde dinamik veri yapısına sahip bir Story Engine geliştir.

Bu motor yeni hikâyelerin sisteme eklenmesini ve mevcut hikâyelerin seçimlerle ilerlemesini sağlayacak.

Hikâyeler kod içerisine yazılmayacak.

Tamamen PostgreSQL üzerinde saklanacak.

5.1. Story Graph

Her hikâye birbirine bağlı node’lardan oluşmalıdır.

Örnek node türleri:

* STORY
* DIALOGUE
* CHOICE
* SCENE
* INVESTIGATION
* EVIDENCE
* DOCUMENT
* COURTROOM
* DECISION
* RESULT

Her node’un benzersiz ID’si bulunmalıdır.

Node’lar birbirlerine bağlanabilmelidir.

Örneğin:

START
→ CLIENT_INTERVIEW
→ FIRST_DECISION
→ CRIME_SCENE
→ EVIDENCE_ANALYSIS
→ WITNESS_INTERVIEW
→ COURTROOM
→ VERDICT

Ancak hikâye yalnızca doğrusal ilerlememelidir.

Seçimlere göre farklı node’lara geçiş yapılabilmelidir.

5.2. Branching System

Her seçim farklı bir hikâye dalına yönlendirebilir.

Örnek:

Oyuncu tanığa doğru soruyu sorarsa yeni bir delil açılır.

Yanlış soruyu sorarsa tanık görüşmesi sona erebilir.

Bir delili keşfederse yeni bir olay yeri açılabilir.

Belirli bir puanın altındaysa bazı savunma seçenekleri kullanılamayabilir.

Bütün bu koşullar backend tarafından değerlendirilmelidir.

5.3. Conditional Nodes

Node’ların açılma koşulları bulunmalıdır.

Örnek:

Bir karakterle görüşebilmek için belirli bir delilin keşfedilmiş olması gerekebilir.

Bir mahkeme itirazı seçeneğinin açılması için ilgili hukuki bilginin edinilmiş olması gerekebilir.

Koşullar veri tabanında saklanmalıdır.

5.4. Story Variables

Oyun oturumuna özel değişkenler bulunmalıdır.

Örnek:

* trust_client
* evidence_score
* legal_score
* investigation_progress
* witness_cooperation
* courtroom_score

Bu değişkenler oyuncunun seçimleriyle değişebilir.

Değişkenler hikâyenin hangi yönde ilerleyeceğini belirleyebilir.

Değişkenler oyuncuya özel tutulmalıdır.

⸻

6. SEÇİM VE KARAR MOTORU

Decision Engine geliştir.

Bu motor oyuncunun seçtiği seçenekleri işleyecek.

Her seçeneğin önceden tanımlanmış etkileri bulunmalıdır.

Örnek veri modeli:

Choice:

* id
* node_id
* title
* description
* next_node_id
* score_effect
* variable_effects
* unlock_conditions
* consequences

Oyuncu bir seçim yaptığında:

1. Backend mevcut node’u kontrol eder.
2. Seçeneğin geçerli olup olmadığını doğrular.
3. Seçimin etkilerini uygular.
4. Oyuncunun puanını günceller.
5. Gerekli değişkenleri değiştirir.
6. Yeni delilleri veya karakterleri açar.
7. Sonraki node’u belirler.
8. Güncel oyun durumunu PostgreSQL’e kaydeder.
9. Flutter’a yeni ekran verilerini gönderir.

Bu işlemlerin hiçbirinde LLM çağrısı yapılmayacak.

Seçim işlemleri transaction içerisinde gerçekleştirilmelidir.

Aynı seçim isteği tekrar gönderildiğinde puan veya ödüller ikinci kez uygulanmamalıdır.

⸻

7. KARAKTER VE DİYALOG SİSTEMİ

Oyunda farklı karakterler bulunacak.

Örneğin:

* Müvekkil
* Sanık
* Mağdur
* Tanık
* Savcı
* Hâkim
* Polis
* Bilirkişi

Her karakterin profil bilgileri ve hikâyedeki rolü veritabanında saklanacak.

Diyalog Sistemi

Karakterlerle konuşmalar tamamen seçim tabanlı olacak.

Örnek:

Tanık:

“Olay gecesi ofisten saat 22.00 civarında ayrıldım.”

Oyuncunun seçenekleri:

A) “Ofisten ayrıldığınızı gören biri var mı?”

B) “O saatte neden ofisteydiniz?”

C) “Maktulle son görüşmeniz nasıldı?”

D) “İfadenizde bir çelişki olduğunu düşünüyorum.”

Her seçeneğin farklı bir cevabı olabilir.

Diyaloglar önceden hazırlanmış olacak.

Karakterler oyuncunun önceki seçimlerine göre farklı cevaplar verebilir.

Ancak bütün olası cevaplar ve dallanmalar önceden tanımlanmış olmalıdır.

⸻

8. OLAY YERİ İNCELEME

Oyuncu davalara ait olay yerlerini görsel olarak inceleyebilmelidir.

Olay yerleri backend içerisinde kayıtlı olacak.

Her olay yerinin görseli ve etkileşimli nesneleri bulunmalıdır.

8.1. Scene System

Örnek olay yerleri:

* Ofis
* Ev
* Sokak
* Otopark
* Araç
* Fabrika
* Depo
* Restoran

Her olay yeri aşağıdaki bilgileri içermelidir:

* Scene ID
* Case ID
* Görsel
* Açıklama
* Etkileşimli nesneler
* Gizli deliller
* Açılma koşulları

8.2. Hotspot Sistemi

Oyuncu olay yeri görselindeki nesnelere dokunabilmelidir.

Örneğin:

* Telefon
* Bilgisayar
* Kan lekesi
* Kamera
* Kapı
* Pencere
* Belge
* Silah

Bir nesneye dokunulduğunda inceleme ekranı açılmalıdır.

Örnek:

Nesne: Masa Üzerindeki Telefon

A) Telefonun dış görünüşünü incele.

B) Telefonu delil olarak kaydet.

C) Telefonun kayıtlarını incelemek için gerekli işlemleri değerlendir.

D) İncelemeyi sonlandır.

Seçeneklerin sonuçları backend üzerinde tanımlanmış olacak.

8.3. Delil Keşfi

Bazı nesneler delil içerebilir.

Ancak bütün nesneler delil olmak zorunda değildir.

Oyuncu yanlış nesneleri inceleyerek zaman kaybedebilir.

Bazı deliller yalnızca belirli seçimler sonucunda açılabilir.

Olay yerleri ve nesneler tamamen backend tarafından yönetilmelidir.

⸻

9. DELİL YÖNETİMİ

Oyuncunun bulduğu deliller dava dosyasına eklenmelidir.

Delil türleri:

* Fiziksel delil
* Dijital delil
* Tanık ifadesi
* Kamera kaydı
* Telefon kaydı
* Adli rapor
* Belge
* Fotoğraf

Her delilin:

* ID
* Ad
* Açıklama
* Tür
* Görsel veya dosya
* Bulunma koşulu
* Hukuki geçerliliği
* İlgili karakterler
* İlgili olaylar

bulunmalıdır.

Delil İnceleme

Oyuncu delili açtığında farklı seçenekler sunulabilir.

Örneğin:

Delil: Güvenlik Kamerası Kaydı

A) Görüntüdeki kişiyi incele.

B) Görüntünün zaman bilgisini kontrol et.

C) Görüntüyü tanık ifadesiyle karşılaştır.

D) Delili savunma dosyasına ekle.

Her seçeneğin önceden tanımlanmış sonucu olmalıdır.

⸻

10. MAHKEME SİMÜLASYONU

Mahkeme aşaması tamamen seçim tabanlı çalışmalıdır.

Oyuncu mahkeme salonunda kendisine sunulan hukuki seçenekleri değerlendirecek.

Örnek:

Savcı bir delil sunar.

Oyuncuya seçenekler gösterilir:

A) Delilin hukuka aykırı elde edildiğini ileri sür.

B) Delilin güvenilirliğine itiraz et.

C) Delilin olayla ilgisiz olduğunu savun.

D) İtiraz etme.

Her seçimin puan etkisi ve hukuki sonucu önceden belirlenmiş olacaktır.

10.1. Mahkeme Aşamaları

* Duruşmanın açılması
* İddianamenin değerlendirilmesi
* Sanık savunması
* Tanıkların dinlenmesi
* Delillerin tartışılması
* Savcılık görüşü
* Savunma
* Karar

Bu aşamalar ilgili dava türüne ve hukuki usule göre yapılandırılmalıdır.

10.2. Mahkeme Karar Motoru

Mahkeme sonucu, oyuncunun seçimleri ve dava senaryosunun önceden tanımlanmış karar kuralları üzerinden belirlenmelidir.

Örneğin:

Belirli deliller bulunmuşsa ve doğru savunma stratejisi uygulanmışsa beraat sonucu açılabilir.

Oyuncu kritik delilleri kaçırmışsa farklı sonuç ortaya çıkabilir.

Her dava birden fazla olası sonuca sahip olabilir.

Örnek:

* Beraat
* Mahkûmiyet
* Daha düşük ceza
* Farklı hukuki nitelendirme

Sonuçların hukuki gerekçeleri önceden hazırlanmış olmalıdır.

⸻

11. PUANLAMA SİSTEMİ

Her oyuncu seçimi puanlama sistemini etkileyebilmelidir.

Ancak bütün seçimlerin puan vermesi zorunlu değildir.

Puan kategorileri:

* Hukuki bilgi
* Delil analizi
* Araştırma becerisi
* Sorgulama
* Savunma stratejisi
* Usul bilgisi

Örnek:

Doğru delili keşfetmek: +10

Tanık ifadesindeki çelişkiyi tespit etmek: +15

Yanlış hukuki itiraz: -5

Kritik delili gözden kaçırmak: -10

Puanlar dava bazında yapılandırılabilir olmalıdır.

Dava Sonu Raporu

Oyuncuya:

* Toplam skor
* Dava sonucu
* Doğru seçimler
* Yanlış seçimler
* Kaçırılan deliller
* Alternatif yollar
* Geliştirilmesi gereken beceriler

gösterilmelidir.

Bu değerlendirme de önceden tanımlanmış kurallar üzerinden oluşturulmalıdır.

Dava sonunda LLM çağrısı yapılmamalıdır.

⸻

12. AI İLE YENİ DAVA OLUŞTURMA

Yapay zekâ yalnızca backend tarafındaki içerik üretim sisteminde kullanılabilir.

Oyuncu oyun oynarken yapay zekâyla iletişim kurmayacaktır.

12.1. AI Case Generator

Yönetici yeni bir dava oluşturmak istediğinde AI kullanılabilir.

Örneğin yönetici:

“Orta zorlukta, 30 dakikalık bir cinayet davası oluştur.”

talimatını verir.

AI aşağıdaki içerikleri üretmelidir:

* Dava hikâyesi
* Karakterler
* Olay kronolojisi
* Deliller
* Olay yerleri
* Diyaloglar
* Seçenekler
* Hikâye dallanmaları
* Puan etkileri
* Alternatif sonuçlar
* Hukuki açıklamalar

12.2. Yapısal Üretim

AI çıktısı serbest metin olarak bırakılmamalıdır.

Yapısal JSON verisi üretilmelidir.

Örnek:

{
“case”: {
“title”: “Kayıp Tanık”,
“category”: “criminal”,
“difficulty”: “medium”
},
“nodes”: [
{
“id”: “start”,
“type”: “dialogue”,
“character”: “client”,
“text”: “Ben suçsuzum.”,
“choices”: [
{
“id”: “choice_1”,
“text”: “Olay günü neredeydiniz?”,
“nextNode”: “alibi_dialogue”,
“score”: 5
}
]
}
]
}

Bu örnek yalnızca veri yapısını göstermektedir.

Gerçek üretim şeması çok daha kapsamlı olmalıdır.

12.3. AI İçerik Doğrulama

Üretilen dava yayınlanmadan önce kontrol edilmelidir.

* Bütün node bağlantıları geçerli mi?
* Eksik diyalog var mı?
* Ulaşılamayan hikâye bölümü var mı?
* Sonuca ulaşmak mümkün mü?
* Puanlar doğru hesaplanıyor mu?
* Karakterler tutarlı mı?
* Deliller mantıklı mı?
* Hukuki bilgiler doğru mu?
* Oyuncunun seçimleri anlamlı sonuçlar oluşturuyor mu?

Eksik veya hatalı içerikler yayınlanmamalıdır.

12.4. İçerik Yayınlama

AI tarafından üretilen dava önce taslak olarak kaydedilmelidir.

Yönetici inceleyip onayladıktan sonra yayınlanmalıdır.

Yayınlanan davalar normal PostgreSQL verisi olarak çalışmalıdır.

Oyuncu davayı oynarken AI üretim servisi hiçbir şekilde çağrılmamalıdır.

⸻

13. ADMIN PANEL

Backend için kapsamlı bir yönetim paneli geliştir.

Yönetici:

* Dava oluşturabilmeli
* Dava düzenleyebilmeli
* Hikâye node’ları ekleyebilmeli
* Diyalog yazabilmeli
* Seçenek oluşturabilmeli
* Puan belirleyebilmeli
* Karakter oluşturabilmeli
* Olay yeri ekleyebilmeli
* Görsel yükleyebilmeli
* Hotspot tanımlayabilmeli
* Delil ekleyebilmeli
* Alternatif sonuç oluşturabilmeli
* AI ile dava üretebilmeli
* Davaları test edebilmeli
* Davaları yayınlayabilmeli

Görsel Hikâye Editörü

Admin panel içerisinde node-based bir hikâye editörü geliştir.

Yönetici hikâye akışını görsel olarak düzenleyebilmeli.

Örneğin:

START
→ Müvekkil Görüşmesi
→ İlk Seçim
→ Olay Yeri
→ Tanık Görüşmesi
→ Mahkeme
→ Sonuç

Node’lar arasında bağlantılar kurulabilmelidir.

Her bağlantıya koşullar eklenebilmelidir.

Bu sayede yeni dava eklemek için kod değiştirmek gerekmemelidir.

⸻

14. VERİTABANI MİMARİSİ

PostgreSQL üzerinde aşağıdaki temel tabloları oluştur.

Kullanıcılar

* users
* user_profiles
* user_progress
* user_statistics

Davalar

* cases
* case_versions
* case_categories
* case_difficulties

Hikâyeler

* story_nodes
* story_choices
* story_conditions
* story_effects
* story_variables
* story_transitions

Karakterler

* characters
* character_dialogues
* character_relationships

Olay Yerleri

* scenes
* scene_assets
* scene_objects
* scene_hotspots

Deliller

* evidence
* evidence_relationships
* evidence_discovery_conditions

Mahkeme

* court_sessions
* court_stages
* court_choices
* court_outcomes

Oyun Oturumları

* game_sessions
* session_states
* session_choices
* session_variables
* discovered_evidence
* session_scores
* session_events

İçerik Yönetimi

* content_generation_jobs
* content_versions
* content_validation_results
* admin_audit_logs

İlişkileri Prisma üzerinden oluştur.

Hikâye içeriği ile oyuncunun oyun durumu birbirinden ayrılmalıdır.

Bir oyuncunun seçimleri başka bir oyuncunun oyununu etkilememelidir.

⸻

15. API YAPISI

REST API kullanılmalıdır.

Örnek:

GET /cases

GET /cases/:id

POST /cases/:id/start

GET /sessions/:id

GET /sessions/:id/current-node

POST /sessions/:id/choose

GET /sessions/:id/evidence

GET /sessions/:id/scenes

GET /sessions/:id/score

GET /sessions/:id/result

POST /admin/cases

POST /admin/cases/generate

POST /admin/cases/:id/validate

POST /admin/cases/:id/publish

Flutter yalnızca bu API’lerle haberleşmelidir.

Oyun ilerleme mantığı backend üzerinde bulunmalıdır.

⸻

16. OYUN İLERLEME VE KAYIT SİSTEMİ

Oyuncunun bütün seçimleri PostgreSQL üzerinde kaydedilmelidir.

Oyuncu oyundan çıktığında ilerlemesi kaybolmamalıdır.

Tekrar giriş yaptığında kaldığı node’dan devam etmelidir.

Her oyun oturumu bağımsız olmalıdır.

Oyuncu aynı davayı tekrar oynayabilmelidir.

Tekrar oynandığında yeni bir session oluşturulmalıdır.

Oyuncu farklı seçimler yaparak farklı sonuçları keşfedebilmelidir.

⸻

17. GÜVENLİK

Bütün seçimler backend tarafından doğrulanmalıdır.

Frontend’den gelen puan veya sonuç bilgilerine güvenilmemelidir.

Oyuncu:

* Kilitli node’lara erişememeli
* Henüz bulmadığı delilleri görememeli
* Skorları değiştirememeli
* Sonuçları manipüle edememeli
* Başka oyuncunun oturumuna erişememeli

Seçimler transaction içerisinde işlenmelidir.

Aynı isteğin tekrar gönderilmesi çift puan kazandırmamalıdır.

⸻

18. TEST SİSTEMİ

Oyun motoru kapsamlı biçimde test edilmelidir.

Özellikle:

* Node geçişleri
* Seçim koşulları
* Puan hesaplamaları
* Delil keşfi
* Kilitli içerikler
* Alternatif sonuçlar
* Kayıt sistemi
* Tekrar oynama
* Hatalı node bağlantıları
* Döngüsel hikâye yapıları
* Ulaşılamayan sonuçlar

test edilmelidir.

Her yayınlanan dava için otomatik hikâye doğrulama çalıştırılmalıdır.

⸻

19. GELİŞTİRME PLANI

Aşama 1 — Tasarım ve Mimari

Mevcut tasarımı incele.

Flutter ekranlarını belirle.

Backend veri modellerini oluştur.

Hikâye motorunu tasarla.

Aşama 2 — Temel Sistem

Authentication, kullanıcı profili, dava listesi ve dava detaylarını geliştir.

Aşama 3 — Story Engine

Node, choice, condition ve effect sistemlerini oluştur.

Seçimlerin backend üzerinde işlenmesini sağla.

Aşama 4 — Araştırma

Olay yeri, hotspot, delil ve karakter diyalog sistemlerini geliştir.

Aşama 5 — Mahkeme

Mahkeme aşamalarını, savunma seçeneklerini ve karar motorunu geliştir.

Aşama 6 — Skor ve Sonuçlar

Puanlama, performans raporu ve kullanıcı ilerlemesini tamamla.

Aşama 7 — Admin Panel

Görsel hikâye editörü ve içerik yönetimini geliştir.

Aşama 8 — AI İçerik Üretimi

Backend üzerinde AI ile yeni dava üretimini ekle.

Aşama 9 — Test ve Optimizasyon

Bütün sistemleri uçtan uca test et.

⸻

20. KESİN KURALLAR

1. Oyun sırasında LLM kullanılmayacak.
2. Oyuncular yalnızca önceden tanımlanmış seçeneklerden ilerleyecek.
3. Bütün hikâyeler backend üzerinde saklanacak.
4. Flutter içerisinde hikâye mantığı bulunmayacak.
5. Karakter diyalogları önceden hazırlanmış olacak.
6. Olay yerleri ve hotspot’lar backend tarafından yönetilecek.
7. Seçimlerin sonuçları önceden tanımlanacak.
8. Puanlama deterministik olacak.
9. Mahkeme kararları tanımlı kurallarla belirlenecek.
10. AI yalnızca yeni içerik üretimi için backend tarafında kullanılabilecek.
11. Yeni dava eklemek için kod değişikliği gerekmeyecek.
12. Mevcut ana ekran tasarımları korunacak.
13. Yeni sayfalar aynı tasarım diliyle oluşturulacak.
14. Sistem mobil öncelikli geliştirilecek.
15. Bütün oyun verileri PostgreSQL üzerinde saklanacak.
16. Her oyuncunun ilerlemesi bağımsız olacak.
17. Davalar birden fazla alternatif sonuca sahip olabilecek.
18. Sistem farklı hukuk kategorileriyle genişletilebilecek.
19. Oyun mekanikleri AI servislerinden tamamen bağımsız çalışacak.
20. Gerçek bir kullanıcı baştan sona bir davayı oynayıp tamamlayabilecek.

⸻

21. SON HEDEF

Hedefimiz, avukatların ve hukuk öğrencilerinin gerçekçi dava senaryoları üzerinden kendilerini geliştirebileceği, görsel açıdan güçlü ve seçim tabanlı bir hukuk simülasyonu oluşturmaktır.

Oyuncu bir dava dosyasını açacak.

Müvekkiliyle görüşecek.

Soracağı soruları seçeneklerden seçecek.

Olay yerini inceleyecek.

Delilleri keşfedecek.

Tanık ifadelerindeki çelişkileri bulacak.

Savunma stratejisini belirleyecek.

Mahkeme salonunda hukuki kararlar verecek.

Ve bütün seçimlerinin sonucunda davanın nasıl sonuçlandığını görecek.

Oyun deneyimi tamamen önceden hazırlanmış hikâyeler ve deterministik seçim motoru üzerinden çalışacak.

AI yalnızca yeni içerik oluşturulmasına yardımcı olacak.

Mevcut ana ekran tasarımlarına sadık kal. Yeni özellikler için gereken ekranları aynı tasarım dilinde geliştir.

Önce bütün mimariyi ve veri modelini analiz et, ardından çalışan sistemi aşamalı olarak oluştur.

İlk hedef, baştan sona oynanabilen, farklı seçimlerle farklı sonuçlara ulaşılabilen eksiksiz bir dava oluşturmaktır.
