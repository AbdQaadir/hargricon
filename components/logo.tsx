import Link from "next/link"
import { LeafIcon } from "@phosphor-icons/react"

import { SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

function LogoMark({ className }: { className?: string }) {
  return (
    <LeafIcon weight="fill" className={cn("size-5 text-primary", className)} />
  )
}

function Logo({
  href = "/",
  className,
  iconClassName,
  textClassName,
}: {
  href?: string
  className?: string
  iconClassName?: string
  textClassName?: string
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-1", className)}>
      <LogoMark className={iconClassName} />
      <span
        className={cn(
          "font-heading text-base font-bold tracking-tight",
          textClassName
        )}
      >
        {SITE_NAME}
      </span>
    </Link>
  )
}

export { Logo, LogoMark }
