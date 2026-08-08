import { redirect } from "next/navigation"

import { getOrCreateProfile } from "@/lib/db/profile"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { ProfileForm } from "./profile-form"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const profile = await getOrCreateProfile()

  if (!profile) {
    redirect("/auth/sign-in")
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>
            This is what buyers will use to reach you directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
