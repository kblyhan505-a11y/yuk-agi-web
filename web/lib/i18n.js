import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

export const DILLER = ["tr", "en"];
export const VARSAYILAN_DIL = "tr";

const sozlukler = { tr, en };

export function sozluk(dil) {
  return sozlukler[dil] || sozlukler[VARSAYILAN_DIL];
}

/* t("giris.baslik") şeklinde kullanılır. Anahtar bulunamazsa anahtarın
   kendisini döner — böylece eksik çeviri ekranda görünür, sessizce kaybolmaz. */
export function ceviri(dil) {
  const s = sozluk(dil);
  return function t(yol) {
    return yol.split(".").reduce((o, k) => (o ? o[k] : undefined), s) ?? yol;
  };
}

export function dilGecerli(dil) {
  return DILLER.includes(dil);
}
