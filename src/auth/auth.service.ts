import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/auth-sign-up.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async signUp(dto: SignUpDto) {
        const exist = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })

        if (exist) {
            throw new ConflictException("User already exists, please sign in")
        }


    }
}
