-- CreateEnum
CREATE TYPE "BuyerCategory" AS ENUM ('FARMERS_COOPERATIVE', 'WHOLESALERS', 'RETAILERS', 'SUPERMARKETS', 'BUYERS');

-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "BuyerCategory" NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Buyer_category_idx" ON "Buyer"("category");
