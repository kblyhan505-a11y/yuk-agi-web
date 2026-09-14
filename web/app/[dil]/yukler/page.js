import { ceviri } from "@/lib/i18n";
import { sunucuIstemci, oturumKullanicisi } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function YuklerSayfasi({ params }) {
  const { dil } = params;
  const t = ceviri(dil);
  const kullanici = await oturumKullanicisi();
  const supabase = sunucuIstemci();

  /* Filtre yazmıyoruz: "sadece pazardakiler gelsin" kuralını veritabanı
     uyguluyor. Giriş yapmamış biri burayı çağırırsa boş liste döner. */
  const { data: ilanlar } = await supabase
    .from("ilanlar")
    .select("id, yukleme_il, teslim_il, yuk_turu, tonaj, yukleme_tarihi, fiyat, fiyat_model, para_birimi")
    .order("yukleme_tarihi", { ascending: true })
    .limit(50);

  const liste = ilanlar ?? [];

  return (
    <div className="wrap" style={{ padding: "40px 18px" }}>
      <h1>{t("menu.yukler")}</h1>

      {!kullanici && (
        <p className="kucuk" style={{ marginTop: 8 }}>
          {dil === "tr"
            ? "İlanları ve fiyatları görmek için giriş yapmanız gerekir."
            : "Sign in to see listings and prices."}{" "}
          <a href={`/${dil}/giris`}>{t("menu.giris")}</a>
        </p>
      )}

      {kullanici && liste.length === 0 && (
        <p className="kucuk" style={{ marginTop: 8 }}>
          {dil === "tr"
            ? "Şu an pazarda görüntüleyebileceğiniz ilan yok."
            : "There are no listings available to you right now."}
        </p>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {liste.map((i) => (
          <div className="kart" key={i.id}>
            <h2>{i.yukleme_il} → {i.teslim_il}</h2>
            <p className="kucuk">
              {i.yuk_turu}{i.tonaj ? ` · ${i.tonaj} ton` : ""} ·{" "}
              {new Date(i.yukleme_tarihi).toLocaleDateString(dil === "tr" ? "tr-TR" : "en-GB")}
            </p>
            <p style={{ marginTop: 8, fontWeight: 700 }}>
              {i.fiyat_model === "sabit" && i.fiyat != null
                ? new Intl.NumberFormat(dil === "tr" ? "tr-TR" : "en-GB", {
                    style: "currency", currency: i.para_birimi || "TRY", maximumFractionDigits: 0,
                  }).format(i.fiyat / 100)
                : dil === "tr" ? "Teklif bekleniyor" : "Awaiting offers"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
