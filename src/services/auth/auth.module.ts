import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Env } from '../../config/env-loader';
import { PrismaModule } from '../../database/prisma.module';

const { JWT_SECRET } = Env();

@Module({
  imports: [
  JwtModule.register({
    secret: JWT_SECRET,
    signOptions: {
      expiresIn: '365d'
    }
  }),
    UsersModule,
    PassportModule,
    PrismaModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategy, PassportModule, AuthService],
})
export class AuthModule { }
