"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EnvelopeIcon } from "@phosphor-icons/react"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { ROUTES } from "@/lib/routes"
import { signInSchema, type SignInValues } from "@/lib/validations/auth"
import { AuthShell } from "../auth-shell"
import { PasswordInput } from "@/components/ui/password-input"
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

export default function SignInForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: SignInValues) {
    setFormError(null)
    try {
      await apiClient.post(API_ROUTES.signIn, values)
      router.push(ROUTES.home)
      router.refresh()
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Failed to sign in. Try again"))
    }
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Welcome back. Pick up where you left off.
          </CardDescription>
        </CardHeader>

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

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <PasswordInput id="password" {...field} />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {formError && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-foreground underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  )
}
