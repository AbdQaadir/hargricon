-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "farmId" TEXT;

-- CreateIndex
CREATE INDEX "Listing_farmId_idx" ON "Listing"("farmId");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
