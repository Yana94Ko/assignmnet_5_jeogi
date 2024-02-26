import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { AccountType } from 'src/domains/accounts/account.type';

export const DAccountType = createParamDecorator(
  (data: AccountType, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request[data];
  },
);
