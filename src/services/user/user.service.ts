import { ConflictException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async findByUsername(username: string){
        try {
            const user = await this.prisma.user.findUnique({ where: { username } });
            if(!user) throw new NotFoundException('User Not Found');

            return user;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async create(registerDto: RegisterDto){
        try {
            const { username } = registerDto;           
            const isUserExist = await this.prisma.user.findUnique({ where: { username: username } });
    
            if(isUserExist){
                throw new ConflictException('Username already exists');
            }

            const newUser = await this.prisma.user.create({ data: registerDto });

            return newUser;

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }


}
