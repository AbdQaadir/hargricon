import type { Crop, Farm } from "@prisma/client"
import { Controller, type Control, type FieldErrors } from "react-hook-form"

import { CONDITION_LABELS, UNIT_LABELS } from "@/constants/produce"
import { DISTRICTS } from "@/lib/districts"
import type { ListingFormValues } from "@/lib/validations/listing"
import { ImageUploadField } from "@/components/image-upload-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

function ProduceFormFields({
  control,
  errors,
  crops,
  farms,
}: {
  control: Control<ListingFormValues>
  errors: FieldErrors<ListingFormValues>
  crops: Crop[]
  farms: Farm[]
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
              folder="hargricon/produce"
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
        name="cropId"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cropId">Crop</Label>
            <NativeSelect id="cropId" className="w-full" {...field}>
              <NativeSelectOption value="">Select a crop</NativeSelectOption>
              {crops.map((crop) => (
                <NativeSelectOption key={crop.id} value={crop.id}>
                  {crop.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.cropId && (
              <p className="text-sm text-destructive">
                {errors.cropId.message}
              </p>
            )}
          </div>
        )}
      />

      {farms.length > 0 && (
        <Controller
          control={control}
          name="farmId"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="farmId">Farm (optional)</Label>
              <NativeSelect
                id="farmId"
                className="w-full"
                {...field}
                value={field.value ?? ""}
              >
                <NativeSelectOption value="">No farm</NativeSelectOption>
                {farms.map((farm) => (
                  <NativeSelectOption key={farm.id} value={farm.id}>
                    {farm.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          )}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 500"
                {...field}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="unit"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="unit">Unit</Label>
              <NativeSelect id="unit" className="w-full" {...field}>
                <NativeSelectOption value="">Select a unit</NativeSelectOption>
                {Object.entries(UNIT_LABELS).map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {errors.unit && (
                <p className="text-sm text-destructive">
                  {errors.unit.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="askingPrice"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="askingPrice">Price (RWF/unit)</Label>
              <Input
                id="askingPrice"
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 350"
                {...field}
              />
              {errors.askingPrice && (
                <p className="text-sm text-destructive">
                  {errors.askingPrice.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="condition"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="condition">Condition</Label>
              <NativeSelect id="condition" className="w-full" {...field}>
                <NativeSelectOption value="">
                  Select condition
                </NativeSelectOption>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {errors.condition && (
                <p className="text-sm text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="harvestDate"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="harvestDate">Harvest date</Label>
              <Input id="harvestDate" type="date" {...field} />
              {errors.harvestDate && (
                <p className="text-sm text-destructive">
                  {errors.harvestDate.message}
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
      </div>

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional notes for buyers, e.g. sorting, packaging, pickup."
              {...field}
            />
          </div>
        )}
      />
    </>
  )
}

export { ProduceFormFields }
