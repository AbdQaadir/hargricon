"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react"

import { signUpWithEmail } from "./actions"
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth"
import { AuthShell } from "../auth-shell"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { DISTRICTS } from "@/lib/districts"

function Required() {
  return (
    <span aria-hidden className="text-destructive">
      *
    </span>
  )
}

function Optional() {
  return (
    <span className="text-xs font-normal text-muted-foreground">
      (optional)
    </span>
  )
}

export default function SignUpForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    },
  })

  async function onSubmit(values: SignUpValues) {
    setFormError(null)
    const result = await signUpWithEmail(values)
    if (result?.error) {
      setFormError(result.error)
    }
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            List your produce and start reaching buyers directly.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="firstName">
                        First name <Required />
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...field}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="lastName">
                        Last name <Optional />
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...field}
                      />
                    </div>
                  )}
                />
              </div>

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">
                      Email address <Required />
                    </Label>
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
                    <Label htmlFor="password">
                      Password <Required />
                    </Label>
                    <PasswordInput id="password" {...field} />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">
                      Phone number <Required />
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <PhoneIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="phone"
                        type="tel"
                        placeholder="+250 788 000 000"
                        {...field}
                      />
                    </InputGroup>
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="district"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="district">
                      <MapPinIcon className="size-4 text-muted-foreground" />
                      District <Required />
                    </Label>
                    <NativeSelect id="district" className="w-full" {...field}>
                      <NativeSelectOption value="">
                        Select your district
                      </NativeSelectOption>
                      {DISTRICTS.map(({ value, label }) => (
                        <NativeSelectOption key={value} value={value}>
                          {label}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    {errors.district && (
                      <p className="text-sm text-destructive">
                        {errors.district.message}
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
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-foreground underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  )
}
