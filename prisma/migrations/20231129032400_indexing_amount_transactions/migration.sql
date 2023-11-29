-- DropIndex
DROP INDEX "Transactions_timestamp_user_id_idx";

-- CreateIndex
CREATE INDEX "Transactions_timestamp_user_id_amount_idx" ON "Transactions"("timestamp", "user_id", "amount");
