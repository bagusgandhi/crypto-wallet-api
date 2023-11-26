import { Test, TestingModule } from "@nestjs/testing";
import { JwtStrategy } from "../../auth/jwt/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user.module";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../../../common/database/prisma.module";
import { Env } from "../../../common/config/env-loader";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { PrismaService } from "src/common/database/prisma.service";
import { v4 as uuidv4 } from 'uuid';

describe('UserService', () => {
    let userService: UserService;
    let prismaService: PrismaService;

    const { JWT_SECRET } = Env();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.register({
                secret: JWT_SECRET,
                signOptions: {
                    expiresIn: '365d'
                }
            }),
                UserModule, PassportModule, PrismaModule],
            providers: [UserService, JwtStrategy, PrismaService],
            controllers: [UserController],
        }).compile();

        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('Auth Service Should be defined!', () => {
        expect(userService).toBeDefined();
    });

    it('should get user balance by username', async () => {
        const username = "existingUser";
        const expectedBalance = 0;
        const id = uuidv4()

        jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue({ id, username, balance: expectedBalance, timestamp: new Date });
        const result = await userService.getBalance(username);

        expect(result).toEqual({ balance: expectedBalance });
    });
});