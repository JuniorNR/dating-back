import { PartialType } from '@nestjs/swagger';
import { CreateAnnouncementCategoryDto } from './create-announcement-category.dto';

export class UpdateAnnouncementCategoryDto extends PartialType(
  CreateAnnouncementCategoryDto,
) {}
