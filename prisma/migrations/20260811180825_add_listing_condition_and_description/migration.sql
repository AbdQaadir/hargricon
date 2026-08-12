/*
  Warnings:

  - Added the required column `condition` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingCondition" AS ENUM ('FRESH', 'NEARLY_RIPE', 'OVERRIPE_DISCOUNT');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "condition" "ListingCondition" NOT NULL,
ADD COLUMN     "description" TEXT;
