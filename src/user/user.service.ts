import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../common/schema';
import { ConfigVar } from '../configs';
import {
  Account,
  AccountProvider,
  User,
  UserRole,
  UserStatus,
  USER_MODEL,
} from './models';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(USER_MODEL) private readonly _userModel: Model<User>,
    private _configService: ConfigService,
    private _authService: AuthService,
  ) {
    super(_userModel);
  }

  /** ========== ADMIN ========== */
  async createDefaultAdmin() {
    const defaultAdminEmail = this._configService.get<string>(
      ConfigVar.DEFAULT_ADMIN_EMAIL,
    );
    const defaultAdminPassword = this._configService.get<string>(
      ConfigVar.DEFAULT_ADMIN_PASSWORD,
    );

    // Check if admin user already exists
    const adminUser = await this.getOne({ email: defaultAdminEmail });
    if (adminUser) return;

    // Create admin user
    const account = new Account();
    account.provider = AccountProvider.INTERNAL;
    account.uid = 'administrator';

    const admin = {} as User;
    admin.email = defaultAdminEmail;
    admin.password = await this._authService.hashPassword(defaultAdminPassword);
    admin.status = UserStatus.ACTIVE;
    admin.role = UserRole.ADMIN;
    admin.isEmailVerified = true;

    admin.accounts = [account];
    return this.createFromRequestBody(admin);
  }
  /** ========== ADMIN ========== */
}
