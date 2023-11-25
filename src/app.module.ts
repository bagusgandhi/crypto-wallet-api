import { Module } from '@nestjs/common';
import { UsersModule } from './services/user/user.module';
import { TransactionsModule } from './services/transactions/transactions.module';
import { AuthModule } from './services/auth/auth.module';
import { AuthController } from './services/auth/auth.controller';

@Module({
  imports: [UsersModule, TransactionsModule, AuthModule],
  controllers: [AuthController],
})
export class AppModule { }
