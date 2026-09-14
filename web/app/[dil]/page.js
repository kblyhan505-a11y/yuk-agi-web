import { ceviri } from "@/lib/i18n";

export default function AnaSayfa({ params }) {
  const t = ceviri(params.dil);
  return (
    <div className="wrap" style={{ padding: "48px 18px" }}>
      <h1>{t("site.ad")}</h1>
      <p className="kucuk">{t("site.slogan")}</p>
      <p style={{ marginTop: 24 }}>
        <a className="btn" href={`/${params.dil}/kayit`}>{t("menu.kayit")}</a>
      </p>
    </div>
  );
}
