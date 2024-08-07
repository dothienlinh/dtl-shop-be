import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: SoftDeleteModel<ChatDocument>) {}

  async create(createChatDto: CreateChatDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.chatModel.create({
      ...createChatDto,
      sender: user.id,
      createdBy: userMetadata,
      updatedBy: userMetadata,
    });
  }

  async getMessagesForUser(sender: string, receiver: string) {
    return await this.chatModel
      .find()
      .where({ sender, receiver })
      .populate({ path: 'receiver', select: ['avatar', 'name', 'userName'] });
  }
}
