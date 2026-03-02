import { ApiProperty } from '@nestjs/swagger';

class AnnouncementCategoryTranslationEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ru' })
  locale: string;

  @ApiProperty({ example: 'Сообщество' })
  title: string;

  @ApiProperty({ example: 'Общение и знакомства' })
  description: string;
}

export class AnnouncementCategoryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'community' })
  type: string;

  @ApiProperty({ type: () => [AnnouncementCategoryTranslationEntity] })
  translations: AnnouncementCategoryTranslationEntity[];
}
