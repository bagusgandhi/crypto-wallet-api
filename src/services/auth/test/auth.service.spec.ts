import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { JwtStrategy } from "../jwt/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../../../services/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../../../database/prisma.module";
import { Env } from "../../../config/env-loader";
import { AuthController } from "../auth.controller";

describe('AuthService', () => {
    let authService: AuthService;
    const { JWT_SECRET } = Env();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [  JwtModule.register({
                secret: JWT_SECRET,
                signOptions: {
                  expiresIn: '365d'
                }
              }),
            UsersModule, PassportModule, PrismaModule ],
            providers: [AuthService, JwtStrategy],
            controllers: [AuthController],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('Auth Service Should be defined!', () => {
        expect(authService).toBeDefined();
    });
});