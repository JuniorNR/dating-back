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
import { DeleteChatDto } from './dto/delete-chat.dto';

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

  @SubscribeMessage('chat:list')
  async handleGetChatList(@ConnectedSocket() client: AppSocket) {
    const { sub } = client.data.user;
    return this.chatService.getUserChats(sub);
  }

  @SubscribeMessage('chat:create')
  async handleCreateChat(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    const { sub } = client.data.user;
    const newChat = await this.chatService.createChat(sub, createChatDto);
    for (const member of newChat.members) {
      this.server.to(`user:${member.id}`).emit('chat:created', newChat);
    }
  }

  @SubscribeMessage('chat:delete')
  async handleDeleteChat(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() deleteChatDto: DeleteChatDto,
  ) {
    const { sub } = client.data.user;
    const memberIds = await this.chatService.getChatMemberIds(
      deleteChatDto.chatId,
    );
    await this.chatService.deleteChat(deleteChatDto.chatId, sub);
    for (const member of memberIds) {
      this.server
        .to(`user:${member}`)
        .emit('chat:deleted', deleteChatDto.chatId);
    }
  }

  // ========================= Chat Room =========================

  @SubscribeMessage('chat:join')
  async handleJoinChat(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() joinChatDto: JoinChatDto,
  ) {
    const { sub } = client.data.user;

    if (!(await this.chatService.isChatMember(joinChatDto.chatId, sub))) return;

    await client.join(`chat:${joinChatDto.chatId}`);

    return { event: 'chat:joined', data: joinChatDto.chatId };
  }

  @SubscribeMessage('chat:leave')
  async handleLeaveChat(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() leaveChatDto: LeaveChatDto,
  ) {
    await client.leave(`chat:${leaveChatDto.chatId}`);
    return { event: 'chat:left', data: leaveChatDto.chatId };
  }

  @SubscribeMessage('chat:messages')
  async handleGetMessages(
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

  @SubscribeMessage('chat:message:send')
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
      .emit('chat:message:new', newMessage);

    const memberIds = await this.chatService.getChatMemberIds(
      sendMessageDto.chatId,
    );

    for (const memberId of memberIds) {
      this.server.to(`user:${memberId}`).emit('chat:list:update', {
        chatId: sendMessageDto.chatId,
        lastMessage: newMessage,
      });
    }
  }

  @SubscribeMessage('chat:message:typing')
  handleTypingMessage(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() typingMessageDto: TypingMessageDto,
  ) {
    const { sub, username } = client.data.user;
    client.to(`chat:${typingMessageDto.chatId}`).emit('chat:message:typing', {
      chatId: typingMessageDto.chatId,
      userId: sub,
      username,
    });
  }
}
