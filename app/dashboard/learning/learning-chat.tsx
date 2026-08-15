"use client"

import { useState } from "react"
import type { LearningEntry } from "@prisma/client"
import {
  CaretLeftIcon,
  CaretRightIcon,
  HeartIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { LEARNING_TOPIC_LABELS } from "@/constants/learning"
import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

const PAGE_SIZE = 10

function LearningChat({ initialEntries }: { initialEntries: LearningEntry[] }) {
  const [entries, setEntries] = useState(initialEntries)
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [likedOnly, setLikedOnly] = useState(false)
  const [page, setPage] = useState(1)

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
      setPage(1)
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
  const totalPages = Math.max(1, Math.ceil(visibleEntries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageEntries = visibleEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

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
          onClick={() => {
            setLikedOnly((prev) => !prev)
            setPage(1)
          }}
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
        <>
          <Accordion multiple>
            {pageEntries.map((entry) => (
              <AccordionItem key={entry.id} value={entry.id}>
                <AccordionTrigger>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{entry.question}</p>
                      {entry.liked && (
                        <HeartIcon
                          weight="fill"
                          className="size-3.5 shrink-0 text-destructive"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {LEARNING_TOPIC_LABELS[entry.topic]}
                      </Badge>
                      <span className="text-xs font-normal text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      {entry.summary}
                    </p>

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

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => toggleLike(entry)}
                    >
                      <HeartIcon
                        data-icon="inline-start"
                        weight={entry.liked ? "fill" : "regular"}
                      />
                      {entry.liked ? "Unlike" : "Like"}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <CaretLeftIcon data-icon="inline-start" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
                <CaretRightIcon data-icon="inline-end" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { LearningChat }
