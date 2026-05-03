import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { updateDto } from './dto/update.dto';
import { UsersGuard } from './guards/user.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    getAll() {
        return this.userService.getAll();
    };

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.userService.getById(id);
    };

    @UseGuards(UsersGuard)
    @Put(":id")
    update(@Param("id") id: string, @Body() dto: updateDto) {
        return this.userService.update(id, dto);
    };

    @Delete(":id")
    deleteById(@Param("id") id: string) {
        return this.userService.delete(id);
    };
};