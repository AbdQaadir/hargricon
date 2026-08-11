export const ROUTES = {
  home: "/",
  listings: "/listings",
  listing: (id: string) => `/listings/${id}`,
  account: "/account",
  accountProfile: "/account/profile",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const
