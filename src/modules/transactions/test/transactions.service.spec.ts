import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../transactions.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('TransactionsService', () => {
  let transactionService: TransactionsService;
  let prismaService: PrismaService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService, PrismaService],
    }).compile();

    transactionService = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);

  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

});
