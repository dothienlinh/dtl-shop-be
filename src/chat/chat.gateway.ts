import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit() {
    console.log('Init');
  }

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;

    if (authHeader) {
      try {
        const [data, messages] = await Promise.all([
          this.authService.handleVerifyToken(authHeader),
          this.chatService.findAll(),
        ]);

        client.data = data;

        client.join(client.data.email);
        client.emit('allMessages', messages);
        console.log('connect success', client.data.email);
      } catch (e) {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() message: string) {
    // await this.chatService.create({ username: '', message });
    console.log();
    this.server.to(socket.data.email).emit('message', message);
  }
}
