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
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnnouncementEntity } from './entities/announcement.entity';
import { DeleteAnnouncementResponseDto } from './dto/delete-announcement-response.dto';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  @ApiOperation({
    summary: 'Create announcement',
    description: 'Create announcement',
  })
  @ApiResponse({
    status: 201,
    description: 'Announcement is created',
    type: AnnouncementEntity,
  })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all announcements',
    description: 'Get all announcements',
  })
  @ApiResponse({
    status: 200,
    description: 'Announcements are found',
    type: [AnnouncementEntity],
  })
  findAll() {
    return this.announcementService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one announcement by id',
    description: 'Get one announcement by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Announcement is found',
    type: AnnouncementEntity,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update announcement by id',
    description: 'Update announcement by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Announcement is updated',
    type: AnnouncementEntity,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete announcement by id',
    description: 'Delete announcement by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Announcement is deleted',
    type: DeleteAnnouncementResponseDto,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.remove(id);
  }
}
