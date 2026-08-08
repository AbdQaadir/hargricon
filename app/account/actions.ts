"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/client"
import { profileSchema, type ProfileValues } from "@/lib/validations/profile"

export async function updateProfile(values: ProfileValues) {
  const session = await auth.getSession()
  const user = session.data?.user

  if (!user) {
    return { error: "You must be signed in." }
  }

  const parsed = profileSchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const { phone, district, bio } = parsed.data

  await prisma.profile.update({
    where: { authUserId: user.id },
    data: { phone, district, bio: bio || null },
  })

  revalidatePath("/account")

  return { success: true }
}
