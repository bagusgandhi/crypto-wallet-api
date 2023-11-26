import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt.interface";
import { Env } from '../../../common/config/env-loader';
import { UserService } from "src/modules/user/user.service";

const { JWT_SECRET } = Env();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const { username } = payload;
        const user = await this.userService.validateUser(username);

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }   
}