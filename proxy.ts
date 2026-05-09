import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "todo_session";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isNextAsset = request.nextUrl.pathname.startsWith("/_next");
  const isFavicon = request.nextUrl.pathname === "/favicon.ico";

  if (isApiRoute || isNextAsset || isFavicon) {
    return NextResponse.next();
  }

  if (!sessionCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
