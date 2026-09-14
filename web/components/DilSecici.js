"use client";
import { usePathname, useRouter } from "next/navigation";
import { DILLER } from "@/lib/i18n";

export default function DilSecici({ dil }) {
  const yol = usePathname();
  const router = useRouter();

  function degistir(yeni) {
    document.cookie = `dil=${yeni};path=/;max-age=31536000;SameSite=Lax`;
    const parcalar = yol.split("/");
    parcalar[1] = yeni;              // /tr/panel → /en/panel
    router.push(parcalar.join("/") || `/${yeni}`);
    router.refresh();
  }

  return (
    <span style={{ display: "inline-flex", gap: 2, marginLeft: 6 }}>
      {DILLER.map((d) => (
        <button
          key={d}
          onClick={() => degistir(d)}
          aria-current={d === dil ? "true" : undefined}
          style={{
            border: "1px solid var(--line)",
            background: d === dil ? "var(--green-soft)" : "transparent",
            color: d === dil ? "var(--green)" : "var(--muted)",
            borderRadius: 8, padding: "5px 9px", cursor: "pointer",
            font: "inherit", fontSize: ".82rem", fontWeight: 600,
          }}
        >
          {d.toUpperCase()}
        </button>
      ))}
    </span>
  );
}
