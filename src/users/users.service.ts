import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { compare, genSalt, hash } from 'bcrypt';
import { SearchUsersDto } from './dto/search-user.dto';
import { IUser } from 'src/interfaces/user.interface';
import mongoose from 'mongoose';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { RolesService } from 'src/roles/roles.service';
import { ERole } from 'src/enums/role';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private rolesService: RolesService,
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

  create = async (createUserDto: CreateUserDto, user: IUser) => {
    const isExist = await this.checkUserIsExist(createUserDto.email);

    if (isExist) {
      throw new BadRequestException('User is already exist');
    }

    const hashPassword = await this.hashPassword(createUserDto.password);

    return (
      await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
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
      })
    ).populate('role', 'name');
  };

  findAll = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [users, totalDocuments] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).populate('role', 'name'),
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
    return await this.userModel.findById(id).populate('role', 'name');
  };

  findByEmail = async (email: string) => {
    return (await this.userModel.findOne({ email })).populate('role', 'name');
  };

  update = async (id: string, updateUserDto: UpdateUserDto, user: IUser) => {
    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user.id,
          name: user.name,
          role: user.role,
        },
      },
    );
  };

  remove = async (id: string, user: IUser) => {
    return await this.userModel.delete({ _id: id }, user.id);
  };

  findByRefreshToken = async (refreshToken: string) => {
    return await this.userModel
      .findOne({ refreshToken })
      .populate('role', 'name');
  };

  updateRefreshToken = async (refreshToken: string, _id: string) => {
    return this.userModel.updateOne({ _id }, { refreshToken });
  };

  checkRole = async (id: string, role: mongoose.Schema.Types.ObjectId) => {
    const user = await this.userModel.findOne({ _id: id, role });

    if (user) {
      return true;
    }

    return false;
  };

  register = async (authRegisterDto: AuthRegisterDto) => {
    const { password, username } = authRegisterDto;

    const isUser = await this.checkUserIsExist(username);

    if (isUser) {
      throw new BadRequestException('User is already exist');
    }

    const [defaultRole, hashPassword] = await Promise.all([
      this.rolesService.findByName(ERole.USER),
      this.hashPassword(password),
    ]);

    return (
      await this.userModel.create({
        email: username,
        password: hashPassword,
        name: `name ${Date.now()}`,
        userName: `name name ${Date.now()}`,
        role: defaultRole._id,
      })
    ).populate('role', 'name');
  };
}
