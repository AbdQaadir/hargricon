-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FARMER', 'BUYER');

-- CreateEnum
CREATE TYPE "District" AS ENUM ('GASABO', 'KICUKIRO', 'NYARUGENGE', 'BURERA', 'GAKENKE', 'GICUMBI', 'MUSANZE', 'RULINDO', 'GISAGARA', 'HUYE', 'KAMONYI', 'MUHANGA', 'NYAMAGABE', 'NYANZA', 'NYARUGURU', 'RUHANGO', 'BUGESERA', 'GATSIBO', 'KAYONZA', 'KIREHE', 'NGOMA', 'NYAGATARE', 'RWAMAGANA', 'KARONGI', 'NGORORERO', 'NYABIHU', 'NYAMASHEKE', 'RUBAVU', 'RUSIZI', 'RUTSIRO');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "roles" "Role"[] DEFAULT ARRAY['FARMER']::"Role"[],
    "district" "District" NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_authUserId_key" ON "Profile"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Profile_district_idx" ON "Profile"("district");
