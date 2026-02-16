import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signInDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}