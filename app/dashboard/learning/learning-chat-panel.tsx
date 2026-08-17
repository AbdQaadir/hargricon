"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { LearningMessage } from "@prisma/client"
import { HeartIcon, PaperPlaneTiltIcon, RobotIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { ROUTES } from "@/lib/routes"
import type { LearningStreamChunk } from "@/lib/ai/learning"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Textarea } from "@/components/ui/textarea"

type PendingMessage = {
  question: string
  summary: string
  steps: string[]
}

function AssistantAnswer({
  content,
  steps,
  pending,
  footer,
}: {
  content: string
  steps: string[]
  pending?: boolean
  footer?: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <RobotIcon className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {content || (pending ? "Thinking..." : "")}
          {pending && (
            <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary/60 align-middle" />
          )}
        </p>
        {steps.length > 0 && (
          <ol className="flex flex-col gap-1.5 text-sm">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-medium text-primary">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
        {footer}
      </div>
    </div>
  )
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-sm">
        {content}
      </div>
    </div>
  )
}

function LearningChatPanel({
  threadId,
  initialMessages,
}: {
  threadId: string | null
  initialMessages: LearningMessage[]
}) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [pending, setPending] = useState<PendingMessage | null>(null)

  async function ask() {
    if (isAsking) return
    const trimmed = question.trim()
    if (trimmed.length < 3) {
      toast.error("Ask a question first.")
      return
    }

    setIsAsking(true)
    setQuestion("")
    setPending({ question: trimmed, summary: "", steps: [] })

    try {
      const endpoint = threadId
        ? API_ROUTES.learningThreadMessages(threadId)
        : API_ROUTES.learningThreads
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Couldn't get an answer.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let newlineIndex
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex)
          buffer = buffer.slice(newlineIndex + 1)
          if (!line.trim()) continue

          const chunk = JSON.parse(line) as LearningStreamChunk
          if (chunk.type === "partial") {
            setPending((prev) =>
              prev
                ? { ...prev, summary: chunk.summary, steps: chunk.steps }
                : prev
            )
          } else if (chunk.type === "done") {
            setMessages((prev) => [
              ...prev,
              chunk.userMessage,
              chunk.assistantMessage,
            ])
            setPending(null)
            if (!threadId) {
              router.push(ROUTES.dashboardLearningThread(chunk.threadId))
            }
            router.refresh()
          } else if (chunk.type === "error") {
            throw new Error(chunk.message)
          }
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't get an answer."
      )
      setPending(null)
    } finally {
      setIsAsking(false)
    }
  }

  async function toggleLike(message: LearningMessage) {
    const nextLiked = !message.liked
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, liked: nextLiked } : m))
    )
    try {
      await apiClient.patch(API_ROUTES.learningMessage(message.id), {
        liked: nextLiked,
      })
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, liked: message.liked } : m
        )
      )
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {messages.length === 0 && !pending ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <RobotIcon />
            </EmptyMedia>
            <EmptyTitle>Ask your first question</EmptyTitle>
            <EmptyDescription>
              Storing your harvest, managing pests, or anything else
              farming-related.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          {messages.map((message) =>
            message.role === "USER" ? (
              <UserBubble key={message.id} content={message.content} />
            ) : (
              <AssistantAnswer
                key={message.id}
                content={message.content}
                steps={message.steps}
                footer={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-fit text-muted-foreground"
                    onClick={() => toggleLike(message)}
                  >
                    <HeartIcon
                      data-icon="inline-start"
                      weight={message.liked ? "fill" : "regular"}
                    />
                    {message.liked ? "Liked" : "Like"}
                  </Button>
                }
              />
            )
          )}
          {pending && (
            <>
              <UserBubble content={pending.question} />
              <AssistantAnswer
                content={pending.summary}
                steps={pending.steps}
                pending
              />
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <Textarea
          placeholder={
            threadId
              ? "Reply..."
              : "Ask about storing your harvest, managing pests, or anything else farming-related..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              ask()
            }
          }}
          rows={3}
          disabled={isAsking}
        />
        <div className="flex justify-end">
          <Button onClick={ask} disabled={isAsking}>
            <PaperPlaneTiltIcon data-icon="inline-start" />
            {isAsking ? "Thinking..." : "Ask"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { LearningChatPanel }
