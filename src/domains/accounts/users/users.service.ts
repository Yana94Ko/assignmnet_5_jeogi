import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import generateRandomId from 'src/utils/generateRandomId';
import { AccountsService } from '../accounts.service';
import { PrismaService } from './../../../db/prisma/prisma.service';
import { UserLogInDto, UserSignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accountsService: AccountsService,
  ) {}
  async signUp(dto: UserSignUpDto) {
    const { email, password } = dto;

    const data: Prisma.UserCreateInput = {
      id: generateRandomId(),
      email: email,
      encryptedPassword: await hash(password, 12),
    };

    const user = await this.prismaService.user.create({
      data,
      select: { id: true, email: true },
    });

    const accessToken = this.accountsService.generateAccessToken(user);

    return accessToken;
  }
  async logIn(dto: UserLogInDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('user Not Found');

    const isVerified = compare(password, user.encryptedPassword);
    if (!isVerified) throw new BadRequestException('wrong password');

    const accessToken = this.accountsService.generateAccessToken(user);

    return accessToken;
  }
}
