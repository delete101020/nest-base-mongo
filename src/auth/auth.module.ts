import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  FacebookStrategy,
  GoogleStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategies';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
