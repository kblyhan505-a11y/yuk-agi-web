# Yük Ağı — arayüz (Next.js)

Veritabanı katmanı (`db/` klasörü) kurulduktan sonra çalışır. Bu proje ekranları
üretir; kimin neyi görebileceğine hâlâ veritabanı karar verir.

## Kurulum

1. **Node.js 18 veya üstü** kurulu olsun (`node -v` ile bak).
2. Bu klasörü aç, terminalde:

```bash
npm install
```

3. `.env.example` dosyasını kopyalayıp adını `.env.local` yap. İçindeki iki
   değeri Supabase panelinden al: **Project Settings → API**
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon / public key

   `service_role` anahtarını buraya **yazma**. O anahtar bütün güvenlik
   kurallarını atlar ve tarayıcıya gitmemeli.

4. Çalıştır:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` aç. Otomatik olarak `/tr` adresine gider.

## Supabase tarafında yapılacak iki ayar

**Authentication → URL Configuration**
- Site URL: `http://localhost:3000` (yayına alınca kendi adresin)
- Redirect URLs listesine ekle: `http://localhost:3000/**`

Bu ayar yapılmazsa e-posta doğrulama ve parola sıfırlama bağlantıları çalışmaz.

**Authentication → Providers → Email**
- "Confirm email" açık kalsın. Doğrulanmamış e-postayla hesap açılmasın.

## Dil desteği

Adres yapısı dille başlar: `/tr/panel`, `/en/panel`. Sağ üstteki TR/EN
düğmeleri aynı sayfanın diğer dildeki karşılığına götürür ve tercihi çerezde
saklar.

Metinler kodun içinde değil, `messages/tr.json` ve `messages/en.json`
dosyalarında. Yeni bir yazı eklerken ikisine de eklemen gerekir; birinde
eksikse ekranda anahtarın kendisi görünür (örn. `firma.ad`), böylece unutulan
çeviri sessizce kaybolmaz.

## Şu an çalışan ekranlar

| Adres | Ne yapar |
|---|---|
| `/tr` | Basit karşılama sayfası |
| `/tr/kayit` | Hesap açma, e-posta doğrulama |
| `/tr/giris` | Giriş |
| `/tr/parola` | Parola sıfırlama bağlantısı |
| `/tr/firma/yeni` | Firma kaydı (onay bekler durumunda açılır) |
| `/tr/panel` | Firmalarınız, durum, deneme bitiş tarihi |
| `/tr/yukler` | Pazardaki ilanlar |

## Güvenlik notları

Sorguların hiçbiri "şu firmanın verilerini getir" demiyor. Sadece tabloyu
istiyor; hangi satırların döneceğine veritabanındaki kurallar karar veriyor.
Bu yüzden bir sayfada filtre yazmayı unutmak veri sızıntısına yol açmıyor.

Giriş hatasında "e-posta bulunamadı" veya "parola yanlış" diye ayrı mesaj
göstermiyoruz. İkisinde de aynı cümle çıkıyor — aksi halde sistemde hangi
e-postaların kayıtlı olduğu dışarıdan öğrenilebilirdi.

Firma kaydı yapılırken `durum` ve `dogrulandi` alanları gönderilse bile
veritabanı bunları geçersiz kılıyor. Hiçbir firma kendini onaylayamaz.

## Henüz yok

İlan oluşturma formu, teklif verme, QR üretimi, çalışan daveti, yönetim paneli,
iki aşamalı doğrulama. Sıradaki adımlar bunlar.

**PayTR tamamen pasif.** Bu projede tek satır ödeme kodu yok.

## Test edilmedi

Bu kodu yazdığım ortamda internet yok, `npm install` çalıştıramadım ve projeyi
ayağa kaldıramadım. Yani derleme hatası çıkabilir. Hata alırsan terminaldeki
metnin tamamını bana getir.
