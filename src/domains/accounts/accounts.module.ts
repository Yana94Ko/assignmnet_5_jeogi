import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PartnersModule } from './partners/partners.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, PartnersModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
