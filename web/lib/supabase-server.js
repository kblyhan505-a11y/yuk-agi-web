import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* Sunucu tarafı bağlantı. Oturum çerezden okunur; istemciden gelen
   firma kimliğine hiçbir yerde güvenilmez. */
export function sunucuIstemci() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* Sunucu bileşeninden yazma denemesi — middleware zaten tazeliyor */
          }
        },
      },
    }
  );
}

export async function oturumKullanicisi() {
  const supabase = sunucuIstemci();
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}
