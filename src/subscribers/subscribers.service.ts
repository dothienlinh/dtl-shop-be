import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SoftDeleteModel } from 'mongoose-delete';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { SubscriberDocument } from './schemas/subscriber.schema';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    return await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user.id,
        name: user.name,
        role: user.role,
      },
      updatedBy: {
        _id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  }

  async findAll() {
    return await this.subscriberModel.find();
  }

  async findOne(id: string) {
    return await this.subscriberModel.findById(id);
  }

  async update(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
    user: IUser,
  ) {
    return await this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user.id,
          name: user.name,
          role: user.role,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    return await this.subscriberModel.delete({ _id: id }, user.id);
  }
}
