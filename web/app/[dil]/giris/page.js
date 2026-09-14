"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { tarayiciIstemci } from "@/lib/supabase-client";
import { ceviri } from "@/lib/i18n";

export default function GirisSayfasi({ params }) {
  const t = ceviri(params.dil);
  const router = useRouter();
  const [eposta, setEposta] = useState("");
  const [parola, setParola] = useState("");
  const [hata, setHata] = useState("");
  const [bekle, setBekle] = useState(false);

  async function gonder(e) {
    e.preventDefault();
    setHata(""); setBekle(true);
    const { error } = await tarayiciIstemci().auth.signInWithPassword({
      email: eposta, password: parola,
    });
    setBekle(false);
    // Hangi kısmın yanlış olduğunu söylemiyoruz: e-posta var mı yok mu
    // bilgisi sızmasın diye tek ve aynı mesaj gösteriliyor.
    if (error) { setHata(t("giris.hata")); return; }
    router.push(`/${params.dil}/panel`);
    router.refresh();
  }

  return (
    <div className="dar">
      <div className="kart">
        <h1>{t("giris.baslik")}</h1>
        <p className="kucuk" style={{ marginBottom: 18 }}>{t("giris.aciklama")}</p>
        {hata && <div className="uyari">{hata}</div>}
        <form onSubmit={gonder}>
          <div className="alan">
            <label htmlFor="e">{t("giris.eposta")}</label>
            <input id="e" type="email" autoComplete="email" required
              value={eposta} onChange={(ev) => setEposta(ev.target.value)} />
          </div>
          <div className="alan">
            <label htmlFor="p">{t("giris.parola")}</label>
            <input id="p" type="password" autoComplete="current-password" required
              value={parola} onChange={(ev) => setParola(ev.target.value)} />
          </div>
          <button className="btn gen" disabled={bekle}>
            {bekle ? t("genel.yukleniyor") : t("giris.gonder")}
          </button>
        </form>
        <p className="kucuk" style={{ marginTop: 14 }}>
          <a href={`/${params.dil}/parola`}>{t("giris.parolamiUnuttum")}</a>
        </p>
        <p className="kucuk">
          {t("giris.hesabinYok")} <a href={`/${params.dil}/kayit`}>{t("giris.kayitOl")}</a>
        </p>
      </div>
    </div>
  );
}
