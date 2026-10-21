# Dava üretimi: yeniden başlatma sonrası devam

20 Ekim 2026, 23:40. Makinede RAM yetmediği için iş akışları durduruldu. Yarım kalan her iş commit edilip `wip/<slug>` dallarına yedeklendi. Bu dallar GitHub'a da push edildi.

- **Yazım:** 15 davanın hepsi yazıldı.
- **Bulgular:** inceleme bulguları ve tamamlanmış düzeltme sonuçları `review-state.json` dosyasında. Anahtar dava slug'ı; her davada `write`, `review`, `fix` alanları var. Bulgular `review.findings` altında: önem derecesi, konum, sorun, öneri.

| Dava | Dal | Worktree | Aşama | Sonraki adım |
|---|---|---|---|---|
| #01 kayip-cuzdan | wip/kayip-cuzdan | wf_df8a558c-2bf-1 | düzeltme bitti; kontroller yalnızca yük nedeniyle zaman aşımına düştü | kontrolleri boş makinede yeniden çalıştır → birleştir |
| #02 cevrimici-tuzak | wip/cevrimici-tuzak | wf_df8a558c-2bf-2 | düzeltme bitti, kontroller geçti (4 engel vardı) | ikinci inceleme |
| #03 kirmizi-isik | wip/kirmizi-isik | wf_df8a558c-2bf-3 | düzeltme bitti, kontroller geçti (4 engel vardı) | ikinci inceleme |
| #04 beyaz-toz | wip/beyaz-toz | wf_df8a558c-2bf-4 | düzeltme yarım (wip commit) | düzeltmeye devam → ikinci inceleme |
| #05 gece-yarisi-gaspi | wip/gece-yarisi-gaspi | wf_df8a558c-2bf-5 | düzeltme büyük ölçüde commit edilmiş | düzeltmenin bittiğini doğrula → kontroller |
| #06 son-mesaj | wip/son-mesaj | wf_df8a558c-2bf-6 | düzeltme yarım | düzeltmeye devam → ikinci inceleme |
| #07 gece-bekcisinin-sirri | wip/gece-bekcisinin-sirri | wf_66fdb821-71e-5 | düzeltme commit'leri var (v3); 8 engel vardı | düzeltmenin bittiğini doğrula → ikinci inceleme |
| #08 kirik-kadeh | wip/kirik-kadeh | wf_df8a558c-2bf-7 | düzeltme yarım | düzeltmeye devam → ikinci inceleme |
| #09 sahte-imza | wip/sahte-imza | wf_df8a558c-2bf-8 | incelendi, düzeltme başlamadı | düzelt → ikinci inceleme |
| #10 liman-gecesi | wip/liman-gecesi | wf_df8a558c-2bf-9 | düzeltme yarım | düzeltmeye devam |
| #11 belediye-kasasi | wip/belediye-kasasi | wf_df8a558c-2bf-10 | düzeltme yarım | düzeltmeye devam |
| #12 zarf | wip/zarf | wf_df8a558c-2bf-11 | düzeltme yarım | düzeltmeye devam → ikinci inceleme |
| #13 silinen-dosyalar | wip/silinen-dosyalar | wf_1537aeb1-845-5 | yazıldı, inceleme yarım kaldı | incele → düzelt |
| #14 yanik-ev | wip/yanik-ev | wf_1537aeb1-845-6 | düzeltme yarım | düzeltmeye devam → ikinci inceleme |
| #15 son-durusma | wip/son-durusma | wf_ab797cb0-75b-5 | incelendi, düzeltme durumu belirsiz (commit'ler var) | düzeltmeye devam → ikinci inceleme |

Worktree'ler `.claude/worktrees/` altında ve yeniden başlatmadan etkilenmez. Silinmişlerse `git worktree add .claude/worktrees/<ad> wip/<slug>` ile yeniden açılır.

**Kurallar** (`cases-split.js` içindeki STANDARDS ve REVIEW_BRIEF):

- Her engel ve önemli bulgu düzeltilmeli.
- En kısa beraat yolu, tipik yolun hamle sayısının en az %60'ı olmalı.
- `case:validate` PASSED ve `case:duration` 90–120 dk olmalı.
- 3 veya daha fazla engel çıkan davalara ikinci inceleme yapılır.
- Birleştirme hedefi `plan-b`.

**Makine yükü:** Aynı anda en fazla ~6 ajan çalıştır. 12 ajan, doğrulayıcının zaman sınırlarını aşmasına ve RAM'in tükenmesine yol açtı.
