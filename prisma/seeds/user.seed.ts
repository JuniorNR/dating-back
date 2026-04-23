import { PrismaClient } from '@prisma/client';

export const seedUsers = async (prisma: PrismaClient) => {
  const usersData = [
    {
      username: 'admin',
      email: 'admin@mail.ru',
      password: '$2b$10$wTEv82U9UDzFVmsjYywKBe6kX8v9F2LjvuGB3FolnolGDEF4h.Z0O',
      roles: {
        connect: {
          type: 'admin',
        },
      },
    },
    {
      username: 'user',
      email: 'user@mail.ru',
      password: '$2b$10$wTEv82U9UDzFVmsjYywKBe6kX8v9F2LjvuGB3FolnolGDEF4h.Z0O',
      roles: {
        connect: {
          type: 'user',
        },
      },
    },
    {
      username: 'PuffDiddy56',
      email: 'PuffDiddy56@mail.ru',
      password: '$2b$10$wTEv82U9UDzFVmsjYywKBe6kX8v9F2LjvuGB3FolnolGDEF4h.Z0O',
      roles: {
        connect: {
          type: 'super-user',
        },
      },
    },
  ];

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        email: userData.email,
        password: userData.password,
        roles: { connect: { type: userData.roles.connect.type } },
      },
      create: userData,
    });
  }
};
