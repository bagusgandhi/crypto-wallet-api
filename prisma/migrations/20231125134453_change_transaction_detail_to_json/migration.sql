/*
  Warnings:

  - Changed the type of `transaction_detail` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transaction_detail",
ADD COLUMN     "transaction_detail" JSONB NOT NULL;
