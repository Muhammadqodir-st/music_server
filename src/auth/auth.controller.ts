import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { };

    @Post("sign-up")
    signUp(@Body() signUpDto: signUpDto) {
        return this.authService.signUp(signUpDto)
    }
};
