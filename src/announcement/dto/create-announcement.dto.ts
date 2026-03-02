import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateAnnouncementTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiProperty({ example: 'Be careful, working scammers!' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Scammers can sit under the guise of another person and easily mislead you.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateAnnouncementDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  authorId: number;

  @ApiProperty({
    type: [CreateAnnouncementTranslationDto],
    example: [
      {
        locale: 'ru',
        title: 'Информация о грядущих обновления',
        content: 'Их пока что не будет',
      },
      {
        locale: 'en',
        title: 'Information about updates',
        content: 'Nothing',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAnnouncementTranslationDto)
  translations: CreateAnnouncementTranslationDto[];
}
