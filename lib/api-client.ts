import axios from "axios"

export const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
})

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Try again."
) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error
    if (typeof message === "string") {
      return message
    }
  }

  return fallback
}
