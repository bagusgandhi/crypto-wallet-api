import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { TransactionsService } from './transactions.service';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryTransactionLogDto } from './dto/query-log.dto';
import { QueryTransactionReportDto } from './dto/query-report.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionService: TransactionsService
    ) { }

    @Get()
    async getTransactionByUser(@GetUser() user: Users) {
        const { id } = user;
        return await this.transactionService.getTransactionByUser(id)
    }

    @Get('top_users')
    async getTopTransaction() {
        return await this.transactionService.getTopTransaction();
    }

    @ApiQuery({ name: 'transaction_type', type: String, example: 'topup', required: false })
    @ApiQuery({ name: 'from', type: String, example: '2023-10-20', required: false })
    @ApiQuery({ name: 'to', type: String, example: '2023-10-30', required: false })
    @ApiQuery({ name: 'id', type: String, example: 'uuid', required: false })
    @Get('report')
    async getAllTransaction(@Query() queryTransactionReportDto: QueryTransactionReportDto) {
        return await this.transactionService.getAllTransactionsSeries(queryTransactionReportDto);
    }

    @ApiQuery({ name: 'transaction_type', type: String, example: 'topup', required: false })
    @ApiQuery({ name: 'from', type: String, example: '2023-10-20', required: false })
    @ApiQuery({ name: 'to', type: String, example: '2023-10-30', required: false })
    @ApiQuery({ name: 'user_id', type: String, example: 'uuid', required: false })
    @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
    @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
    @Get('log')
    @Get('log')
    async getAllTransactionLogs(@Query() queryTransactionLogDto: QueryTransactionLogDto) {
        console.log(queryTransactionLogDto.limit, queryTransactionLogDto.page)
        const { limit = 10, page = 1, ...rest } = queryTransactionLogDto;
        const updatedDto = { ...rest, limit, page };
        return await this.transactionService.getAllTransactionLog(updatedDto);
    }

}
