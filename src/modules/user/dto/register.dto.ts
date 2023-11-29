import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'Full Name',
        example: 'John Doe',
    })
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @ApiProperty({
        description: 'Username',
        example: 'johndoe',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Password',
        example: 'secret321okay',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}