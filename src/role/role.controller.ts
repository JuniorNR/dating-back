import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';
import { RolesGuard } from 'src/common/guards/rolesGuard';
import { Roles } from 'src/common/decorators/roles-auth.decorator';

@Roles('admin', 'super-user')
@UseGuards(RolesGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new role',
    description: 'Create one new role',
  })
  @ApiResponse({
    status: 201,
    description: 'User is created',
    type: RoleEntity,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all roles',
    description: 'Find all roles',
  })
  @ApiResponse({
    status: 201,
    description: 'Roles is found',
    type: [RoleEntity],
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Find role by type',
    description: 'Find role by type',
  })
  @ApiResponse({
    status: 200,
    description: 'Role is found',
    type: RoleEntity,
  })
  findOneByType(@Query('type') type: string) {
    return this.roleService.findOneByType(type);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find role by id',
    description: 'Find role by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Role is found',
    type: RoleEntity,
  })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update role by id',
    description: 'Update role by id',
  })
  @ApiResponse({
    status: 201,
    description: 'Role is updated',
    type: RoleEntity,
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete role by id',
    description: 'Delete role by id',
  })
  @ApiResponse({
    status: 201,
    description: 'Role is deleted',
    type: RoleEntity,
  })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
