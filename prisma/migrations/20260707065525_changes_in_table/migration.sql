/*
  Warnings:

  - The `category` column on the `Vendor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Vendor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('free', 'open', 'close');

-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('technology', 'healthcare', 'education', 'finance', 'retail', 'logistics');

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "category",
ADD COLUMN     "category" "Categories" NOT NULL DEFAULT 'technology',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'free';

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "Categories" NOT NULL DEFAULT 'technology',
    "location" TEXT NOT NULL,
    "estimated_value" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "exp_start_date" TIMESTAMP(3),

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);
