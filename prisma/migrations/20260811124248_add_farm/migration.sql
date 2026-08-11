-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district" "District" NOT NULL,
    "sizeHectares" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Farm_farmerId_idx" ON "Farm"("farmerId");

-- CreateIndex
CREATE INDEX "Farm_district_idx" ON "Farm"("district");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
