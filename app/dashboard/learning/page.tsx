import { getLearningEntries } from "@/lib/db/learning"
import { requireProfile } from "@/lib/db/profile"
import { LearningChat } from "./learning-chat"

export const dynamic = "force-dynamic"

export default async function LearningPage() {
  const profile = await requireProfile()
  const entries = await getLearningEntries(profile.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Learning
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask farming questions and get practical answers you can revisit
          anytime.
        </p>
      </div>

      <LearningChat initialEntries={entries} />
    </div>
  )
}
