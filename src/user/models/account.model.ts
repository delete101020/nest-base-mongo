import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountProvider } from '.';

export const ACCOUNT_MODEL = 'Account';

@Schema()
export class Account {
  @Prop({ default: AccountProvider.INTERNAL })
  provider: AccountProvider;

  @Prop()
  uid: string; // Unique id for each account type, e.g. facebook id, google id, etc.
}

export const AccountSchema = SchemaFactory.createForClass(Account);
