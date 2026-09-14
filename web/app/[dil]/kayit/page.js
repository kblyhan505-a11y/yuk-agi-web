"use client";
import { useState } from "react";
import { tarayiciIstemci } from "@/lib/supabase-client";
import { ceviri } from "@/lib/i18n";

export default function KayitSayfasi({ params }) {
  const t = ceviri(params.dil);
  const [form, setForm] = useState({ ad_soyad: "", telefon: "", eposta: "", parola: "" });
  const [hata, setHata] = useState("");
  const [tamam, setTamam] = useState(false);
  const [bekle, setBekle] = useState(false);

  const yaz = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function gonder(e) {
    e.preventDefault();
    setHata(""); setBekle(true);
    const { error } = await tarayiciIstemci().auth.signUp({
      email: form.eposta,
      password: form.parola,
      options: {
        // profiles satırı bu bilgilerle otomatik açılıyor (veritabanı tetiği)
        data: { ad_soyad: form.ad_soyad, telefon: form.telefon, dil: params.dil },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.dil}/panel`,
      },
    });
    setBekle(false);
    if (error) { setHata(error.message); return; }
    setTamam(true);
  }

  if (tamam) return (
    <div className="dar"><div className="kart">
      <h1>{t("kayit.baslik")}</h1>
      <div className="basari">{t("kayit.basarili")}</div>
    </div></div>
  );

  return (
    <div className="dar">
      <div className="kart">
        <h1>{t("kayit.baslik")}</h1>
        <p className="kucuk" style={{ marginBottom: 18 }}>{t("kayit.aciklama")}</p>
        {hata && <div className="uyari">{hata}</div>}
        <form onSubmit={gonder}>
          <div className="alan">
            <label htmlFor="a">{t("kayit.adSoyad")}</label>
            <input id="a" required minLength={2} value={form.ad_soyad} onChange={yaz("ad_soyad")} />
          </div>
          <div className="alan">
            <label htmlFor="tel">{t("kayit.telefon")}</label>
            <input id="tel" inputMode="tel" value={form.telefon} onChange={yaz("telefon")} />
          </div>
          <div className="alan">
            <label htmlFor="e">{t("giris.eposta")}</label>
            <input id="e" type="email" autoComplete="email" required
              value={form.eposta} onChange={yaz("eposta")} />
          </div>
          <div className="alan">
            <label htmlFor="p">{t("giris.parola")}</label>
            <input id="p" type="password" autoComplete="new-password" required minLength={8}
              value={form.parola} onChange={yaz("parola")} />
          </div>
          <button className="btn gen" disabled={bekle}>
            {bekle ? t("genel.yukleniyor") : t("kayit.gonder")}
          </button>
        </form>
        <p className="kucuk" style={{ marginTop: 14 }}>
          {t("kayit.zatenVar")} <a href={`/${params.dil}/giris`}>{t("menu.giris")}</a>
        </p>
      </div>
    </div>
  );
}
