import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller"
import { AuthService } from "../auth.service";
import { JwtStrategy } from "../jwt/jwt.strategy";
import { RegisterDto } from "../dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, Logger } from "@nestjs/common";
import { UserService } from "../../../services/user/user.service";
import { PrismaService } from "../../../database/prisma.service";
import { v4 as uuidv4 } from 'uuid';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, JwtStrategy, JwtService, UserService, PrismaService],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    })

    describe('registerUser', () => {
        it('should register new user and return the token', async () => {
            const registerDto: RegisterDto = { username: 'usertest1129' }
            const expectedToken = 'generated_token';

            jest.spyOn(authService, 'registerUser').mockResolvedValue({ token: expectedToken });

            const result = await authController.register(registerDto);
            Logger.debug(result);

            expect(result).toEqual({ token: expectedToken });
        })

        it('should throw error user lreasy exist is user exists', async () => {
            const registerDto: RegisterDto = { username: 'existingUser' }
            const id = uuidv4();

            jest.spyOn(userService, 'findByUsername').mockResolvedValue({id, username: 'existingUser', balance: 0, timestamp: new Date() });

            await expect(authService.registerUser(registerDto)).rejects.toThrow(ConflictException);
        })
    })
})