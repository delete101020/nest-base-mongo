import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TODO_MODEL, TodoSchema } from './models';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TODO_MODEL, schema: TodoSchema }]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [],
})
export class TodoModule {}
