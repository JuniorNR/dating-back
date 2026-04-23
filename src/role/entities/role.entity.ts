import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

export class RoleTranslationsEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 1, description: 'Unique id of role' })
  roleId: number;

  @ApiProperty({ example: 'en' })
  locale: string;

  @ApiProperty({ example: 'user', description: 'Unique name of role' })
  name: string;

  @ApiProperty({
    example: 'Role user is default role of our project',
    description: 'Description about role',
  })
  description: string;
}

export class RoleEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({
    example: 'user',
    description: 'Unique type of role like a name',
  })
  type: string;

  @ApiProperty({
    type: () => [UserEntity],
    description: 'All users, who have this role',
  })
  users: UserEntity[];

  @ApiProperty({
    type: () => [RoleTranslationsEntity],
    description: 'Role translations',
  })
  translations: RoleTranslationsEntity[];

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  updatedAt: Date;
}
