import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../user/dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Body() registerDto: RegisterDto){
        return await this.authService.register(registerDto)
    }

    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Body() loginDto: LoginDto){
        return await this.authService.login(loginDto);
    }
}
