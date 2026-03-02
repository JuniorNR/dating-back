import { PickType } from '@nestjs/swagger';
import { AnnouncementEntity } from '../entities/announcement.entity';

export class DeleteAnnouncementResponseDto extends PickType(
  AnnouncementEntity,
  ['id', 'categoryId', 'authorId', 'createdAt', 'updatedAt'] as const,
) {}
