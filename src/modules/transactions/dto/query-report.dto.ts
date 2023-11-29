import { IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { TransactionType } from "../../../common/enum/transaction-type.enum";

export class QueryTransactionReportDto {
    @IsString()
    @IsOptional()
    user_id:string;

    @IsString()
    @IsOptional()
    from: string;

    @IsString()
    @IsOptional()
    to: string;

    @IsEnum(TransactionType)
    @IsOptional()
    transaction_type: string;
}