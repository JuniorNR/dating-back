import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.prisma.role
      .create({ data: createRoleDto })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            this.i18n.t('error.roleWithNameAlreadyExists', {
              args: { name: createRoleDto.name },
            }),
          );
        }

        throw error;
      });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.prisma.role.findFirst({
      where: { id },
    });
  }

  findOneByType(type: string) {
    return this.prisma.role.findFirst({
      where: { type },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role.update({ where: { id }, data: updateRoleDto });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
