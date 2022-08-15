import { Controller, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from '../common/decorators';
import { User } from '../user/models';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private _authService: AuthService) {}

  /** INTERNAL */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    return this._authService.login(user);
  }
  /** INTERNAL */
}
