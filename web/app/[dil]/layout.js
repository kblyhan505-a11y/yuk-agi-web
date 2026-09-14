import { ceviri, dilGecerli, DILLER } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { oturumKullanicisi } from "@/lib/supabase-server";
import DilSecici from "@/components/DilSecici";
import CikisDugmesi from "@/components/CikisDugmesi";

export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export default async function DilLayout({ children, params }) {
  const { dil } = params;
  if (!dilGecerli(dil)) notFound();

  const t = ceviri(dil);
  const kullanici = await oturumKullanicisi();

  return (
    <html lang={dil}>
      <body>
        <header className="top">
          <div className="wrap">
            <a className="marka" href={`/${dil}`}>{t("site.ad")}</a>
            <nav>
              <a href={`/${dil}/yukler`}>{t("menu.yukler")}</a>
              {kullanici ? (
                <>
                  <a href={`/${dil}/panel`}>{t("menu.panel")}</a>
                  <CikisDugmesi dil={dil} etiket={t("menu.cikis")} />
                </>
              ) : (
                <>
                  <a href={`/${dil}/giris`}>{t("menu.giris")}</a>
                  <a href={`/${dil}/kayit`}>{t("menu.kayit")}</a>
                </>
              )}
              <DilSecici dil={dil} />
            </nav>
          </div>
        </header>

        <div className="bant">
          <div className="wrap">{t("genel.denemeSurumu")}</div>
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
