"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Profile } from "@prisma/client"

import { updateProfile } from "./actions"
import { profileSchema, type ProfileValues } from "@/lib/validations/profile"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { DISTRICTS } from "@/lib/districts"

function ProfileForm({ profile }: { profile: Profile }) {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: profile.phone,
      district: profile.district,
      bio: profile.bio ?? "",
    },
  })

  async function onSubmit(values: ProfileValues) {
    setFormError(null)
    setSuccess(false)
    const result = await updateProfile(values)
    if (result?.error) {
      setFormError(result.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+250 788 000 000"
              {...field}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="district"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="district">District</Label>
            <NativeSelect id="district" className="w-full" {...field}>
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

      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell buyers a bit about your farm."
              {...field}
            />
          </div>
        )}
      />

      {formError && (
        <div className="rounded-md px-3 py-2 text-sm text-destructive">
          {formError}
        </div>
      )}

      {success && (
        <div className="rounded-md px-3 py-2 text-sm text-green-600">
          Profile updated.
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}

export { ProfileForm }
