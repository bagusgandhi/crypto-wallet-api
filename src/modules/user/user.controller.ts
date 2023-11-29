import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { TopUpDto } from './dto/topup.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('balance')
    async getBalance(@GetUser() user: Users ){
        const { username } = user;
        return await this.userService.getBalance(username);
    }

    @ApiBearerAuth()
    @ApiBody({ type: TopUpDto })
    @ApiResponse({ status: 204, description: 'No Content' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Post('topup')
    async topUpBalance(@GetUser() user: Users, @Body() body: TopUpDto){
        const { username } = user;
        return await this.userService.topupBalance(username, body)
    }

    @ApiBearerAuth()
    @ApiBody({ type: TransferDto })
    @ApiResponse({ status: 204, description: 'No Content' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Post('transfer')
    async transferBalance(@GetUser() user: Users, @Body() body: TransferDto){
        const { username } = user;
        return await this.userService.transferBalance(username, body);
    }
}
