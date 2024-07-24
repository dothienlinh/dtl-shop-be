import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { IUser } from 'src/common/interfaces/user.interface';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { receiverId: string; content: string; user: IUser }) {
    const { content, receiverId, user } = data;
    const messages = await this.chatService.create({ message: content, receiver: receiverId }, user);
    this.server.emit('receiveMessage', messages);
  }
}
