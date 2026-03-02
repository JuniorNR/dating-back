import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEntity } from 'src/role/entities/role.entity';

class UserAnnouncementEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 1, description: 'Category id' })
  categoryId: number;

  @ApiProperty({ example: 1, description: 'Author id' })
  authorId: number;

  @ApiProperty({ example: '2026-03-02T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-02T12:00:00.000Z', nullable: true })
  updatedAt: Date | null;
}

export class UserEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username (Not BIO)' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of user' })
  email: string;

  @ApiProperty({ example: false, description: 'User is banned or not' })
  banned: boolean;

  @ApiPropertyOptional({ example: 'Spam', description: 'Reason for ban' })
  banReason?: string;

  @ApiProperty({
    type: () => [UserAnnouncementEntity],
    description: 'Announcements list of user',
  })
  announcements: UserAnnouncementEntity[];

  @ApiProperty({
    type: () => [RoleEntity],
    description: 'Announcements list of user',
  })
  roles: RoleEntity[];

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  updatedAt: Date;
}
