/*
  Warnings:

  - You are about to drop the column `add` on the `Transaction` table. All the data in the column will be lost.
  - Changed the type of `transaction_type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('topup', 'transfer');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "add",
DROP COLUMN "transaction_type",
ADD COLUMN     "transaction_type" "TransactionType" NOT NULL,
ALTER COLUMN "transaction_detail" DROP NOT NULL;
