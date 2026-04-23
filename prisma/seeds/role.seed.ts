import { PrismaClient } from '@prisma/client';

export const seedRoles = async (prisma: PrismaClient) => {
  const rolesData = [
    {
      type: 'user',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'User',
            description: 'Default role with basic permissions',
          },
          {
            locale: 'ru',
            name: 'Пользователь',
            description: 'Базовая роль с ограниченными правами',
          },
        ],
      },
    },
    {
      type: 'admin',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Admin',
            description: 'Can manage content and users',
          },
          {
            locale: 'ru',
            name: 'Администратор',
            description: 'Может управлять контентом и пользователями',
          },
        ],
      },
    },
    {
      type: 'super-user',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Super User',
            description: 'Full access to all features',
          },
          {
            locale: 'ru',
            name: 'Суперпользователь',
            description: 'Полный доступ ко всем функциям',
          },
        ],
      },
    },
  ];
  for (const roleData of rolesData) {
    await prisma.role.upsert({
      where: { type: roleData.type },
      update: {},
      create: roleData,
    });
  }
};
