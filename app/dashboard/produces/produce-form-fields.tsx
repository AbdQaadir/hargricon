import type { Crop, Farm } from "@prisma/client"
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form"

import type { ListingFormValues } from "@/lib/validations/listing"
import { ProduceBasicFields } from "./produce-basic-fields"
import { ProducePriceFields } from "./produce-price-fields"

function ProduceFormFields({
  control,
  errors,
  crops,
  farms,
  setValue,
  listingId,
}: {
  control: Control<ListingFormValues>
  errors: FieldErrors<ListingFormValues>
  crops: Crop[]
  farms: Farm[]
  setValue: UseFormSetValue<ListingFormValues>
  listingId?: string
}) {
  return (
    <>
      <ProduceBasicFields
        control={control}
        errors={errors}
        crops={crops}
        farms={farms}
        setValue={setValue}
      />
      <ProducePriceFields
        control={control}
        errors={errors}
        setValue={setValue}
        listingId={listingId}
        showAiPanel={false}
      />
    </>
  )
}

export { ProduceFormFields }
