/*
  Warnings:

  - You are about to drop the column `mobile_no` on the `Vendor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Vendor_mobile_no_key";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "mobile_no";
