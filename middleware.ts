import NextAuth from "next-auth"
import authConfig from "./auth.config"

export const config = {
  matcher: ["/(portal.*)", "/"],
};

export default NextAuth(authConfig).auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})