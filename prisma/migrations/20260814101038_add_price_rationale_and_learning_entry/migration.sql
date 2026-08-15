-- AlterTable
ALTER TABLE "PriceRecommendation" ADD COLUMN     "rationale" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LearningEntry" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningEntry_farmerId_idx" ON "LearningEntry"("farmerId");

-- AddForeignKey
ALTER TABLE "LearningEntry" ADD CONSTRAINT "LearningEntry_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

