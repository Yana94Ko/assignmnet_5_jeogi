import { Body, Controller, Post } from '@nestjs/common';
import { UserLogInDto, UserSignUpDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('accounts/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UserSignUpDto) {
    return { assessToken: await this.usersService.signUp(dto) };
  }

  @Post('log-in')
  async ligIn(@Body() dto: UserLogInDto) {
    return { assessToken: await this.usersService.logIn(dto) };
  }
}
