import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  create(createAnnouncementDto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        authorId: createAnnouncementDto.authorId,
        categoryId: createAnnouncementDto.categoryId,
        translations: {
          create: createAnnouncementDto.translations,
        },
      },
      include: {
        author: { omit: { password: true } },
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
      },
    });
  }

  findAll() {
    return this.prisma.announcement.findMany({
      include: {
        translations: true,
        author: { omit: { password: true } },
        category: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.announcement.findUnique({
      where: { id },
      include: {
        translations: true,
        author: { omit: { password: true } },
        category: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.prisma
      .$transaction(async (transaction) => {
        const { translations, ...data } = updateAnnouncementDto;
        const updatedAnnouncement = await transaction.announcement.update({
          where: { id },
          data,
        });

        if (translations && translations.length > 0) {
          await Promise.all(
            translations.map((translation) => {
              return transaction.announcementTranslations.upsert({
                where: {
                  announcementId_locale: {
                    announcementId: id,
                    locale: translation.locale,
                  },
                },
                update: {
                  title: translation.title,
                  content: translation.content,
                },
                create: {
                  announcementId: id,
                  locale: translation.locale,
                  title: translation.title,
                  content: translation.content,
                },
              });
            }),
          );
        }

        return transaction.announcement.findUnique({
          where: { id: updatedAnnouncement.id },
          include: {
            translations: true,
            author: { omit: { password: true } },
            category: {
              include: {
                translations: true,
              },
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
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
