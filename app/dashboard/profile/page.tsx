import { requireProfile } from "@/lib/db/profile"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { ProfileForm } from "./profile-form"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const profile = await requireProfile()

  return (
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
  )
}
