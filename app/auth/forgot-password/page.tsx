"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EnvelopeIcon } from "@phosphor-icons/react"

import { requestPasswordReset } from "./actions"
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth"
import { AuthShell } from "../auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    await requestPasswordReset(values)
    setSubmitted(true)
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter the email on your account and we&apos;ll send you a link to
            reset your password.
          </CardDescription>
        </CardHeader>

        {submitted ? (
          <CardContent>
            <div className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
              If an account exists for that email, a reset link is on its way.
              Check your inbox.
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-5">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email">Email address</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <EnvelopeIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="email"
                          type="email"
                          placeholder="john@my-company.com"
                          {...field}
                        />
                      </InputGroup>
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending link..." : "Send reset link"}
                </Button>
              </div>
            </CardContent>
          </form>
        )}

        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link
              href="/auth/sign-in"
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthShell>
  )
}
