import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { JwtStrategy } from "../../auth/jwt/jwt.strategy";
import { RegisterDto } from "../dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { UserService } from "../user.service";
import { PrismaService } from "../../../common/database/prisma.service";
import { v4 as uuidv4 } from 'uuid';
import { TransactionsService } from "../../../modules/transactions/transactions.service";

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [JwtStrategy, JwtService, UserService, PrismaService, TransactionsService],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    })

    describe('registerUser', () => {
        it('should register new user and return the token', async () => {
            const registerDto: RegisterDto = { username: 'existingUser' }
            const expectedToken = 'generated_token';
            const id = uuidv4();

            jest.spyOn(userService, 'registerUser').mockResolvedValue({ id, username: 'existingUser', balance: 0, timestamp: new Date('2023-11-29T00:34:31.675Z'), token: expectedToken });

            const result = await userController.register(registerDto);
            Logger.debug(result);

            expect(result).toEqual({ id, username: 'existingUser', balance: 0, timestamp: new Date('2023-11-29T00:34:31.675Z'), token: expectedToken });
        })

        it('should throw error user alreasy exist if user exists', async () => {
            const registerDto: RegisterDto = { username: 'existingUser' }
            const id = uuidv4();

            jest.spyOn(userService, 'findByUsername').mockResolvedValue({ id, username: 'existingUser', balance: 0, timestamp: new Date() });

            try {
                await userController.register(registerDto);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.message).toEqual('Username already exists');
                expect(error.getStatus()).toEqual(HttpStatus.CONFLICT);
            }
        })
    })
})