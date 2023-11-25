import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    to_username: string;
}