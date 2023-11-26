import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDto {
    @ApiProperty({ example: 7500})
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ example: "vhio" })
    @IsNotEmpty()
    @IsString()
    to_username: string;
}