import { Injectable } from '@nestjs/common';
import { CreateAnnouncementCategoryDto } from './dto/create-announcement-category.dto';
import { UpdateAnnouncementCategoryDto } from './dto/update-announcement-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnnouncementCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAnnouncementCategoryDto: CreateAnnouncementCategoryDto) {
    return this.prisma.announcementCategory.create({
      data: {
        type: createAnnouncementCategoryDto.type,
        translations: {
          create: createAnnouncementCategoryDto.translations,
        },
      },
      include: {
        translations: true,
      },
    });
  }

  findAll() {
    return this.prisma.announcementCategory.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.announcementCategory.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });
  }

  update(
    id: number,
    updateAnnouncementCategoryDto: UpdateAnnouncementCategoryDto,
  ) {
    const { translations, ...baseData } = updateAnnouncementCategoryDto;

    return this.prisma.$transaction(async (transaction) => {
      const updatedCategory = await transaction.announcementCategory.update({
        where: { id },
        data: baseData,
      });

      if (translations && translations.length > 0) {
        await Promise.all(
          translations.map((translation) =>
            transaction.announcementCategoryTranslation.upsert({
              where: {
                categoryId_locale: {
                  categoryId: id,
                  locale: translation.locale,
                },
              },
              update: {
                title: translation.title,
                description: translation.description,
              },
              create: {
                categoryId: id,
                locale: translation.locale,
                title: translation.title,
                description: translation.description,
              },
            }),
          ),
        );
      }

      return transaction.announcementCategory.findUnique({
        where: { id: updatedCategory.id },
        include: {
          translations: true,
        },
      });
    });
  }

  remove(id: number) {
    return this.prisma.announcementCategory.delete({
      where: { id },
    });
  }
}
