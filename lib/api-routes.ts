export const API_ROUTES = {
  signUp: "/api/sign-up",
  signIn: "/api/sign-in",
  forgotPassword: "/api/forgot-password",
  resetPassword: "/api/reset-password",
  profile: "/api/profile",
  farms: "/api/farms",
  farm: (id: string) => `/api/farms/${id}`,
  listings: "/api/listings",
  listing: (id: string) => `/api/listings/${id}`,
  listingStatus: (id: string) => `/api/listings/${id}/status`,
  priceRecommendation: "/api/ai/price-recommendation",
  buyerMatches: "/api/ai/buyer-matches",
  learningThreads: "/api/ai/learning/threads",
  learningThreadMessages: (id: string) =>
    `/api/ai/learning/threads/${id}/messages`,
  learningMessage: (id: string) => `/api/ai/learning/messages/${id}`,
} as const
