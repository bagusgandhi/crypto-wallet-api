-- DropIndex
DROP INDEX "Transactions_timestamp_user_id_amount_transaction_type_idx";

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "truncated_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Transactions_timestamp_truncated_timestamp_user_id_amount_t_idx" ON "Transactions"("timestamp", "truncated_timestamp", "user_id", "amount", "transaction_type");
