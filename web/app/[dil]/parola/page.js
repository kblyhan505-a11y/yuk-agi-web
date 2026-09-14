"use client";
import { useState } from "react";
import { tarayiciIstemci } from "@/lib/supabase-client";
import { ceviri } from "@/lib/i18n";

export default function ParolaSayfasi({ params }) {
  const t = ceviri(params.dil);
  const [eposta, setEposta] = useState("");
  const [tamam, setTamam] = useState(false);
  const [bekle, setBekle] = useState(false);

  async function gonder(e) {
    e.preventDefault();
    setBekle(true);
    await tarayiciIstemci().auth.resetPasswordForEmail(eposta, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.dil}/panel`,
    });
    setBekle(false);
    // Adres kayıtlı olsa da olmasa da AYNI mesaj: kimin kayıtlı olduğu sızmasın.
    setTamam(true);
  }

  return (
    <div className="dar">
      <div className="kart">
        <h1>{t("parolaSifirla.baslik")}</h1>
        {tamam ? (
          <div className="basari">{t("parolaSifirla.basarili")}</div>
        ) : (
          <>
            <p className="kucuk" style={{ marginBottom: 18 }}>{t("parolaSifirla.aciklama")}</p>
            <form onSubmit={gonder}>
              <div className="alan">
                <label htmlFor="e">{t("giris.eposta")}</label>
                <input id="e" type="email" required value={eposta}
                  onChange={(ev) => setEposta(ev.target.value)} />
              </div>
              <button className="btn gen" disabled={bekle}>
                {bekle ? t("genel.yukleniyor") : t("parolaSifirla.gonder")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
