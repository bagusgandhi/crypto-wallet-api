import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { JwtStrategy } from "../../auth/jwt/jwt.strategy";
import { RegisterDto } from "../dto/register-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, Logger } from "@nestjs/common";
import { UserService } from "../user.service";
import { PrismaService } from "../../../common/database/prisma.service";
import { v4 as uuidv4 } from 'uuid';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [JwtStrategy, JwtService, UserService, PrismaService],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    })

    describe('registerUser', () => {
        it('should register new user and return the token', async () => {
            const registerDto: RegisterDto = { username: 'usertest1129' }
            const expectedToken = 'generated_token';

            jest.spyOn(userService, 'registerUser').mockResolvedValue({ token: expectedToken });

            const result = await userController.register(registerDto);
            Logger.debug(result);

            expect(result).toEqual({ token: expectedToken });
        })

        it('should throw error user lreasy exist is user exists', async () => {
            const registerDto: RegisterDto = { username: 'existingUser' }
            const id = uuidv4();

            jest.spyOn(userService, 'findByUsername').mockResolvedValue({id, username: 'existingUser', balance: 0, timestamp: new Date() });

            await expect(userService.registerUser(registerDto)).rejects.toThrow(ConflictException);
        })
    })
})