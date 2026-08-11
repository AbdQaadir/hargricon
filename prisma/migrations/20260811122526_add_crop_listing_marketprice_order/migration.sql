-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "askingPrice" DOUBLE PRECISION NOT NULL,
    "recommendedPrice" DOUBLE PRECISION,
    "harvestDate" DATE NOT NULL,
    "district" "District" NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPrice" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "district" "District" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "recordedDate" DATE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceRecommendation" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "listingId" TEXT,
    "district" "District" NOT NULL,
    "recommendedPrice" DOUBLE PRECISION NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "generatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "agreedPrice" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crop_name_key" ON "Crop"("name");

-- CreateIndex
CREATE INDEX "Listing_farmerId_idx" ON "Listing"("farmerId");

-- CreateIndex
CREATE INDEX "Listing_cropId_idx" ON "Listing"("cropId");

-- CreateIndex
CREATE INDEX "Listing_district_status_idx" ON "Listing"("district", "status");

-- CreateIndex
CREATE INDEX "MarketPrice_cropId_district_recordedDate_idx" ON "MarketPrice"("cropId", "district", "recordedDate");

-- CreateIndex
CREATE UNIQUE INDEX "MarketPrice_cropId_district_source_recordedDate_key" ON "MarketPrice"("cropId", "district", "source", "recordedDate");

-- CreateIndex
CREATE INDEX "PriceRecommendation_cropId_district_idx" ON "PriceRecommendation"("cropId", "district");

-- CreateIndex
CREATE INDEX "Order_listingId_idx" ON "Order"("listingId");

-- CreateIndex
CREATE INDEX "Order_buyerId_idx" ON "Order"("buyerId");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPrice" ADD CONSTRAINT "MarketPrice_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRecommendation" ADD CONSTRAINT "PriceRecommendation_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRecommendation" ADD CONSTRAINT "PriceRecommendation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
