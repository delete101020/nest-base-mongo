import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../common/schema/base.model';
import { Account, AccountSchema, UserRole, UserStatus } from '.';

export const USER_MODEL = 'User';

@Schema()
export class User extends BaseModel {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  phone: string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Prop({ type: [AccountSchema], default: [] })
  accounts: Account[];
}

export const UserSchema = SchemaFactory.createForClass(User);
