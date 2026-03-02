import { PrismaClient } from '@prisma/client';

export const seedUsers = (prisma: PrismaClient) => {
  return prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@mail.ru',
        password:
          '$2b$10$J/9c9JmgP0x5AWmpi7bkoeFasuldUVRsIGfOM.7PogiKmpQgHcncm',
      },
      {
        username: 'user',
        email: 'user@mail.ru',
        password:
          '$2b$10$J/9c9JmgP0x5AWmpi7bkoeFasuldUVRsIGfOM.7PogiKmpQgHcncm',
      },
      {
        username: 'PuffDiddy56',
        email: 'PuffDiddy56@mail.ru',
        password:
          '$2b$10$J/9c9JmgP0x5AWmpi7bkoeFasuldUVRsIGfOM.7PogiKmpQgHcncm',
      },
    ],
    skipDuplicates: true,
  });
};
