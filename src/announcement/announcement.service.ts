import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  findAll() {
    return this.prisma.announcement.findMany({
      include: {
        author: true,
        category: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  create(dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        ...dto,
        categoryId: dto.categoryId,
      },
      include: {
        author: true,
        category: {
          include: {
            translations: true,
          },
        },
      },
    });
  }
}
