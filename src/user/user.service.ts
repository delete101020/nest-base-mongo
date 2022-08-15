import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/schema';
import { User, USER_MODEL } from './models';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(USER_MODEL) private readonly _userModel: Model<User>,
  ) {
    super(_userModel);
  }
}
