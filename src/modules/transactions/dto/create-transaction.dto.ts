import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionType } from "../../../common/enum/transaction-type.enum";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    user_id:  string;

    @IsNotEmpty()
    // @IsString()
    @IsEnum(TransactionType)
    transaction_type: TransactionType;

    @IsOptional()
    transaction_detail: Record<string, any>;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    current_balance: number;

    @IsNotEmpty()
    @IsNumber()
    final_balance: number;
}