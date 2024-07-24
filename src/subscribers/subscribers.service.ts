import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Subscriber } from 'rxjs';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SubscriberDocument } from './schemas/subscriber.schema';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: userMetadata,
      updatedBy: userMetadata,
    });
  }

  async findAll() {
    return await this.subscriberModel.find();
  }

  async findOne(id: string) {
    return await this.subscriberModel.findById(id);
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        updatedBy: userMetadata,
      },
    );
  }

  async remove(id: string, user: IUser) {
    return await this.subscriberModel.delete({ _id: id }, user.id);
  }
}
