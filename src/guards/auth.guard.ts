import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { AccountType } from 'src/domains/accounts/account.type';
import { PrismaService } from './../db/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accountTypeInDecorator =
      this.reflector.getAllAndOverride<AccountType>('accountType', [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!accountTypeInDecorator) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) throw new UnauthorizedException();

    try {
      const secretKey = this.configService.getOrThrow<string>('JWT_SECRET_KET');
      const { sub: id, accountType: accountTypeInAccessToken } = verify(
        accessToken,
        secretKey,
      ) as JwtPayload & { accountType: AccountType };
      if (accountTypeInDecorator !== accountTypeInAccessToken)
        throw new Error();

      if (accountTypeInDecorator === 'user') {
        const user = await this.prismaService.user.findFirstOrThrow({
          where: { id },
        });
        request.user = user;
      } else {
        const partner = await this.prismaService.partner.findFirstOrThrow({
          where: { id },
        });
        request.partner = partner;
      }
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
