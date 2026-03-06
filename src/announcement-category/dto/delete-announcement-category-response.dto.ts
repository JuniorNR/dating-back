import { PickType } from '@nestjs/swagger';
import { AnnouncementCategoryEntity } from '../entities/announcement-category.entity';

export class DeleteAnnouncementCategoryResponseDto extends PickType(
  AnnouncementCategoryEntity,
  ['id', 'type', 'createdAt', 'updatedAt'] as const,
) {}
