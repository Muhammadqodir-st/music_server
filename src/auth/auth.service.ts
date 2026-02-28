import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { AuthRepository } from './auth.repository';
import { TokenService } from './token.service';
import { SendAuthMegicLink } from './magic-link.service';
import { signInDto } from './dto/sign-in.dto';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { IGoogleUser, IUser } from './types/user.type';

@Injectable()
export class AuthService {
    constructor(
        private magicLinkService: SendAuthMegicLink,
        private tokenService: TokenService,
        private authRepo: AuthRepository
    ) { };

    async signUp(signUpDto: signUpDto) {
        const METHOD: "sign-up" = "sign-up";
        const existingUser = await this.authRepo.findByEmail(signUpDto.email);
        if (existingUser) {
            throw new ConflictException("User already exists. Please sign in.");
        };

        const token = this.tokenService.magicLinkToken({ name: signUpDto.name, email: signUpDto.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: signUpDto.email });
    };

    async signIn(signInDto: signInDto) {
        const METHOD: "sign-in" = "sign-in"
        const existingUser = await this.authRepo.findByEmail(signInDto.email);

        if (!existingUser) {
            throw new UnauthorizedException("User does not exist. Please sign up.");
        };

        if (existingUser.provider === "google") {
            throw new ConflictException("User signed up using Google, so use Google for signing in.");
        };

        const token = this.tokenService.magicLinkToken({ email: signInDto.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: signInDto.email });
    };

    async verify(token: string) {
        try {
            const payload = await this.tokenService.verifyToken(token);
            const existingUser = await this.authRepo.findByEmail(payload.email);

            if (payload.method === "sign-up") {

                if (existingUser) {
                    throw new ConflictException("User alredy exists.");
                };

                const [newUser] = await this.authRepo.createUser({ name: payload.name, email: payload.email });
                return this.tokenService.generateTokens(newUser);
            }

            if (payload.method === "sign-in") {

                if (!existingUser) {
                    throw new UnauthorizedException("User does not exits.");
                };

                return this.tokenService.generateTokens(existingUser);
            }

            throw new UnauthorizedException("Invalid auth method.");
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException("Token has expired.");
            };

            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException("Invalid token.");
            };

            throw new UnauthorizedException("Unauthorized.");
        };
    };

    async googleLogin(payload: IGoogleUser, res: any) {
        const user = await this.authRepo.findByEmail(payload.email);

        if (!user) {
            const [newUser] = await this.authRepo.createGoogleUser(payload)
            return this.tokenService.generateTokens(newUser)
        };

        if (user.provider !== "google") {
            res.redirect(`${process.env.FRONTEND_URL}/auth/sign-in`);
        };

        return this.tokenService.generateTokens(user);
    };

    async profile(payload: IUser) {
        const user = await this.authRepo.findByProfileEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException("User not found.");
        };

        return user
    };
}
