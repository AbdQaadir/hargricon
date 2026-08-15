-- CreateEnum
CREATE TYPE "LearningTopic" AS ENUM ('STORAGE', 'PEST_MANAGEMENT', 'SOIL_HEALTH', 'PLANTING', 'HARVESTING', 'MARKET_TIMING', 'GENERAL');

-- AlterTable
ALTER TABLE "LearningEntry" DROP COLUMN "answer",
ADD COLUMN     "steps" TEXT[],
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "topic" "LearningTopic" NOT NULL;
