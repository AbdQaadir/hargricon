"use client"

import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Profile } from "@prisma/client"
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import { API_ROUTES } from "@/lib/api-routes"
import { profileSchema, type ProfileValues } from "@/lib/validations/profile"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { DISTRICTS } from "@/lib/districts"

function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName ?? "",
      phone: profile.phone,
      whatsapp: profile.whatsapp ?? "",
      district: profile.district,
      bio: profile.bio ?? "",
    },
  })

  async function onSubmit(values: ProfileValues) {
    try {
      await apiClient.patch(API_ROUTES.profile, values)
      toast.success("Profile updated successfully!")
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile."))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {profile.firstName.charAt(0).toUpperCase()}
            {profile.lastName ? profile.lastName.charAt(0).toUpperCase() : ""}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-foreground">
                {profile.firstName} {profile.lastName ?? ""}
              </h3>
              {profile.roles.map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="text-xs font-medium"
                >
                  {role}
                </Badge>
              ))}
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <EnvelopeIcon className="size-3.5" />
              {profile.email}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First name</Label>
              <InputGroup>
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="firstName"
                  placeholder="First name"
                  {...field}
                />
              </InputGroup>
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
              <Label htmlFor="lastName">Last name (optional)</Label>
              <Input id="lastName" placeholder="Last name" {...field} />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone number</Label>
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
          name="whatsapp"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="whatsapp">WhatsApp number (optional)</Label>
              <InputGroup>
                <InputGroupAddon>
                  <WhatsappLogoIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="whatsapp"
                  type="tel"
                  placeholder="+250 788 000 000"
                  {...field}
                />
              </InputGroup>
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="district"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="district" className="flex items-center gap-1.5">
              <MapPinIcon className="size-4 text-muted-foreground" />
              District
            </Label>
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
            <Label htmlFor="bio">Bio & Farm Description</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Tell buyers about your farm, what crops you cultivate, and your harvesting practices..."
              {...field}
            />
          </div>
        )}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving changes..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

export { ProfileForm }
