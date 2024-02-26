import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AccountsService {
  constructor(private readonly configService: ConfigService) {}

  generateAccessToken(user: Pick<User, 'id' | 'email'>) {
    const { id: subject, email } = user;
    const secretKey = this.configService.getOrThrow<string>('JWT_SECRET_KET');

    const accessToken = sign({ email, accountType: 'user' }, secretKey, {
      subject,
      expiresIn: '5d',
    });

    return accessToken;
  }
}
