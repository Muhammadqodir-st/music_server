import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signUpDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}