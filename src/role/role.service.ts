import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      .create({
        data: {
          type: createRoleDto.type,
          translations: { create: createRoleDto.translations },
        },
        include: {
          users: {
            omit: { password: true },
          },
          translations: true,
        },
      })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            this.i18n.t('error.roleWithNameAlreadyExists', {
              args: { name: createRoleDto.type },
            }),
          );
        }
        throw error;
      });
  }

  findAll() {
    return this.prisma.role.findMany({
      include: {
        translations: true,
        users: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.role.findFirst({
      where: { id },
      include: {
        translations: true,
        users: true,
      },
    });
  }

  findOneByType(type: string) {
    return this.prisma.role.findFirst({
      where: { type },
      include: {
        translations: true,
        users: true,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma
      .$transaction(async (transaction) => {
        const { translations, ...data } = updateRoleDto;

        await transaction.role.update({
          where: { id },
          data,
        });

        if (translations && translations.length > 0) {
          await Promise.all(
            translations?.map((translation) => {
              return transaction.roleTranslations.upsert({
                where: {
                  locale_roleId: {
                    locale: translation.locale,
                    roleId: id,
                  },
                },
                update: {
                  name: translation.name,
                  locale: translation.locale,
                  description: translation.description,
                },
                create: {
                  roleId: id,
                  name: translation.name,
                  locale: translation.locale,
                  description: translation.description,
                },
              });
            }),
          );
        }

        return transaction.role.findUnique({
          where: { id },
          include: {
            translations: true,
            users: {
              omit: { password: true },
            },
          },
        });
      })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(
            this.i18n.t('error.announcementNotFound', { args: { id } }),
          );
        }

        throw error;
      });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
