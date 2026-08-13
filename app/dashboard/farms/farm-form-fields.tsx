import { Controller, type Control, type FieldErrors } from "react-hook-form"

import { DISTRICTS } from "@/lib/districts"
import type { FarmFormValues } from "@/lib/validations/farm"
import { ImageUploadField } from "@/components/image-upload-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

function FarmFormFields({
  control,
  errors,
}: {
  control: Control<FarmFormValues>
  errors: FieldErrors<FarmFormValues>
}) {
  return (
    <>
      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label>Photos</Label>
            <ImageUploadField
              value={field.value}
              onChange={field.onChange}
              folder="hargricon/farms"
            />
            {errors.images && (
              <p className="text-sm text-destructive">
                {errors.images.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Farm name</Label>
            <Input id="name" placeholder="e.g. Uwase family farm" {...field} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
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
              <NativeSelectOption value="">
                Select a district
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

      <Controller
        control={control}
        name="sizeHectares"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sizeHectares">Size (hectares)</Label>
            <Input
              id="sizeHectares"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 2.5"
              {...field}
            />
            {errors.sizeHectares && (
              <p className="text-sm text-destructive">
                {errors.sizeHectares.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional notes about this farm."
              {...field}
            />
          </div>
        )}
      />
    </>
  )
}

export { FarmFormFields }
