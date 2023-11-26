import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface IUserRequest {
    id: string;
    username: string;
    balance: number;
    timestamp: Date;
}

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return user as IUserRequest; 
});