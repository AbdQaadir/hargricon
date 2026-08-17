import { getLearningThreads } from "@/lib/db/learning"
import { requireProfile } from "@/lib/db/profile"
import { LearningNav } from "./learning-nav"

export const dynamic = "force-dynamic"

export default async function LearningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireProfile()
  const threads = await getLearningThreads(profile.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Learning
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask farming questions and get practical, conversational answers.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <LearningNav threads={threads} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
