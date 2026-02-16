import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { AuthRepository } from './auth.repository';
import { TokenService } from './token.service';
import { SendAuthMegicLink } from './magic-link.service';
import { signInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private magicLinkService: SendAuthMegicLink,
        private tokenService: TokenService,
        private authRepo: AuthRepository
    ) { }

    async signUp(signUpDto: signUpDto) {
        const METHOD: "sign-up" = "sign-up";
        const existingUser = await this.authRepo.findByEmail(signUpDto.email);
        if (existingUser) {
            throw new ConflictException("User already exists. Please sign in.");
        };

        const token = this.tokenService.magicLinkToken({ name: signUpDto.name, email: signUpDto.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: signUpDto.email })
    }

    async signIn(signInDto: signInDto) {
        const METHOD: "sign-in" = "sign-in"
        const existingUser = await this.authRepo.findByEmail(signInDto.email)
        if (!existingUser) {
            throw new UnauthorizedException("User does not exist. Please sign up.")
        }

        const token = this.tokenService.magicLinkToken({ email: signInDto.email, method: METHOD })
        return this.magicLinkService.sendMagicLink({ token, email: signInDto.email })
    }
}
