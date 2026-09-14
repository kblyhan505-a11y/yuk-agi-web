"use client";
import { useRouter } from "next/navigation";
import { tarayiciIstemci } from "@/lib/supabase-client";

export default function CikisDugmesi({ dil, etiket }) {
  const router = useRouter();
  async function cik() {
    await tarayiciIstemci().auth.signOut();
    router.push(`/${dil}`);
    router.refresh();
  }
  return (
    <button onClick={cik} style={{
      border: 0, background: "transparent", color: "var(--muted)",
      font: "inherit", fontWeight: 500, cursor: "pointer", padding: "7px 10px",
    }}>{etiket}</button>
  );
}
