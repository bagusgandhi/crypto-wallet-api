import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(createTransactionDto: CreateTransactionDto) {
        try {
            const createdTransaction = await this.prisma.transactions.create({
                data: createTransactionDto,
                include: {
                    user: true
                },
            });

            return createdTransaction;

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async getTransactionByUsername(userId: string) {
        try {
            const transactions = await this.prisma.$queryRaw`SELECT u.username, t.amount FROM "Transactions" t JOIN "Users" u ON t.user_id = u.id
                WHERE t.user_id = ${userId} ORDER BY ABS(amount) DESC LIMIT 10
            `;

            return transactions;

        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTopTransaction() {
        try {
            const topTransactions = await this.prisma.$queryRaw`SELECT u.username, SUM(ABS(T.amount)) AS transacted_value FROM "Transactions" t JOIN "Users" u ON t.user_id = u.id
            WHERE t.transaction_type = 'transfer' GROUP BY u.username ORDER BY transacted_value DESC LIMIT 10`;

            return topTransactions;
            
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
