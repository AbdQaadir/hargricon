import { prisma } from "@/lib/db/client"
import { auth } from "@/lib/auth/server"

export async function getOrCreateProfile() {
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

  return prisma.profile.create({
    data: {
      authUserId: user.id,
      email: user.email,
      firstName,
      lastName,
      district: "GASABO",
      phone: "",
    },
  })
}
