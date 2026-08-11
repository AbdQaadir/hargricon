import { cache } from "react"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/db/client"
import { auth } from "@/lib/auth/server"
import { ROUTES } from "@/lib/routes"

// Cached per-request: the dashboard layout and each page it renders all
// need the profile, and without this every one of them would hit the DB
// separately (and race each other on first create, see the P2002 handling
// below).
export const getOrCreateProfile = cache(async function getOrCreateProfile() {
  const session = await auth.getSession()
  const user = session.data?.user

  if (!user) {
    return null
  }

  const existing = await prisma.profile.findUnique({
    where: { authUserId: user.id },
  })

  if (existing) {
    return existing
  }

  const [firstName, ...rest] = user.name?.trim().split(/\s+/) ?? ["Farmer"]
  const lastName = rest.length > 0 ? rest.join(" ") : null

  try {
    return await prisma.profile.create({
      data: {
        authUserId: user.id,
        email: user.email,
        firstName,
        lastName,
        district: "GASABO",
        phone: "",
      },
    })
  } catch (error) {
    // Two concurrent requests for a brand-new user (e.g. two tabs) can both
    // miss the findUnique above and race to create the same profile.
    // Whichever loses the race just reads back what the winner created.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const profile = await prisma.profile.findUnique({
        where: { authUserId: user.id },
      })
      if (profile) {
        return profile
      }
    }
    throw error
  }
})

// For server components that require an authenticated profile: redirects
// instead of forcing every caller to null-check and redirect itself.
export async function requireProfile() {
  const profile = await getOrCreateProfile()

  if (!profile) {
    redirect(ROUTES.signIn)
  }

  return profile
}
