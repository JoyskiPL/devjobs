
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0];
  const pathname = request.nextUrl.pathname;

  if (!hostname) {
    return NextResponse.next();
  }

  if (hostname === "pracodawca.devjobs.localhost") {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname === "/") {
  return NextResponse.rewrite(new URL("/employer-home", request.url));
}

    if (pathname === "/login") {
      return NextResponse.rewrite(new URL("/employer/login", request.url));
    }

    if (pathname === "/register") {
      return NextResponse.rewrite(new URL("/employer/register", request.url));
    }

    return NextResponse.next();
  }

  if (
    (hostname === "devjobs.localhost" ||
      hostname === "admin.devjobs.localhost") &&
    pathname.startsWith("/employer")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (hostname === "admin.devjobs.localhost") {
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

  if (
    pathname === "/login" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/auth" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

  if (hostname === "devjobs.localhost") {
    if (pathname === "/") {
      return NextResponse.next();
    }

    if (pathname === "/praca") {
      return NextResponse.rewrite(new URL("/jobs", request.url));
    }

    if (pathname.startsWith("/praca/")) {
      return NextResponse.rewrite(
        new URL(pathname.replace(/^\/praca/, "/jobs"), request.url),
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
