import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Env } from '../../common/config/env-loader';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    forwardRef(() => UserModule)
  ],
  providers: [ JwtStrategy, AuthService ],
  exports: [JwtModule, JwtStrategy, PassportModule],
  controllers: [AuthController],
})
export class AuthModule { }
