import { ApiProperty } from '@nestjs/swagger';

class AnnouncementCategoryTranslationEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'en' })
  locale: string;

  @ApiProperty({ example: 'Community' })
  title: string;

  @ApiProperty({ example: 'Typing and dating' })
  description: string;

  @ApiProperty({ example: '2026-03-02T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-02T12:00:00.000Z', nullable: true })
  updatedAt: Date | null;
}

export class AnnouncementCategoryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'community' })
  type: string;

  @ApiProperty({ type: () => [AnnouncementCategoryTranslationEntity] })
  translations: AnnouncementCategoryTranslationEntity[];

  @ApiProperty({ example: '2026-03-02T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-02T12:00:00.000Z', nullable: true })
  updatedAt: Date | null;
}
