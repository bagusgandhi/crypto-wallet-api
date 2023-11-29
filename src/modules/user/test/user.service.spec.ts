import { Test, TestingModule } from "@nestjs/testing";
import { UserModule } from "../user.module";
import { PrismaModule } from "../../../common/database/prisma.module";
import { Env } from "../../../common/config/env-loader";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { PrismaService } from "../../../common/database/prisma.service";
import { v4 as uuidv4 } from 'uuid';
import { forwardRef } from "@nestjs/common";
import { AuthModule } from "../../../modules/auth/auth.module";
import { TransactionsService } from "../../../modules/transactions/transactions.service";

describe('UserService', () => {
    let userService: UserService;
    let prismaService: PrismaService;

    const { JWT_SECRET } = Env();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UserModule, 
                PrismaModule,
                forwardRef(() => AuthModule),
            ],
            providers: [UserService, PrismaService, TransactionsService],
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