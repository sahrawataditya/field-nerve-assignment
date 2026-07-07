/*
  Warnings:

  - Made the column `name` on table `Vendor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "vendor_type" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "operating_location" DROP NOT NULL;
