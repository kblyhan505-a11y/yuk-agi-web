import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DILLER, VARSAYILAN_DIL } from "@/lib/i18n";

/* İki iş yapar:
   1. Adreste dil yoksa (/panel), kullanıcının diline yönlendirir (/tr/panel).
   2. Supabase oturum çerezini tazeler, aksi halde oturum sessizce düşer.     */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const dilVar = DILLER.some(
    (d) => pathname === `/${d}` || pathname.startsWith(`/${d}/`)
  );

  if (!dilVar) {
    const tercih = request.cookies.get("dil")?.value;
    const tarayici = request.headers
      .get("accept-language")
      ?.split(",")[0]
      ?.slice(0, 2);
    const dil = DILLER.includes(tercih)
      ? tercih
      : DILLER.includes(tarayici)
      ? tarayici
      : VARSAYILAN_DIL;

    const url = request.nextUrl.clone();
    url.pathname = `/${dil}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
