import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, UserModule, TransactionsModule],
})
export class AppModule { }
