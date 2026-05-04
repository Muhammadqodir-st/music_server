import { IsNotEmpty, IsString } from "class-validator";

export class MusicDto {
    @IsNotEmpty()
    @IsString()
    title!: string;
};