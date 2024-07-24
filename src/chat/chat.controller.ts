import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'create new chat',
  })
  async createChat(@Body() createChatDto: CreateChatDto, @User() user: IUser) {
    return await this.chatService.create(createChatDto, user);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get Messages For User',
  })
  @ApiQuery({ name: 'receiver', required: false, type: String })
  async getMessagesForUser(@Query('receiver') receiver: string, @User() user: IUser) {
    const sender = user.id;
    return await this.chatService.getMessagesForUser(sender, receiver);
  }
}
