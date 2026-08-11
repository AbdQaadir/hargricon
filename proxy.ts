import { auth } from "@/lib/auth/server"
import { ROUTES } from "@/lib/routes"

export default auth.middleware({
  loginUrl: ROUTES.signIn,
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
