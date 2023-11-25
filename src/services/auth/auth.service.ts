import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async validateUser(username: string) {
        const user = await this.userService.findByUsername(username);
        if (user) return user;

        return null;
    }

    async registerUser(registerDto: RegisterDto) {
        try {
            const { username } = registerDto;
            await this.userService.create(registerDto);

            const payload: JwtPayload = { username }
            const token = this.jwtService.sign(payload);

            return { token }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
