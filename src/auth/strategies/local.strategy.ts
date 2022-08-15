import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private _authService: AuthService) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    const payload = await this._authService.validateUser(identifier, password);
    if (!payload) throw new UnauthorizedException();

    return payload;
  }
}
