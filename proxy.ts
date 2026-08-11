import { auth } from "@/lib/auth/server"
import { ROUTES } from "@/lib/routes"

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: ROUTES.signIn,
})

export const config = {
  matcher: [
    // Protected routes requiring authentication. Next requires this to be
    // a static string literal, it can't reference ROUTES.account here.
    // Keep this in sync with ROUTES.account in lib/routes.ts by hand.
    "/account/:path*",
  ],
}
