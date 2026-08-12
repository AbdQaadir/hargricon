"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { SORT_LABELS, type ListingSort } from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"
import { ROUTES } from "@/lib/routes"
import { buttonVariants } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const SORT_VALUES = Object.keys(SORT_LABELS) as ListingSort[]
const SEARCH_DEBOUNCE_MS = 400

function ProduceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const crop = searchParams.get("crop") ?? ""
  const district = searchParams.get("district") ?? ""
  const sort = searchParams.get("sort") ?? "newest"

  const [cropInput, setCropInput] = useState(crop)
  // Tracks the last URL-driven value so we can tell "the URL changed
  // externally (e.g. Clear)" apart from "the user is typing" during render,
  // without an Effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [syncedCrop, setSyncedCrop] = useState(crop)

  if (crop !== syncedCrop) {
    setSyncedCrop(crop)
    setCropInput(crop)
  }

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname)
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    if (cropInput === crop) return

    const timeout = setTimeout(() => {
      updateParams({ crop: cropInput })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [cropInput, crop, updateParams])

  const hasFilters = Boolean(crop || district || sort !== "newest")

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <InputGroup className="sm:max-w-xs">
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={cropInput}
          onChange={(event) => setCropInput(event.target.value)}
          placeholder="Search by crop, e.g. maize"
        />
      </InputGroup>

      <NativeSelect
        value={district}
        onChange={(event) => updateParams({ district: event.target.value })}
        className="sm:max-w-52"
      >
        <NativeSelectOption value="">All districts</NativeSelectOption>
        {DISTRICTS.map(({ value, label }) => (
          <NativeSelectOption key={value} value={value}>
            {label}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        value={sort}
        onChange={(event) => updateParams({ sort: event.target.value })}
        className="sm:max-w-52"
      >
        {SORT_VALUES.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {SORT_LABELS[value]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {hasFilters && (
        <Link
          href={ROUTES.listings}
          className={buttonVariants({ variant: "ghost" })}
        >
          Clear
        </Link>
      )}
    </div>
  )
}

export { ProduceFilters }
