import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(creatorId: number, dto: CreateChatDto) {
    const allMemberIds = [...new Set([creatorId, ...dto.memberIds])];

    const newChat = await this.prisma.chat.create({
      data: {
        members: { connect: allMemberIds.map((id) => ({ id })) },
      },
      include: {
        members: { select: { id: true, username: true } },
      },
    });

    return newChat;
  }

  async getUserChats(userId: number) {
    return await this.prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        members: { select: { id: true, username: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, username: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(
    chatId: number,
    userId: number,
    cursor?: number,
    limit = 50,
  ) {
    await this.assertMembership(chatId, userId);

    return await this.prisma.chatMessage.findMany({
      where: {
        chatId,
      },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    });
  }

  async createMessage(chatId: number, authorId: number, text: string) {
    await this.assertMembership(chatId, authorId);

    const [message] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: { chatId, authorId, text },
        include: { author: true },
      }),
      this.prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  async getChatMemberIds(chatId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: { members: { select: { id: true } } },
    });

    return chat?.members.map((member) => member.id) ?? [];
  }

  async isChatMember(chatId: number, userId: number): Promise<boolean> {
    const count = await this.prisma.chat.count({
      where: { id: chatId, members: { some: { id: userId } } },
    });
    return count > 0;
  }

  private async assertMembership(chatId: number, userId: number) {
    if (!(await this.isChatMember(chatId, userId))) {
      throw new ForbiddenException(this.i18n.t('error.userIsNotChatMember'));
    }
  }
}
