import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('user')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post()
    async register(@Body() registerDto: RegisterDto){
        return await this.authService.registerUser(registerDto)
    }
}