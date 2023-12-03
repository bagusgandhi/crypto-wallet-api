import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionLogDto } from './dto/query-log.dto';
import { TransactionType } from 'src/common/enum/transaction-type.enum';
import { QueryTransactionReportDto } from './dto/query-report.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async getTransactionByUser(userId: string) {
        try {
            const transactions = await this.prisma.$queryRaw`SELECT u.username, t.amount FROM "Transactions" t JOIN "Users" u ON t.user_id = u.id
                WHERE t.user_id = ${userId} ORDER BY ABS(amount) DESC LIMIT 10
            `;

            return transactions;

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async getTopTransaction() {
        try {
            const topTransactions = await this.prisma.$queryRaw`SELECT u.username, SUM(ABS(T.amount)) AS transacted_value FROM "Transactions" t JOIN "Users" u ON t.user_id = u.id
            WHERE t.transaction_type = 'transfer' GROUP BY u.username ORDER BY transacted_value DESC LIMIT 10`;

            return topTransactions;

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async getAllTransactionsSeries(queryTransactionDto: QueryTransactionReportDto) {
        try {
            const { user_id, from, to, transaction_type } = queryTransactionDto;
            const data = await this.prisma.transactions.groupBy({
                by: ['truncated_timestamp', 'transaction_type'],
                where: {
                    ...(from || to || transaction_type || user_id
                        ? {
                            truncated_timestamp: {
                                gte: from ? new Date(from) : undefined,
                                lte: to ? new Date(to) : undefined,
                            },
                            transaction_type: transaction_type ? transaction_type as TransactionType : undefined,
                            user_id: user_id || undefined
                        } : {}
                    )
                },
                _sum: {
                    amount: true
                },
                _max: {
                    timestamp: true
                },
                _min: {
                    timestamp: true
                },
                orderBy: {
                    truncated_timestamp: 'asc',
                },
            });

            const transfer = [];
            const topup = [];

            if (data) {
                data.map((transaction) => {
                    if( transaction.transaction_type === "transfer" ) {
                        transfer.push([Math.abs(transaction._sum?.amount), transaction._min.timestamp])
                    } else {
                        topup.push([transaction._sum?.amount, transaction._max.timestamp])
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
            const { user_id, from, to, transaction_type, limit, cursor, username } = queryTransactionDto;

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
                        gt: from ? new Date(from) : undefined,
                        lt: to ? new Date(to + 'T23:59:59.999Z') : undefined,
                    },
                    transaction_type: transaction_type as TransactionType || undefined,
                    user_id: user_id || undefined,
                    user: {
                        username: username ? { contains: username } : undefined
                    },
                    AND: cursor ? { timestamp: { lt: new Date(cursor) } } : undefined
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: limit
            });

            const data = transactionsLog.map((data) => ({ ...data, key: data.id }))
            return { data };

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }
}
