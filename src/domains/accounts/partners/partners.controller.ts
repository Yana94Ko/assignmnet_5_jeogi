import { Body, Controller, Post } from '@nestjs/common';
import { PartnersLogInDto, PartnersSignUpDto } from './partners.dto';
import { PartnersService } from './partners.service';

@Controller('accounts/partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post('sign-up')
  signUp(@Body() dto: PartnersSignUpDto) {
    console.log('test');
    return this.partnersService.signUp(dto);
  }

  @Post('log-in')
  ligIn(@Body() dto: PartnersLogInDto) {
    return this.partnersService.logIn(dto);
  }
}
