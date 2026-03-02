import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateAnnouncementCategoryTranslationDto {
  @ApiProperty({ example: 'ru' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiProperty({ example: 'Сообщество' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Общение и знакомства' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateAnnouncementCategoryDto {
  @ApiProperty({ example: 'community' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: [CreateAnnouncementCategoryTranslationDto],
    example: [
      {
        locale: 'ru',
        title: 'Сообщество',
        description: 'Общение и знакомства',
      },
      {
        locale: 'en',
        title: 'Community',
        description: 'Communication and dating',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAnnouncementCategoryTranslationDto)
  translations: CreateAnnouncementCategoryTranslationDto[];
}
