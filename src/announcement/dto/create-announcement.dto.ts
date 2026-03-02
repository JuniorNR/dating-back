import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 'I want to find a woman',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Im 20 y.o. and i have a nice car',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  authorId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}
