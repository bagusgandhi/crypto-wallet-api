import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { TransactionsService } from './transactions.service';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionService: TransactionsService
    ){}

    @Get()
    async getTransactionByUser(@GetUser() user: Users ){
        const { id } = user;
        return await this.transactionService.getTransactionByUsername(id)
    }

    @Get('top_users')
    async getTopTransaction(){
        return await this.transactionService.getTopTransaction();
    }
}
