import { Profile, Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigVar } from '../../configs';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private _authService: AuthService) {
    super({
      clientID: configService.get<string>(ConfigVar.FACEBOOK_APP_ID),
      clientSecret: configService.get<string>(ConfigVar.FACEBOOK_APP_SECRET),
      callbackURL: configService.get<string>(ConfigVar.FACEBOOK_CALLBACK_URL),
      scope: ['email'],
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user: any, info?: any) => void,
  ) {
    const user = await this._authService.validateFacebook(profile);
    done(null, user);
  }
}
