import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/orders", "/products", "/","/product-seller","/service-providers","/revenue","/messages","/customer-service"];
const authRoutes = ["/Signin"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/Signin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/Signin",
    "/product-seller",
    "/service-providers",
    "/revenue",
    "/messages",
    "/customer-service"
  ],
};
