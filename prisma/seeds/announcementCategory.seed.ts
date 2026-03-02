import { PrismaClient } from '@prisma/client';

export const seedAnnouncementCategory = async (prisma: PrismaClient) => {
  const communityCategory = await prisma.announcementCategory.upsert({
    where: { type: 'community' },
    update: {},
    create: {
      type: 'community',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: communityCategory.id,
        locale: 'ru',
      },
    },
    update: {
      title: 'Сообщество',
      description: 'Общение и знакомства',
    },
    create: {
      categoryId: communityCategory.id,
      locale: 'ru',
      title: 'Сообщество',
      description: 'Общение и знакомства',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: communityCategory.id,
        locale: 'en',
      },
    },
    update: {
      title: 'Community',
      description: 'Communication and dating',
    },
    create: {
      categoryId: communityCategory.id,
      locale: 'en',
      title: 'Community',
      description: 'Communication and dating',
    },
  });

  const safetyCategory = await prisma.announcementCategory.upsert({
    where: { type: 'safety' },
    update: {},
    create: {
      type: 'safety',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: safetyCategory.id,
        locale: 'ru',
      },
    },
    update: {
      title: 'Безопасность',
      description: 'Советы по безопасности',
    },
    create: {
      categoryId: safetyCategory.id,
      locale: 'ru',
      title: 'Безопасность',
      description: 'Советы по безопасности',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: safetyCategory.id,
        locale: 'en',
      },
    },
    update: {
      title: 'Safety',
      description: 'Safety tips and guidance',
    },
    create: {
      categoryId: safetyCategory.id,
      locale: 'en',
      title: 'Safety',
      description: 'Safety tips and guidance',
    },
  });

  const eventCategory = await prisma.announcementCategory.upsert({
    where: { type: 'event' },
    update: {},
    create: {
      type: 'event',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: eventCategory.id,
        locale: 'ru',
      },
    },
    update: {
      title: 'События',
      description: 'Мероприятия и встречи',
    },
    create: {
      categoryId: eventCategory.id,
      locale: 'ru',
      title: 'События',
      description: 'Мероприятия и встречи',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: eventCategory.id,
        locale: 'en',
      },
    },
    update: {
      title: 'Event',
      description: 'Events and meetups',
    },
    create: {
      categoryId: eventCategory.id,
      locale: 'en',
      title: 'Event',
      description: 'Events and meetups',
    },
  });

  const infoCategory = await prisma.announcementCategory.upsert({
    where: { type: 'info' },
    update: {},
    create: {
      type: 'info',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: infoCategory.id,
        locale: 'ru',
      },
    },
    update: {
      title: 'Информация',
      description: 'Полезная информация и рекомендации',
    },
    create: {
      categoryId: infoCategory.id,
      locale: 'ru',
      title: 'Информация',
      description: 'Полезная информация и рекомендации',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: infoCategory.id,
        locale: 'en',
      },
    },
    update: {
      title: 'Info',
      description: 'Useful information and recommendations',
    },
    create: {
      categoryId: infoCategory.id,
      locale: 'en',
      title: 'Info',
      description: 'Useful information and recommendations',
    },
  });

  const updateCategory = await prisma.announcementCategory.upsert({
    where: { type: 'update' },
    update: {},
    create: {
      type: 'update',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: updateCategory.id,
        locale: 'ru',
      },
    },
    update: {
      title: 'Обновления',
      description: 'Новости и обновления платформы',
    },
    create: {
      categoryId: updateCategory.id,
      locale: 'ru',
      title: 'Обновления',
      description: 'Новости и обновления платформы',
    },
  });

  await prisma.announcementCategoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: updateCategory.id,
        locale: 'en',
      },
    },
    update: {
      title: 'Update',
      description: 'Platform news and updates',
    },
    create: {
      categoryId: updateCategory.id,
      locale: 'en',
      title: 'Update',
      description: 'Platform news and updates',
    },
  });
};
