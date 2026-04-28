import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isMedicoRoute = nextUrl.pathname.startsWith("/medico");

  if (!isLoggedIn && (isAdminRoute || isMedicoRoute)) {
    return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
  }

  if (isLoggedIn && isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/medico", nextUrl));
  }

  if (isLoggedIn && isMedicoRoute && role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
