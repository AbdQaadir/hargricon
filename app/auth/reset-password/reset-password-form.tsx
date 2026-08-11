"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { ROUTES } from "@/lib/routes"
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth"
import { AuthShell } from "../auth-shell"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  async function onSubmit(values: ResetPasswordValues) {
    try {
      await apiClient.post(API_ROUTES.resetPassword, {
        ...values,
        token: token ?? "",
      })
      toast.success("Password reset. Sign in with your new password.")
      router.push(ROUTES.signIn)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "This reset link is invalid or has expired.")
      )
    }
  }

  if (!token) {
    return (
      <AuthShell>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Invalid reset link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Request a new
              one to continue.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href={ROUTES.forgotPassword}
              className="w-full text-center text-sm text-foreground underline underline-offset-4"
            >
              Request a new link
            </Link>
          </CardFooter>
        </Card>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Choose a new password</CardTitle>
          <CardDescription>
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-5">
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="newPassword">New password</Label>
                    <PasswordInput id="newPassword" {...field} />
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword">
                      Confirm new password
                    </Label>
                    <PasswordInput id="confirmPassword" {...field} />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Resetting password..." : "Reset password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  )
}
