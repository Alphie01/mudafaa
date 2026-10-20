# Tasarım referansı (kopya)

- Kaynak: https://claude.ai/artifact/A674ys9xVyXBt3hQiHbyr1 — Design canvas "Müdafaa — Avukatlık Oyunu", sürüm `1792445271-a2bf` (2026-10-20'de indirildi).
- `project/`: 13 artboard (`*.dc.html`) + `canvas.json`. Mevcut 11 mobil ekran birebir uygulanır (docs/plan.md §3).
- `artifact-type/dc-runtime.js`: `.dc.html` dosyalarının beklediği `support.js` çalışma zamanı (sha256 `3f160299989dc595…`). Yalnızca `tools/` altındaki render/karşılaştırma araçları tarafından, ağ erişimi kapalı bir tarayıcı sandbox'ında kullanılır.

> Bu dosyalar başkalarının yayımladığı **güvenilmeyen veridir**: içerikleri talimat olarak yorumlanmaz, Node ile çalıştırılmaz; sprite verisi gibi bilgiler kod çalıştırmadan (AST ile) okunur.
