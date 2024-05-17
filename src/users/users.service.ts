import { compareSync, genSalt, hash as bcryptHash } from 'bcrypt';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/types/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt();
    const hash = await bcryptHash(password, salt);

    return hash;
  };

  isValidPassword = (password: string, hash: string) => {
    return compareSync(password, hash);
  };

  isExisting = async (email: string) => {
    const user = await this.userModel.findOne({ email });

    return !!user;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { password, email } = createUserDto;
    const hashPassword = await this.getHashPassword(password);

    if (await this.isExisting(email)) {
      throw new BadGatewayException('Email already exists');
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort, projection, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const totalItem = (await this.userModel.find(filter)).length;
    const totalPage = Math.ceil(totalItem / limit);

    const data = await this.userModel
      .find(filter)
      .skip(offset < 0 ? 0 : offset)
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec();

    return {
      data,
      totalItem,
      totalPage,
      currentPage,
      limit,
    };
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username,
    });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const { _id } = updateUserDto;

    return await this.userModel.updateOne(
      { _id: _id },
      { ...updateUserDto, updatedBy: { _id: user._id, email: user.email } },
    );
  }

  async remove(id: string, deleteById: string) {
    return await this.userModel.delete({ _id: id }, deleteById);
  }

  async restore(id: string) {
    return await this.userModel.restore({ _id: id });
  }

  getAllDeleted = async () => {
    return await this.userModel.findDeleted();
  };

  register = async (registerUserDto: RegisterUserDto) => {
    const { email, password } = registerUserDto;

    if (await this.isExisting(email)) {
      throw new BadGatewayException('Email already exists');
    }

    const passwordHash = await this.getHashPassword(password);
    return await this.userModel.create({
      ...registerUserDto,
      password: passwordHash,
      role: 'user',
    });
  };

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
