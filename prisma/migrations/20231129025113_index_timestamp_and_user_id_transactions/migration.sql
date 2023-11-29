-- CreateIndex
CREATE INDEX "Transactions_timestamp_user_id_idx" ON "Transactions"("timestamp", "user_id");
