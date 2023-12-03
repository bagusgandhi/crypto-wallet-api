import { IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { TransactionType } from "../../../common/enum/transaction-type.enum";
import { Transform } from "class-transformer";
import { toNumber } from "src/common/utils/cast.helper";

export class QueryTransactionLogDto {
    @IsString()
    @IsOptional()
    user_id:string;

    @IsString()
    @IsOptional()
    from: string;

    @IsString()
    @IsOptional()
    to: string;

    @IsString()
    @IsOptional()
    cursor: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsEnum(TransactionType)
    @IsOptional()
    transaction_type: string;

    @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
    @IsNumber()
    @IsOptional()
    limit: number;

    @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
    @IsNumber()
    @IsOptional()
    page: number;
}