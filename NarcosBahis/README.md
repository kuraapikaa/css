# NarcosBahis teması — hangi dosya canlıda?

## Canlıda olan iki dosya

| Dosya | Backoffice alanı |
|---|---|
| `narcos-tema-birlesik.css` | Lynon > THIRD-PARTY > **Header Css** |
| `narcos-hepsi-birlesik.js` | Lynon > THIRD-PARTY > **Header Js** |

Yanlarındaki `.png` / `.webp` dosyaları bu ikisinin varlıkları. Yol
gömülü değil: CSS `url("./...")` göreceli kullanıyor, JS ise
`document.currentScript.src`'den çözüyor. Yani üçünü aynı klasörden
sunduğun sürece hangi CDN yolunu seçtiğin fark etmez.

## Backoffice'e ne yazılacak

**Header Css** (tek URL kabul ediyor, script/HTML etiketi değil):

```
https://cdn.jsdelivr.net/gh/kuraapikaa/css@b6e4464/NarcosBahis/narcos-tema-birlesik.css
```

**Header Js**:

```js
(function () {
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/gh/kuraapikaa/css@b6e4464/NarcosBahis/narcos-hepsi-birlesik.js";
  s.async = false;          // defer DEĞİL — aşağıdaki nota bak
  document.head.appendChild(s);
})();
```

`@b6e4464` sabit commit hash'i. Tema güncellendiğinde bu satırdaki hash'i
yeni commit'inkiyle değiştir; `@main` kullanma (jsDelivr değişken ref'leri
uzun süre önbelleklemek zorunda kalıyor).

### `defer` neden yok

Dinamik olarak oluşturulup DOM'a eklenen klasik script'te `defer`
**yok sayılır** — böyle bir script varsayılan olarak `async` davranır.
Önceki kurulum `s.defer = true` yazıyordu ve iki ayrı dosya çekiyordu;
aralarındaki çalışma sırası garanti değildi. Tek dosyaya inince sorun
zaten ortadan kalkıyor, ama `async = false` yine de doğru olan.

## Soy ağacı — neden iki farklı sürüm var

İki depo `6d9854b` commit'inde ayrıldı:

```
                 6d9854b  (18 Tem, ortak ata)
                 /      \
   kuraapikaa/css        Dvppels-dev/narcos-premium-theme
   NarcosBahis/          codex/theme-refactor-v2
   (v1 soyu)             └─ 92da259 "Refactor premium theme runtime"
                            JS 39->68KB, CSS'ten 5499 satır silindi
                            └─ 2721b32 ← canlıdaki tabanın kaynağı
```

`92da259` bir rötuş değil, runtime'ın baştan yazımı. Backoffice o dala
pinlendiği için **v1 soyu artık canlıda değil**:

- `narcos-license-footer.js` — eski soy, canlıda DEĞİL
- `narcos-premium-gold-glass.css` — eski soy, canlıda DEĞİL
- `narcos-premium-background.png` — v1 arka planı; v2 `-v2.webp` ikilisini
  kullanıyor. Referans olsun diye duruyorlar, silinmediler.

v2'nin bize göre fazlası: oyun karesi altyapısı (tam ekran + "oyuna geri
dön" + portre kilidi), mobil bilgi şeridi, mobil kısayol şeridi,
`/narcosturnuva`, alt navbar tek-aktif düzeltmesi, spor rota düzeltmesi,
panelin `narcosbahis.vip/#/...` hedeflerine taşınması.

## v1'den geri taşınan tek şey: Zepcom

Canlı desteğe otomatik kullanıcı adı iletimi (`6908c8a`) v2'de hiç yoktu.
`narcos-hepsi-birlesik.js` içinde geri getirildi — ayrı bir `/api/v1/me`
sondajı açmadan, panel gömmenin zaten çözdüğü kullanıcı adını paylaşarak.
`window.ZepCom.identify({name, userId})`; e-posta bilerek gönderilmiyor.

v1'in geri kalanı port EDİLMEDİ çünkü v2 zaten kapsıyor (doğrulandı):

| v1 düzeltmesi | v2'deki karşılığı |
|---|---|
| `/tr/game/demo` siyah ekran (`ef589dd`) | `isGameRoutePath` `game\|play\|launch` önekini tanıyor, kareyi `data-mj` markörüne bağlı olmadan buluyor |
| Mobil alt bar oyunun altını örtüyor (`6862c4f`) | CSS'te `html.ng-game-embed [data-mj="bottom-nav"]` kuralı |
| Masaüstü nav çakışması (`ae6a4cc`) | `66c3545` kök nedeni düzeltmiş |

**Port edilmeyen tek şey:** profil panelinin siyah-altın rötuşu
(`591102d`). v2 kendi paletini kurmuş, v1 seçicilerinin karşılığı yok.
Palet farkı gözle karşılaştırılmalı.

## Kontrol edilmesi gereken bir şey

Panel kimliği artık `postMessage` ile gidiyor (v1'de `?username=` query
parametresiydi):

```js
iframe.contentWindow.postMessage(
  { tur: "narcos-kullanici", kullaniciAdi: "..." },
  "https://narcosbahis.vip"
);
```

Panel bunu duyduğunda `{ tur: "narcos-panel-hazir" }` ile cevap veriyor
olmalı. `narcosbahis.vip` tarafında bu dinleyici yoksa kullanıcı adı hiç
gitmiyor demektir — panel tarafından teyit edilmeli.

Ayrıca panelin CSP'sinde `frame-ancestors` bu alan adını içermeli, yoksa
tarayıcı iframe'i boş gösteriyor.

## Hareketli oyun kapakları (hover video)

Masaüstünde oyun kartının üzerine gelince kapak yerine kısa, sessiz, dönen
bir video oynar. Eşleme `oyun-videolari.json` dosyasında:

```json
{ "sweet bonanza": "https://cdn.jsdelivr.net/gh/kuraapikaa/css@<hash>/NarcosBahis/video/sweet-bonanza.mp4" }
```

- Anahtar: kartın `<img alt>` değeri, küçük harf (noktalama önemsiz).
- Değer: mp4/webm adresi. Bu depoya `NarcosBahis/video/` altına konabilir
  (jsDelivr dosya başına 20 MB; 3-6 saniyelik 480p döngü ~1-2 MB).
- Eşleşmeyen oyunlarda hiçbir şey olmaz; mobilde kapalı.
- JSON ve videolar da hash'e bağlı: yeni video eklenince hash güncellenir.
