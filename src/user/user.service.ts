import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { AddUserBanDto } from './dto/add-user-ban.dto';
import { RemoveUserBanDto } from './dto/remove-user-ban.dto';
import type { AuthenticatedRequest } from 'src/common/types/jwt.types';
import * as bcrypt from 'bcryptjs';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.prisma.role.findFirst({
      where: { type: 'user' },
    });

    if (role === null) {
      throw new HttpException(
        this.i18n.t('error.roleUserIsNotDefined'),
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        roles: {
          connect: {
            id: role.id,
          },
        },
      },
      include: {
        announcements: true,
        roles: true,
      },
    });
    return newUser;
  }

  findAuth(request: AuthenticatedRequest) {
    return this.prisma.user.findFirst({
      where: { id: request.user.sub },
      include: { roles: true, announcements: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        announcements: true,
        roles: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      include: { roles: true, announcements: true },
    });
  }

  findOneByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username },
      include: { roles: true },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: { roles: true },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = this.prisma.user.update({
      where: { id },
      include: { roles: true },
      data: updateUserDto,
    });
    return updatedUser;
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id }, omit: { password: true } });
  }

  async addRole(addUserRoleDto: AddUserRoleDto) {
    const foundRole = await this.prisma.role.findFirst({
      where: {
        id: addUserRoleDto.roleId,
      },
    });

    if (!foundRole) {
      throw new HttpException(
        this.i18n.t('error.roleNotFound'),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.user.update({
      where: { id: addUserRoleDto.userId },
      data: {
        roles: {
          connect: { id: addUserRoleDto.roleId },
        },
      },
      omit: { password: true },
      include: {
        roles: true,
        announcements: true,
      },
    });
  }

  async removeRole(addUserRoleDto: AddUserRoleDto) {
    return this.prisma.user.update({
      where: { id: addUserRoleDto.userId },
      data: {
        roles: {
          disconnect: { id: addUserRoleDto.roleId },
        },
      },
      omit: { password: true },
      include: {
        roles: true,
        announcements: true,
      },
    });
  }

  async addBan(addUserBanDto: AddUserBanDto) {
    return await this.prisma.user.update({
      where: { id: addUserBanDto.userId },
      data: {
        banned: true,
        banReason: addUserBanDto.reason,
      },
      omit: { password: true },
    });
  }

  async removeBan(removeUserBanDto: RemoveUserBanDto) {
    return await this.prisma.user.update({
      where: { id: removeUserBanDto.userId },
      data: {
        banned: false,
        banReason: null,
      },
      omit: { password: true },
    });
  }
}
