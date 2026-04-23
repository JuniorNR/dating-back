import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsLocale,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateRoleTranslationsDto {
  @ApiProperty({
    example: 'en',
  })
  @IsNotEmpty()
  @IsLocale()
  @Length(2, 3)
  locale: string;
  @ApiProperty({
    example: 'User',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  name: string;
  @ApiProperty({
    example: 'User is default role of our project',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  description: string;
}

export class CreateRoleDto {
  @ApiProperty({ example: 'user', description: 'Unique role type identifier' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: () => [CreateRoleTranslationsDto],
    description: 'Translations for the role',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleTranslationsDto)
  translations: CreateRoleTranslationsDto[];
}
