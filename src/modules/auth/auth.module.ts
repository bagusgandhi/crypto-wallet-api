import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Env } from '../../common/config/env-loader';
import { PrismaModule } from '../../common/database/prisma.module';

const { JWT_SECRET } = Env();

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '365d'
      }
    }),
    PassportModule,
    PrismaModule,
    forwardRef(() => UserModule)
  ],
  providers: [ JwtStrategy ],
  exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule { }
