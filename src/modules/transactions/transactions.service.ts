import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from '../../common/database/prisma.service';
import { QueryTransactionLogDto } from './dto/query-log.dto';
import { TransactionType } from 'src/common/enum/transaction-type.enum';
import { QueryTransactionReportDto } from './dto/query-report.dto';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(createTransactionDto: CreateTransactionDto) {
        try {

            const date = new Date();

            const truncated_timestamp = new Date(
                Date.UTC(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDate()
                )
            );

            const createdTransaction = await this.prisma.transactions.create({
                data: { ...createTransactionDto, truncated_timestamp },
                include: {
                    user: true
                },
            });

            return createdTransaction;

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async getTransactionByUser(userId: string) {
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

    async getAllTransactionsSeries(queryTransactionDto: QueryTransactionReportDto) {
        try {
            const { user_id, from, to, transaction_type } = queryTransactionDto;
            const data = await this.prisma.transactions.findMany({
                where: {
                  ...(from || to || transaction_type || user_id
                    ? {
                        truncated_timestamp: {
                          gte: from ? new Date(from) : undefined,
                          lte: to ? new Date(to) : undefined,
                        },
                        transaction_type: transaction_type ? transaction_type as TransactionType : undefined,
                        user_id: user_id || undefined,
                      }
                    : {}),
                },
                select: {
                  truncated_timestamp: true,
                  transaction_type: true,
                  amount: true,
                  timestamp: true,
                },
              });

            const transfer = [];
            const topup = [];

            if (data) {
                data.map((transaction) => {
                    if( transaction.transaction_type === "transfer" ) {
                        transfer.push([Math.abs(transaction.amount), transaction.timestamp])
                    } else {
                        topup.push([transaction.amount, transaction.timestamp])
                    }
                })

                return {
                    series: [
                        { name: 'transfer', data: transfer},
                        { name: 'topup', data: topup},
                    ]
                }
            }

            return data;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async getAllTransactionLog(queryTransactionDto: QueryTransactionLogDto) {
        try {
            const { user_id, from, to, transaction_type, limit, page } = queryTransactionDto;

            const totalCount = await this.prisma.transactions.count({
                where: {
                    timestamp: {
                        gte: from ? new Date(from) : undefined,
                        lte: to ? new Date(to) : undefined,
                    },
                    transaction_type: transaction_type as TransactionType || undefined,
                },
            });

            const totalPages = Math.ceil(totalCount / limit);

            const transactionsLog = await this.prisma.transactions.findMany({
                select: {
                    id: true,
                    amount: true,
                    transaction_type: true,
                    timestamp: true,
                    transaction_detail: true,
                    user: {
                        select: {
                            username: true,
                            id: true,
                            full_name: true
                        },
                    },
                },
                where: {
                    timestamp: {
                        gte: from ? new Date(from) : undefined,
                        lte: to ? new Date(to) : undefined,
                    },
                    transaction_type: transaction_type as TransactionType || undefined,
                    user_id: user_id || undefined
                },
                orderBy: {
                    timestamp: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            });
            const data = transactionsLog.map((data) => ({ ...data, key: data.id }))
            return { data, total_pages: totalPages, };

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
