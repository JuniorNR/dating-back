import { ApiProperty } from '@nestjs/swagger';
import { AnnouncementCategoryEntity } from 'src/announcement-category/entities/announcement-category.entity';

class AnnouncementAuthorEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  email: string;
}

export class AnnouncementTranslationsEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 'en' })
  locale: string;

  @ApiProperty({ example: 'Community' })
  title: string;

  @ApiProperty({ example: 'Typing and dating' })
  content: string;

  @ApiProperty({ example: '2026-03-02T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-02T12:00:00.000Z', nullable: true })
  updatedAt: Date | null;
}

export class AnnouncementEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({
    type: () => AnnouncementCategoryEntity,
    description: 'Category of announcement',
  })
  category: AnnouncementCategoryEntity;

  @ApiProperty({ example: 1, description: 'Category id' })
  categoryId: number;

  @ApiProperty({
    type: () => AnnouncementAuthorEntity,
    description: 'Author of announcement',
  })
  author: AnnouncementAuthorEntity;

  @ApiProperty({ example: 1, description: 'Author id' })
  authorId: number;

  @ApiProperty({
    type: () => [AnnouncementTranslationsEntity],
    description: 'Announcement translations',
  })
  translations: AnnouncementTranslationsEntity[];

  @ApiProperty({
    example: '2026-03-02T10:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-02T12:00:00.000Z',
    description: 'Updated at',
    nullable: true,
  })
  updatedAt: Date | null;
}
