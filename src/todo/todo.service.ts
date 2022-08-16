import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/schema';
import { Todo, TODO_MODEL } from './models';

@Injectable()
export class TodoService extends BaseService<Todo> {
  constructor(
    @InjectModel(TODO_MODEL) private readonly _todoModel: Model<Todo>,
  ) {
    super(_todoModel);
  }
}
