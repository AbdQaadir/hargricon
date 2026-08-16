"use client"

import * as React from "react"
import { EyeIcon, EyeSlashIcon, LockIcon } from "@phosphor-icons/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

function PasswordInput({
  className,
  icon = <LockIcon />,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  icon?: React.ReactNode
}) {
  const [visible, setVisible] = React.useState(false)

  return (
    <InputGroup className={className}>
      {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          aria-label={visible ? "Hide password" : "Show password"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setVisible((v) => !v)
          }}
        >
          {visible ? (
            <EyeSlashIcon className="pointer-events-none size-4" />
          ) : (
            <EyeIcon className="pointer-events-none size-4" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { PasswordInput }
