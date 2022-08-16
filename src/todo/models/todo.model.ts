import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../common/schema';

export const TODO_MODEL = 'Todo';

@Schema()
export class Todo extends BaseModel {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: new Date().toISOString() })
  deadline: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
