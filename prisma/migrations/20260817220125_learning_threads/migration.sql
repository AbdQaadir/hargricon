-- CreateEnum
CREATE TYPE "LearningRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "LearningThread" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" "LearningTopic" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "LearningThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" "LearningRole" NOT NULL,
    "content" TEXT NOT NULL,
    "steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningThread_farmerId_idx" ON "LearningThread"("farmerId");

-- CreateIndex
CREATE INDEX "LearningMessage_threadId_idx" ON "LearningMessage"("threadId");

-- AddForeignKey
ALTER TABLE "LearningThread" ADD CONSTRAINT "LearningThread_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningMessage" ADD CONSTRAINT "LearningMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "LearningThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing LearningEntry rows into threads (reusing the entry's id as the
-- thread id) with one USER + one ASSISTANT message each, before dropping the table.
INSERT INTO "LearningThread" ("id", "farmerId", "title", "topic", "createdAt", "updatedAt")
SELECT
    "id",
    "farmerId",
    CASE WHEN length("question") > 60 THEN left("question", 57) || '...' ELSE "question" END,
    "topic",
    "createdAt",
    "createdAt"
FROM "LearningEntry";

INSERT INTO "LearningMessage" ("id", "threadId", "role", "content", "steps", "liked", "createdAt")
SELECT gen_random_uuid()::text, "id", 'USER', "question", ARRAY[]::TEXT[], false, "createdAt"
FROM "LearningEntry";

INSERT INTO "LearningMessage" ("id", "threadId", "role", "content", "steps", "liked", "createdAt")
SELECT gen_random_uuid()::text, "id", 'ASSISTANT', "summary", "steps", "liked", "createdAt"
FROM "LearningEntry";

-- DropForeignKey
ALTER TABLE "LearningEntry" DROP CONSTRAINT "LearningEntry_farmerId_fkey";

-- DropTable
DROP TABLE "LearningEntry";
