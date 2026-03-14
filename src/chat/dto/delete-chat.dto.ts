import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteChatDto {
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Chat id' })
  chatId: number;
}
