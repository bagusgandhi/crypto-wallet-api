import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class TopUpDto {
    @ApiProperty({ example: 25000})
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}