import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../token.service";

@Injectable()
export class MegicLinkGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private tokenService: TokenService
    ) { };

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { accsessToken, refreshToken } = request.cookies;

        if (!accsessToken && !refreshToken) {
            throw new UnauthorizedException("Accses toen cookie not found.");
        };

        if (!accsessToken && refreshToken) {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            const { accessToken: newAccessToken } = this.tokenService.generateAccessToken(decoded)
            response.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 15 * 60 * 1000,
            });
            request.user = decoded;
            return true;
        };

        try {
            const decoded = await this.jwtService.verifyAsync(accsessToken);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Access token invalid or expired!")
        }
    };
}