import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { TransactionType } from '../../common/enum/transaction-type.enum';
import { PrismaService } from 'nestjs-prisma';
import { RegisterDto } from './dto/register.dto';
import { TopUpDto } from './dto/topup.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private readonly transactionsService: TransactionsService
    ) { }

    async findByUsername(username: string) {
        try {
            const user = await this.prisma.users.findUnique({ where: { username } });
            if (!user) throw new NotFoundException('User Not Found');

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async validateUser(username: string): Promise<Users | null> {
        const user = await this.findByUsername(username);
        if (user) return user;

        return null;
    }

    async create(registerDto: RegisterDto, salt: string, hashedPassword: string) {
        try {
            const { username } = registerDto;
            const isUserExist = await this.prisma.users.findUnique({ where: { username: username } });

            if (isUserExist) throw new ConflictException('Username already exists');

            const newUser = await this.prisma.users.create({ data: { ...registerDto, salt, password: hashedPassword } });

            return newUser;

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async getBalance(username: string) {
        try {
            const { balance } = await this.findByUsername(username);
            return { balance }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async updateBalance(username: string, balance: Users['balance']) {
        try {
            const updateUser = await this.prisma.users.update({
                where: { username },
                data: { balance }
            });

            return updateUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async topupBalance(username: string, topUpDto: TopUpDto) {
        try {
            const { amount } = topUpDto;

            if (amount <= 0 || amount > 10000000) throw new BadRequestException('Invalid topup amount');

            const user = await this.findByUsername(username);
            const newBalance = user.balance + amount;
            const transactionData = {
                user_id: user.id,
                transaction_type: TransactionType.topup,
                transaction_detail: {},
                amount: amount,
                current_balance: user.balance,
                final_balance: newBalance
            }

            await this.updateBalance(username, newBalance);
            await this.transactionsService.create(transactionData)

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async transferBalance(username: string, transferDto: TransferDto) {
        try {
            const { amount, to_username } = transferDto;
            const user = await this.findByUsername(username);
            const receiver = await this.findByUsername(to_username);

            if (!receiver) throw new NotFoundException('Destination user not found');

            if (username === to_username) throw new BadRequestException('A user cannot transfer from their account to the same account.');

            if (amount < 0 || amount > user.balance) throw new BadRequestException('Insufficient funds for the transfer.');

            const userUpdateBalance = user.balance - amount;
            const reveiverUpdateBalance = receiver.balance + amount;

            await this.updateBalance(username, userUpdateBalance);
            await this.updateBalance(to_username, reveiverUpdateBalance);

            const transactionData = {
                user_id: user.id,
                transaction_type: TransactionType.transfer,
                transaction_detail: { transfer_to: receiver.username },
                amount: -amount,
                current_balance: user.balance,
                final_balance: userUpdateBalance
            }

            await this.transactionsService.create(transactionData);

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }





}
