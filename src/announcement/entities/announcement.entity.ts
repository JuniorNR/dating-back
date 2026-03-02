import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { AnnouncementCategoryEntity } from 'src/announcement-category/entities/announcement-category.entity';

export class AnnouncementEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'I want to find a woman' })
  title: string;

  @ApiProperty({ example: 'Im 20 y.o. and i have a nice car' })
  content: string;

  @ApiProperty({ type: () => UserEntity })
  author: UserEntity;

  @ApiProperty({ example: 1 })
  authorId: number;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ type: () => AnnouncementCategoryEntity })
  category: AnnouncementCategoryEntity;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  updatedAt: Date;
}
