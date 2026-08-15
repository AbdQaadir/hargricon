"use client"

import { useState } from "react"
import type { LearningEntry } from "@prisma/client"
import { HeartIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { LEARNING_TOPIC_LABELS } from "@/constants/learning"
import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Textarea } from "@/components/ui/textarea"

function LearningChat({ initialEntries }: { initialEntries: LearningEntry[] }) {
  const [entries, setEntries] = useState(initialEntries)
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [likedOnly, setLikedOnly] = useState(false)

  async function ask() {
    const trimmed = question.trim()
    if (trimmed.length < 3) {
      toast.error("Ask a question first.")
      return
    }
    setIsAsking(true)
    try {
      const { data } = await apiClient.post<{ entry: LearningEntry }>(
        API_ROUTES.learningEntries,
        { question: trimmed }
      )
      setEntries((prev) => [data.entry, ...prev])
      setQuestion("")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't get an answer."))
    } finally {
      setIsAsking(false)
    }
  }

  async function toggleLike(entry: LearningEntry) {
    const nextLiked = !entry.liked
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, liked: nextLiked } : e))
    )
    try {
      await apiClient.patch(API_ROUTES.learningEntry(entry.id), {
        liked: nextLiked,
      })
    } catch (error) {
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, liked: entry.liked } : e))
      )
      toast.error(getApiErrorMessage(error))
    }
  }

  const visibleEntries = likedOnly ? entries.filter((e) => e.liked) : entries

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            placeholder="Ask about storing your harvest, managing pests, or anything else farming-related..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                ask()
              }
            }}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={ask} disabled={isAsking}>
              <PaperPlaneTiltIcon data-icon="inline-start" />
              {isAsking ? "Thinking..." : "Ask"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          {likedOnly ? "Liked answers" : "Your questions"}
        </h2>
        <Button
          variant={likedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setLikedOnly((prev) => !prev)}
        >
          <HeartIcon
            data-icon="inline-start"
            weight={likedOnly ? "fill" : "regular"}
          />
          Liked only
        </Button>
      </div>

      {visibleEntries.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PaperPlaneTiltIcon />
            </EmptyMedia>
            <EmptyTitle>
              {likedOnly ? "No liked answers yet" : "No questions yet"}
            </EmptyTitle>
            <EmptyDescription>
              {likedOnly
                ? "Like an answer to save it here for later."
                : "Ask your first question above to get started."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{entry.question}</p>
                    <Badge variant="secondary" className="w-fit">
                      {LEARNING_TOPIC_LABELS[entry.topic]}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleLike(entry)}
                    aria-label={entry.liked ? "Unlike" : "Like"}
                    className={cn(
                      "shrink-0 text-muted-foreground transition-colors hover:text-destructive",
                      entry.liked && "text-destructive"
                    )}
                  >
                    <HeartIcon weight={entry.liked ? "fill" : "regular"} />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground">{entry.summary}</p>

                {entry.steps.length > 0 && (
                  <ol className="flex flex-col gap-1.5 text-sm">
                    {entry.steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-medium text-primary">
                          {index + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export { LearningChat }
