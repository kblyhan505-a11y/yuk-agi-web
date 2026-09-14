"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { tarayiciIstemci } from "@/lib/supabase-client";
import { ceviri } from "@/lib/i18n";

function slugYap(ad) {
  const tr = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return ad.toLowerCase()
    .replace(/[çğıöşü]/g, (c) => tr[c])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export default function YeniFirmaSayfasi({ params }) {
  const t = ceviri(params.dil);
  const router = useRouter();
  const [form, setForm] = useState({
    ad: "", tur: "lojistik", vergi_no: "", sehir: "", hakkinda: "",
  });
  const [hata, setHata] = useState("");
  const [bekle, setBekle] = useState(false);

  const yaz = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function gonder(e) {
    e.preventDefault();
    setHata(""); setBekle(true);
    const supabase = tarayiciIstemci();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${params.dil}/giris`); return; }

    /* durum ve dogrulandi alanlarını göndermiyoruz; veritabanı bunları
       'beklemede' ve false olarak zorluyor. Firma kendini onaylayamaz. */
    const { data, error } = await supabase.from("firmalar").insert({
      ad: form.ad,
      slug: `${slugYap(form.ad)}-${Math.random().toString(36).slice(2, 6)}`,
      tur: form.tur,
      vergi_no: form.vergi_no || null,
      sehir: form.sehir || null,
      hakkinda: form.hakkinda || null,
      olusturan: user.id,
      durum: "beklemede",
      dogrulandi: false,
    }).select("id").single();

    if (error) { setHata(error.message); setBekle(false); return; }

    const { error: uyelikHata } = await supabase.from("firma_uyelikleri").insert({
      firma_id: data.id, user_id: user.id, rol: "sahip",
    });
    setBekle(false);
    if (uyelikHata) { setHata(uyelikHata.message); return; }

    router.push(`/${params.dil}/panel`);
    router.refresh();
  }

  return (
    <div className="dar" style={{ maxWidth: 560 }}>
      <div className="kart">
        <h1>{t("firma.yeniBaslik")}</h1>
        <p className="kucuk" style={{ marginBottom: 18 }}>{t("firma.yeniAciklama")}</p>
        {hata && <div className="uyari">{hata}</div>}
        <form onSubmit={gonder}>
          <div className="alan">
            <label htmlFor="ad">{t("firma.ad")}</label>
            <input id="ad" required minLength={2} value={form.ad} onChange={yaz("ad")} />
          </div>
          <div className="alan">
            <label htmlFor="tur">{t("firma.tur")}</label>
            <select id="tur" value={form.tur} onChange={yaz("tur")}>
              <option value="lojistik">{t("firma.lojistik")}</option>
              <option value="yuk_veren">{t("firma.yukVeren")}</option>
              <option value="nakliyeci">{t("firma.nakliyeci")}</option>
            </select>
          </div>
          <div className="alan">
            <label htmlFor="v">{t("firma.vergiNo")}</label>
            <input id="v" inputMode="numeric" pattern="[0-9]{10,11}" value={form.vergi_no}
              onChange={yaz("vergi_no")} />
          </div>
          <div className="alan">
            <label htmlFor="s">{t("firma.sehir")}</label>
            <input id="s" value={form.sehir} onChange={yaz("sehir")} />
          </div>
          <div className="alan">
            <label htmlFor="h">{t("firma.hakkinda")}</label>
            <textarea id="h" value={form.hakkinda} onChange={yaz("hakkinda")} />
          </div>
          <button className="btn gen" disabled={bekle}>
            {bekle ? t("genel.yukleniyor") : t("firma.gonder")}
          </button>
        </form>
      </div>
    </div>
  );
}
