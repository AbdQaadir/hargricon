"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LearningThread } from "@prisma/client"
import { ListIcon, PlusIcon } from "@phosphor-icons/react"

import { LEARNING_TOPIC_LABELS } from "@/constants/learning"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function ThreadList({
  threads,
  onNavigate,
}: {
  threads: LearningThread[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-1">
      <Link
        href={ROUTES.dashboardLearning}
        onClick={onNavigate}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mb-2 justify-start gap-2"
        )}
      >
        <PlusIcon data-icon="inline-start" />
        New chat
      </Link>

      {threads.length === 0 ? (
        <p className="px-2 py-1.5 text-xs text-muted-foreground">
          No conversations yet.
        </p>
      ) : (
        threads.map((thread) => {
          const href = ROUTES.dashboardLearningThread(thread.id)
          const isActive = pathname === href

          return (
            <Link
              key={thread.id}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex flex-col gap-0.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                isActive && "bg-muted font-medium"
              )}
            >
              <span className="truncate">{thread.title}</span>
              <span className="text-xs text-muted-foreground">
                {LEARNING_TOPIC_LABELS[thread.topic]}
              </span>
            </Link>
          )
        })
      )}
    </div>
  )
}

function LearningNav({ threads }: { threads: LearningThread[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden md:block md:w-56 md:shrink-0">
        <ThreadList threads={threads} />
      </aside>

      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <ListIcon data-icon="inline-start" />
                History
              </Button>
            }
          />
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Conversations</SheetTitle>
            </SheetHeader>
            <div className="px-6 pb-6">
              <ThreadList threads={threads} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export { LearningNav }
