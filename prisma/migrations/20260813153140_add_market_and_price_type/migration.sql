-- CreateEnum
CREATE TYPE "MarketPriceType" AS ENUM ('RETAIL', 'WHOLESALE', 'FARMGATE');

-- DropIndex
DROP INDEX "MarketPrice_cropId_district_recordedDate_idx";

-- DropIndex
DROP INDEX "MarketPrice_cropId_district_source_recordedDate_key";

-- AlterTable
ALTER TABLE "MarketPrice" DROP COLUMN "district",
ADD COLUMN     "marketId" TEXT NOT NULL,
ADD COLUMN     "priceType" "MarketPriceType" NOT NULL;

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "esokoId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "district" "District" NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_esokoId_key" ON "Market"("esokoId");

-- CreateIndex
CREATE INDEX "Market_district_idx" ON "Market"("district");

-- CreateIndex
CREATE INDEX "MarketPrice_cropId_marketId_recordedDate_idx" ON "MarketPrice"("cropId", "marketId", "recordedDate");

-- CreateIndex
CREATE UNIQUE INDEX "MarketPrice_cropId_marketId_priceType_source_recordedDate_key" ON "MarketPrice"("cropId", "marketId", "priceType", "source", "recordedDate");

-- AddForeignKey
ALTER TABLE "MarketPrice" ADD CONSTRAINT "MarketPrice_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

