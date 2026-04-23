import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { RolesGuard } from 'src/common/guards/rolesGuard';
import { Roles } from 'src/common/decorators/roles-auth.decorator';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { RemoveUserRoleDto } from './dto/remove-user-role.dto';
import { AddUserBanDto } from './dto/add-user-ban.dto';
import { RemoveUserBanDto } from './dto/remove-user-ban.dto';
import type { AuthenticatedRequest } from 'src/common/types/jwt.types';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create one new user',
  })
  @ApiResponse({
    status: 200,
    description: 'User is created',
    type: UserEntity,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/auth')
  @ApiOperation({
    summary: 'Get auth user',
    description: 'Get auth user',
  })
  @ApiResponse({
    status: 200,
    description: 'Authorized user',
    type: UserEntity,
  })
  getAuth(@Request() request: AuthenticatedRequest) {
    return this.userService.findAuth(request);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all',
    description: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserEntity],
  })
  @Roles('admin', 'super-user')
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({
    summary: 'Get one user by id',
    description: 'Get one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'One user',
    type: UserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({
    summary: 'Update one user by id',
    description: 'Update one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated one user',
    type: UserEntity,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({
    summary: 'Delete one user by id',
    description: 'Delete one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted one user',
    type: UserEntity,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('/add-role')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Add role to user',
    description: 'Add role to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Role added to user',
    type: UserEntity,
  })
  addRole(@Body() addUserRoleDto: AddUserRoleDto) {
    return this.userService.addRole(addUserRoleDto);
  }

  @Post('/remove-role')
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Add role to user',
    description: 'Add role to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Role added to user',
    type: UserEntity,
  })
  removeRole(@Body() removeUserRoleDto: RemoveUserRoleDto) {
    return this.userService.removeRole(removeUserRoleDto);
  }

  @Post('/add-ban')
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Add ban to user',
    description: 'Add ban to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Ban added to user',
    type: UserEntity,
  })
  addBan(@Body() addUserBanDto: AddUserBanDto) {
    return this.userService.addBan(addUserBanDto);
  }

  @Post('/remove-ban')
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Remove ban to user',
    description: 'Remove ban to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Ban removed to user',
    type: UserEntity,
  })
  removeBan(@Body() removeUserBanDto: RemoveUserBanDto) {
    return this.userService.removeBan(removeUserBanDto);
  }
}
