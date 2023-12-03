import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { Env } from './common/config/env-loader';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';

const { REDIS_HOST, REDIS_PORT } = Env()
@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      host: REDIS_HOST,
      port: REDIS_PORT,
      store: redisStore
    }),
    AuthModule,
    UserModule,
    TransactionsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
  ]
})
export class AppModule { }
