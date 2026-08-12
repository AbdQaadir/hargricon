export const API_ROUTES = {
  signUp: "/api/sign-up",
  signIn: "/api/sign-in",
  forgotPassword: "/api/forgot-password",
  resetPassword: "/api/reset-password",
  profile: "/api/profile",
  farms: "/api/farms",
  listings: "/api/listings",
  listing: (id: string) => `/api/listings/${id}`,
  listingStatus: (id: string) => `/api/listings/${id}/status`,
} as const
