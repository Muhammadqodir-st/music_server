import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/sign-up.dto';
import { signInDto } from './dto/sign-in.dto';
import { MegicLinkGuard } from './guards/auth.guard';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { };

    @Post("sign-up")
    signUp(@Body() signUpDto: signUpDto) {
        return this.authService.signUp(signUpDto);
    };

    @Post("sign-in")
    signIn(@Body() signInDto: signInDto) {
        return this.authService.signIn(signInDto);
    };

    @Get("verify")
    async verify(
        @Query() data: { token: string },
        @Res() res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.verify(data.token);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 23 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.json({ message: "setting up cookie" });
    };

    @UseGuards(AuthGuard("google"))
    @Get("google")
    googleLogin(): void {
        return;
    }

    @UseGuards(AuthGuard("google"))
    @Get("google/callback")
    async googleCallBack(@Req() req: any, @Res() res: any) {
        const { accessToken, refreshToken } = await this.authService.googleLogin(req.user, res)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 23 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.redirect(process.env.FRONTEND_URL as string);
    };

    @UseGuards(MegicLinkGuard)
    @Get("profile")
    profile(@Req() req: any) {
        return this.authService.profile(req.user);
    };
};
