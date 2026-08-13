-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
