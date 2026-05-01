import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;
};