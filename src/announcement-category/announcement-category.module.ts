import { Module } from '@nestjs/common';
import { AnnouncementCategoryService } from './announcement-category.service';
import { AnnouncementCategoryController } from './announcement-category.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AnnouncementCategoryController],
  providers: [AnnouncementCategoryService, PrismaService],
})
export class AnnouncementCategoryModule {}
