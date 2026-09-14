import { redirect } from "next/navigation";
import { ceviri } from "@/lib/i18n";
import { sunucuIstemci, oturumKullanicisi } from "@/lib/supabase-server";

export default async function PanelSayfasi({ params }) {
  const { dil } = params;
  const t = ceviri(dil);

  const kullanici = await oturumKullanicisi();
  if (!kullanici) redirect(`/${dil}/giris`);

  const supabase = sunucuIstemci();

  /* Sorgu firma kimliği göndermiyor. Hangi firmaların döneceğine
     veritabanındaki RLS karar veriyor — kullanıcı sadece üyesi olduğu
     firmaları görebilir. */
  const { data: uyelikler } = await supabase
    .from("firma_uyelikleri")
    .select("rol, firmalar(id, ad, slug, tur, durum, dogrulandi)")
    .eq("user_id", kullanici.id);

  const liste = uyelikler ?? [];

  if (liste.length === 0) {
    return (
      <div className="wrap" style={{ padding: "40px 18px" }}>
        <div className="kart">
          <h1>{t("panel.firmaYok")}</h1>
          <p className="kucuk" style={{ margin: "8px 0 18px" }}>
            {t("panel.firmaYokAciklama")}
          </p>
          <a className="btn" href={`/${dil}/firma/yeni`}>{t("panel.firmaKur")}</a>
        </div>
      </div>
    );
  }

  const ids = liste.map((u) => u.firmalar?.id).filter(Boolean);
  const { data: abonelikler } = await supabase
    .from("abonelikler")
    .select("firma_id, durum, deneme_bitis")
    .in("firma_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

  const abonelikBul = (id) => (abonelikler ?? []).find((a) => a.firma_id === id);

  return (
    <div className="wrap" style={{ padding: "40px 18px" }}>
      <h1>{t("panel.baslik")}</h1>
      <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
        {liste.map((u) => {
          const f = u.firmalar;
          if (!f) return null;
          const a = abonelikBul(f.id);
          const bekliyor = f.durum !== "onayli";
          return (
            <div className="kart" key={f.id}>
              <h2>{f.ad}</h2>
              <span className={`rozet ${f.dogrulandi ? "" : "bekle"}`}>
                {f.dogrulandi ? t("firma.dogrulanmis") : t("firma.dogrulanmamis")}
              </span>

              {bekliyor && (
                <p className="kucuk" style={{ marginTop: 12 }}>
                  <b>{t("firma.beklemede")}</b><br />
                  {t("firma.beklemedeAciklama")}
                </p>
              )}

              <div style={{ marginTop: 14 }}>
                <div className="satir"><span>{t("panel.rol")}</span><b>{u.rol}</b></div>
                <div className="satir"><span>{t("panel.durum")}</span><b>{f.durum}</b></div>
                {a?.deneme_bitis && (
                  <div className="satir">
                    <span>{t("panel.denemeBitis")}</span>
                    <b>{new Date(a.deneme_bitis).toLocaleDateString(dil === "tr" ? "tr-TR" : "en-GB")}</b>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
