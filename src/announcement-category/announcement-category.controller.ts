import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnnouncementCategoryService } from './announcement-category.service';
import { CreateAnnouncementCategoryDto } from './dto/create-announcement-category.dto';
import { UpdateAnnouncementCategoryDto } from './dto/update-announcement-category.dto';
import { AnnouncementCategoryEntity } from './entities/announcement-category.entity';
import { DeleteAnnouncementCategoryResponseDto } from './dto/delete-announcement-category-response.dto';

@ApiTags('Announcement Category')
@Controller('announcement-category')
export class AnnouncementCategoryController {
  constructor(
    private readonly announcementCategoryService: AnnouncementCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create announcement category with translations' })
  @ApiBody({ type: CreateAnnouncementCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: AnnouncementCategoryEntity,
  })
  create(@Body() createAnnouncementCategoryDto: CreateAnnouncementCategoryDto) {
    return this.announcementCategoryService.create(
      createAnnouncementCategoryDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all announcement categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories returned successfully',
    type: [AnnouncementCategoryEntity],
  })
  findAll() {
    return this.announcementCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement category by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Category returned successfully',
    type: AnnouncementCategoryEntity,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.announcementCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update announcement category and translations' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateAnnouncementCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: AnnouncementCategoryEntity,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementCategoryDto: UpdateAnnouncementCategoryDto,
  ) {
    return this.announcementCategoryService.update(
      id,
      updateAnnouncementCategoryDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete announcement category by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    type: DeleteAnnouncementCategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.announcementCategoryService.remove(id);
  }
}
