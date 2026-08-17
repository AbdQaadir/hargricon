import { notFound } from "next/navigation"

import { getLearningThread } from "@/lib/db/learning"
import { requireProfile } from "@/lib/db/profile"
import { LearningChatPanel } from "../learning-chat-panel"

export const dynamic = "force-dynamic"

export default async function LearningThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireProfile()
  const { id } = await params
  const thread = await getLearningThread(id, profile.id)

  if (!thread) {
    notFound()
  }

  return (
    <LearningChatPanel threadId={thread.id} initialMessages={thread.messages} />
  )
}
