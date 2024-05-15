import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { compare, genSalt, hash } from 'bcrypt';
import { SearchUsersDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  checkUserIsExist = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return true;
    }
    return false;
  };

  isValidPassword = async (password: string, hashPassword: string) =>
    await compare(password, hashPassword);

  hashPassword = async (password: string) => {
    const salt = await genSalt();

    return await hash(password, salt);
  };

  create = async (createUserDto: CreateUserDto) => {
    const isExist = await this.checkUserIsExist(createUserDto.email);

    if (isExist) {
      throw new BadRequestException('User is already exist');
    }

    const hashPassword = await this.hashPassword(createUserDto.password);

    return await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });
  };

  findAll = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [users, totalDocuments] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit),
      this.userModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    return { users, totalPages, currentPage: page, limit };
  };

  findByField = async (query: SearchUsersDto) => {
    if (!Object.keys(query).length) {
      return await this.findAll(1, 10);
    }

    return await this.userModel.find({
      $or: Object.keys(query).map((key) => ({
        [key]: { $regex: new RegExp(query[key], 'i') },
      })),
    });
  };

  findOne = async (id: string) => {
    return await this.userModel.findById(id);
  };

  findByEmail = async (email: string) => {
    return await this.userModel.findOne({ email });
  };

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    return await this.userModel.updateOne({ _id: id }, updateUserDto);
  };

  remove = async (id: string) => {
    return await this.userModel.delete({ _id: id });
  };

  findByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };

  updateRefreshToken = async (refreshToken: string, _id: string) => {
    return this.userModel.updateOne({ _id }, { refreshToken });
  };

  checkRole = async (id: string, role: string) => {
    const user = await this.userModel.findOne({ _id: id, role });

    if (user) {
      return true;
    }

    return false;
  };
}
