import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { QueryParam } from '../common/decorators';
import { BaseQueryParams } from '../common/interfaces';
import { JoiValidationPipe } from '../common/pipes';
import { paginateResponse } from '../common/utils';
import { CreateTodoDto, UpdateTodoDto } from './dtos';
import { CreateTodoSchema, UpdateTodoSchema } from './schemas';
import { TodoService } from './todo.service';

export interface TodoQueryParams extends BaseQueryParams {
  where: {
    isPinned?: boolean;
    isCompleted?: boolean;
    isArchived?: boolean;
    deadline?: { $gte: string; $lte: string };
  };
}

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private _todoService: TodoService) {}

  @Post()
  async createTodo(
    @Body(new JoiValidationPipe(CreateTodoSchema)) data: CreateTodoDto,
  ) {
    return this._todoService.createFromRequestBody(data);
  }

  @Get()
  async getTodos(@QueryParam() query: TodoQueryParams) {
    const { page = 1, limit = 10, sort = { deadline: -1 }, where = {} } = query;

    const [todos, count] = await Promise.all([
      this._todoService.get({ ...where }, null, {
        limit,
        skip: (page - 1) * limit,
        sort,
      }),
      this._todoService.count({ ...where }),
    ]);

    return paginateResponse({ page, limit, count, data: todos });
  }

  @Get(':todoId')
  async getOne(@Param('todoId') todoId: string) {
    return this._todoService.getOneBy(todoId);
  }

  @Put(':todoId')
  async updateTodo(
    @Param('todoId') todoId: string,
    @Body(new JoiValidationPipe(UpdateTodoSchema)) data: UpdateTodoDto,
  ) {
    return this._todoService.updateFromRequestBody({ ...data, _id: todoId });
  }

  @Delete(':todoId')
  async deleteTodo(@Param('todoId') todoId: string) {
    return this._todoService.deleteOne(todoId);
  }
}
