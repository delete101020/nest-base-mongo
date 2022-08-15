import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigVar } from '../../configs';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private _authService: AuthService) {
    super({
      clientID: configService.get<string>(ConfigVar.GOOGLE_CLIENT_ID),
      clientSecret: configService.get<string>(ConfigVar.GOOGLE_CLIENT_SECRET),
      callbackURL: configService.get<string>(ConfigVar.GOOGLE_CALLBACK_URL),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user: any, info?: any) => void,
  ) {
    const user = await this._authService.validateGoogle(profile);
    done(null, user);
  }
}
