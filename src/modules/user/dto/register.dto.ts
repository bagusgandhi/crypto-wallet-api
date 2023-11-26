import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "johndoe" })
    @IsNotEmpty()
    @IsString()
    username: string;
}