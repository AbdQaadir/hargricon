import { LearningChatPanel } from "./learning-chat-panel"

export const dynamic = "force-dynamic"

export default function NewLearningThreadPage() {
  return <LearningChatPanel threadId={null} initialMessages={[]} />
}
