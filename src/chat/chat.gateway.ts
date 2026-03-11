import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Namespace, Server } from 'socket.io';
import type { AppSocket } from 'src/common/types/ws.types';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { LeaveChatDto } from './dto/leave-chat.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { TypingMessageDto } from './dto/typing-message.dto';

@WebSocketGateway(Number(process.env['WEBSOCKET_PORT']) || 3002, {
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  namespace: Namespace;

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log(`[WS][chat][initialization]`);
  }

  async handleConnection(client: AppSocket) {
    const { sub, username } = client.data.user;
    await client.join(`user:${sub}`);

    console.log(
      `[WS][chat][connected]: user[id:${sub} username:${username}], socket=${client.id}`,
    );
  }

  handleDisconnect(client: AppSocket) {
    const { sub, username } = client.data.user;
    client.disconnect();
    console.log(
      `[WS][chat][disconnected]: user[id:${sub} username:${username}], socket=${client.id}`,
    );
  }

  // ========================= Chat List =========================

  @SubscribeMessage('getChats')
  async handleGetChat(@ConnectedSocket() client: AppSocket) {
    const { sub } = client.data.user;
    return this.chatService.getUserChats(sub);
  }

  @SubscribeMessage('createChat')
  async create(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    const { sub } = client.data.user;
    const newChat = await this.chatService.create(sub, createChatDto);
    for (const member of newChat.members) {
      this.server.to(`user:${member.id}`).emit('chatCreated', newChat);
    }
  }

  // ========================= Chat Room =========================

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() joinChatDto: JoinChatDto,
  ) {
    const { sub } = client.data.user;

    if (!(await this.chatService.isChatMember(joinChatDto.chatId, sub))) return;

    await client.join(`chat:${joinChatDto.chatId}`);

    return { event: 'joinedChat', data: joinChatDto.chatId };
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() leaveChatDto: LeaveChatDto,
  ) {
    await client.leave(`chat:${leaveChatDto.chatId}`);
    return { event: 'leftChat', data: leaveChatDto.chatId };
  }

  @SubscribeMessage('getMessages')
  async handleGetMessage(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() getMessagesDto: GetMessagesDto,
  ) {
    const { sub } = client.data.user;

    return this.chatService.getMessages(
      getMessagesDto.chatId,
      sub,
      getMessagesDto.cursor,
      getMessagesDto.limit,
    );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    const { sub } = client.data.user;
    const newMessage = await this.chatService.createMessage(
      sendMessageDto.chatId,
      sub,
      sendMessageDto.text,
    );

    this.server
      .to(`chat:${sendMessageDto.chatId}`)
      .emit('newMessage', newMessage);

    const memberIds = await this.chatService.getChatMemberIds(
      sendMessageDto.chatId,
    );

    for (const memberId of memberIds) {
      this.server.to(`user:${memberId}`).emit('chatListUpdate', {
        chatId: sendMessageDto.chatId,
        lastMessage: newMessage,
      });
    }
  }

  @SubscribeMessage('typingMessage')
  handleTyping(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() typingMessageDto: TypingMessageDto,
  ) {
    const { sub, username } = client.data.user;
    client.to(`chat:${typingMessageDto.chatId}`).emit('userTypingMessage', {
      chatId: typingMessageDto.chatId,
      userId: sub,
      username,
    });
  }
}
