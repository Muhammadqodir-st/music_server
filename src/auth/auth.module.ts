import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { SendAuthMegicLink } from './magic-link.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [MailerModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
  })],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, SendAuthMegicLink, TokenService, GoogleStrategy]
})
export class AuthModule { }
