import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { compare, genSalt, hash } from 'bcrypt';
import { SearchUsersDto } from './dto/search-user.dto';
import mongoose from 'mongoose';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { RolesService } from 'src/roles/roles.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { ERole } from 'src/common/enums/role';

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

  isValidPassword = async (password: string, hashPassword: string) => await compare(password, hashPassword);

  hashPassword = async (password: string) => {
    const salt = await genSalt();

    return await hash(password, salt);
  };

  create = async (createUserDto: CreateUserDto, user: IUser) => {
    const isExist = await this.checkUserIsExist(createUserDto.email);

    if (isExist) {
      throw new BadRequestException('User is already exist');
    }

    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };
    const password = await this.hashPassword(createUserDto.password);

    const createdUser = await this.userModel.create({
      ...createUserDto,
      password,
      createdBy: userMetadata,
      updatedBy: userMetadata,
    });

    createdUser.populate('role', 'name');

    return true;
  };

  findAll = async (page: number, limit: number, roles: ERole[]) => {
    const skip = (page - 1) * limit;
    const roleIds = await this.rolesService.getIdByNames([...roles]);

    const [users, totalDocuments] = await Promise.all([
      this.userModel
        .find()
        .in('role', roleIds)
        .skip(skip)
        .limit(limit)
        .populate('role', 'name')
        .select('-refreshToken -password -deleted -createdAt -updatedAt'),
      this.userModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    return { users, totalPages, currentPage: page, limit, total: totalDocuments };
  };

  findByField = async (query: SearchUsersDto, page: number, limit: number) => {
    const roles = query.role;
    const skip = (page - 1) * limit;

    if (!Object.keys(query).length) {
      return await this.findAll(1, 10, roles);
    }

    const roleIds = await this.rolesService.getIdByNames([...roles]);

    const arrayQuery = Object.keys(query).map((key) => {
      if (Array.isArray(query[key])) {
        return { [key]: query[key].map((_, index) => roleIds[index]) };
      }

      if (key === '_id') {
        return { [key]: query[key] };
      }

      return { [key]: { $regex: new RegExp(query[key], 'i') } };
    });

    const [users, totalDocuments] = await Promise.all([
      this.userModel
        .find({
          $and: arrayQuery,
        })
        .skip(skip)
        .limit(limit)
        .populate('role', 'name')
        .select('-refreshToken -password -deleted -createdAt -updatedAt'),
      this.userModel
        .find({
          $and: arrayQuery,
        })
        .countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    return { users, totalPages, currentPage: page, limit, total: totalDocuments };
  };

  findOne = async (id: string) => {
    return await this.userModel.findById(id).populate('role', 'name');
  };

  findByEmail = async (email: string) => {
    return await this.userModel.findOne({ email }).populate('role', 'name');
  };

  update = async (id: string, updateUserDto: UpdateUserDto, user: IUser) => {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: userMetadata,
      },
    );
  };

  remove = async (id: string, user: IUser) => {
    return await this.userModel.delete({ _id: id }, user.id);
  };

  findByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).populate('role', 'name');
  };

  updateRefreshToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  removeRefreshToken = async (refreshToken: string) => {
    return await this.userModel.updateOne({ refreshToken }, { refreshToken: null });
  };

  checkRole = async (id: string, role: mongoose.Schema.Types.ObjectId) => {
    const user = await this.userModel.findOne({ _id: id, role });

    if (user) {
      return true;
    }

    return false;
  };

  register = async (authRegisterDto: AuthRegisterDto) => {
    const { password, email } = authRegisterDto;

    const isUser = await this.checkUserIsExist(email);

    if (isUser) {
      throw new BadRequestException('User is already exist');
    }

    const [defaultRole, hashPassword] = await Promise.all([
      this.rolesService.findByName(ERole.User),
      this.hashPassword(password),
    ]);

    return (
      await this.userModel.create({
        email: email,
        password: hashPassword,
        name: `name ${Date.now()}`,
        userName: `name name ${Date.now()}`,
        role: defaultRole._id,
      })
    ).populate('role', 'name');
  };

  changePassword = async (changePasswordDto: ChangePasswordDto, email: string) => {
    return await this.userModel.updateOne({ email }, { password: await this.hashPassword(changePasswordDto.password) });
  };

  verifyEmail = async (email: string) => {
    return await this.userModel.updateOne({ email }, { isVerify: true });
  };
}
