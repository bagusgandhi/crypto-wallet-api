import { IsNotEmpty, IsNumber } from "class-validator";

export class TopUpDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}