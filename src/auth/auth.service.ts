import { compare, genSalt, hash } from 'bcryptjs';
import { SignOptions, sign } from 'jsonwebtoken';
import { Profile as FacebookProfile } from 'passport-facebook';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigVar } from '../configs';
import { Account, AccountProvider, User } from '../user/models';
import { UserService } from '../user/user.service';

export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

@Injectable()
export class AuthService {
  private readonly jwtOptions: {
    [ACCESS_TOKEN]: SignOptions;
    [REFRESH_TOKEN]: SignOptions;
  };
  private readonly jwtKeys: {
    [ACCESS_TOKEN]: string;
    [REFRESH_TOKEN]: string;
  };

  constructor(
    private _configService: ConfigService,
    private _userService: UserService,
  ) {
    this.jwtKeys = {
      [ACCESS_TOKEN]: this._configService.get<string>(ConfigVar.JWT_SECRET),
      [REFRESH_TOKEN]: this._configService.get<string>(
        ConfigVar.JWT_REFRESH_SECRET,
      ),
    };
    this.jwtOptions = {
      [ACCESS_TOKEN]: {
        expiresIn: this._configService.get<string>(ConfigVar.JWT_EXPIRES_IN),
      },
      [REFRESH_TOKEN]: {
        expiresIn: this._configService.get<string>(
          ConfigVar.JWT_REFRESH_EXPIRES_IN,
        ),
      },
    };
  }

  async login(user: User) {
    const { _id, email, phone, firstName, lastName, status, role } = user;

    const payload = {
      _id,
      email,
      phone,
      firstName,
      lastName,
      status,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signPayload(payload, ACCESS_TOKEN),
      this.signPayload(payload, REFRESH_TOKEN),
    ]);

    return { accessToken, refreshToken };
  }

  /** LOGIN VALIDATION: EMAIL - GOOGLE - FACEBOOK */
  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this._userService.getOne({
      $or: [
        { email: identifier },
        {
          'accounts.uid': identifier,
          'accounts.provider': AccountProvider.INTERNAL,
        },
      ],
    });

    if (user && (await this.comparePassword(user.password, password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, accounts, ...payload } = user;
      return payload;
    }

    return null;
  }

  async validateGoogle(profile: GoogleProfile): Promise<any> {
    const {
      sub: uid,
      given_name: firstName,
      family_name: lastName,
      email,
      email_verified: isEmailVerified,
    } = profile._json;

    // Check if user with Google uid exists
    const googleUser = await this._userService.getOne({
      'accounts.uid': uid,
      'accounts.provider': AccountProvider.GOOGLE,
    });
    if (googleUser) return googleUser;

    // Check if user with email exists
    const emailUser = await this._userService.getOneBy(email, 'email');
    if (emailUser) {
      // Add Google account to user
      const googleAccount = new Account();
      googleAccount.provider = AccountProvider.GOOGLE;
      googleAccount.uid = uid;
      emailUser.accounts.push(googleAccount);

      // Update user
      const updatedEmailUser = await this._userService.update(emailUser);
      return updatedEmailUser;
    }

    // Create new user
    const googleAccount = new Account();
    googleAccount.provider = AccountProvider.GOOGLE;
    googleAccount.uid = uid;

    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.isEmailVerified = Boolean(isEmailVerified);
    newUser.accounts = [googleAccount];

    const user = await this._userService.create(newUser);
    return user;
  }

  async validateFacebook(profile: FacebookProfile): Promise<any> {
    const {
      id: uid,
      email,
      first_name: firstName,
      last_name: lastName,
    } = profile._json;

    // Check if user with Facebook uid exists
    const facebookUser = await this._userService.getOne({
      'accounts.uid': uid,
      'accounts.provider': AccountProvider.FACEBOOK,
    });
    if (facebookUser) return facebookUser;

    // Check if user with email exists
    const emailUser = await this._userService.getOneBy(email, 'email');
    if (emailUser) {
      // Add Facebook account to user
      const facebookAccount = new Account();
      facebookAccount.provider = AccountProvider.FACEBOOK;
      facebookAccount.uid = uid;
      emailUser.accounts.push(facebookAccount);

      // Update user
      const updatedEmailUser = await this._userService.update(emailUser);
      return updatedEmailUser;
    }

    // Create new user
    const facebookAccount = new Account();
    facebookAccount.provider = AccountProvider.FACEBOOK;
    facebookAccount.uid = uid;

    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.accounts = [facebookAccount];

    const user = await this._userService.create(newUser);
    return user;
  }
  /** LOGIN VALIDATION: EMAIL - GOOGLE - FACEBOOK */

  /** ========== GENERIC METHOD ========== */
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async comparePassword(password: string, input: string): Promise<boolean> {
    return compare(password, input);
  }

  async signPayload(
    payload: any,
    type: string = ACCESS_TOKEN || REFRESH_TOKEN,
  ): Promise<string> {
    return sign(payload, this.jwtKeys[type], this.jwtOptions[type]);
  }
  /** ========== GENERIC METHOD ========== */
}
