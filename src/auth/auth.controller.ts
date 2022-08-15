import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from '../common/decorators';
import { User } from '../user/models';
import { AuthService } from './auth.service';
import { FacebookAuthGuard, GoogleAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  /** INTERNAL */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    return this._authService.login(user);
  }
  /** INTERNAL */

  /** Facebook */
  @UseGuards(FacebookAuthGuard)
  @Get('facebook')
  async facebookLogin() {
    return true;
  }

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/callback')
  async facebookLoginCallback(@RequestUser() user: User) {
    return this._authService.login(user);
  }
  /** Facebook */

  /** Google */
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {
    return true;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleLoginCallback(@RequestUser() user: User) {
    return this._authService.login(user);
  }
  /** Google */
}
