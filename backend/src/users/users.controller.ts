import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './entities/user.entity';

// Controller riêng cho việc tạo user test
@Controller('test')
export class TestController {
  constructor(private readonly usersService: UsersService) {}

  @Get('create-user')
  createTestUser() {
    return this.usersService.createTestUser();
  }

  @Get('reset-password/:email/:newPassword')
  async resetPassword(
    @Param('email') email: string,
    @Param('newPassword') newPassword: string
  ) {
    return this.usersService.resetPassword(email, newPassword);
  }
}

@Controller('users')
// Apply JwtAuthGuard and RolesGuard at the controller level
// This means all routes in this controller will require JWT authentication
// and then be subject to role checks if @Roles() is used.
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    // Allow users to view their own profile or admins to view any profile
    if (req.user.id !== +id && req.user.role !== Role.ADMIN) {
      return { message: 'Unauthorized' };
    }

    const user = await this.usersService.findOne(+id);
    if (!user) {
      return { message: 'User not found' };
    }
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('profile/me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    const { password, ...result } = user;
    return result;
  }
}
