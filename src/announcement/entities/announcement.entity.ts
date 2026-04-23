import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AnnouncementCategoryEntity } from 'src/announcement-category/entities/announcement-category.entity';
import { UserEntity } from 'src/user/entities/user.entity';

class AnnouncementAuthorEntity extends OmitType(UserEntity, [
  'announcements',
] as const) {}

export class AnnouncementTranslationsEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 'en' })
  locale: string;

  @ApiProperty({ example: 'Community' })
  title: string;

  @ApiProperty({ example: 'Typing and dating' })
  content: string;
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
