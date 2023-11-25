import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { JwtPayload } from "./jwt.interface";
import { Env } from '../../../config/env-loader';

const { JWT_SECRET } = Env();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const { username } = payload;
        const user = await this.authService.validateUser(username);

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }   
}