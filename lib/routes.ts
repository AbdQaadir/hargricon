export const ROUTES = {
  home: "/",
  listings: "/listings",
  listing: (id: string) => `/listings/${id}`,
  dashboard: "/dashboard",
  dashboardFarms: "/dashboard/farms",
  dashboardProduces: "/dashboard/produces",
  dashboardProduce: (id: string) => `/dashboard/produces/${id}`,
  dashboardProfile: "/dashboard/profile",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const
