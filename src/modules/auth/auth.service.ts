import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt.interface';
import { RegisterDto } from '../user/dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async login(loginDto: LoginDto) {
        try {
            const { username, password } = loginDto;
            const user = await this.userService.findByUsername(username);

            if (!user) {
                throw new BadRequestException('User Not Registered!');
            }

            const matched = await this.validatePassword(password, user.password);

            if (!matched) {
                throw new HttpException('Wrong Password!', HttpStatus.UNAUTHORIZED,);
            }

            const payload: JwtPayload = { username }
            const token = this.jwtService.sign(payload);

            return { token, ...user }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async register(registerDto: RegisterDto) {
        try {
            const { username, password } = registerDto;

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const user = await this.userService.create(registerDto, salt, hashedPassword);

            const payload: JwtPayload = { username }
            const token = this.jwtService.sign(payload);

            return { ...user, token }

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async validatePassword(password: string, hashed: string) {
        return await bcrypt.compare(password, hashed);
    }
}
