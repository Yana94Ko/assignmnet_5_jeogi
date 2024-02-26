import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Partner, Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/db/prisma/prisma.service';
import generateRandomId from 'src/utils/generateRandomId';
import { PartnersLogInDto, PartnersSignUpDto } from './partners.dto';

@Injectable()
export class PartnersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(dto: PartnersSignUpDto) {
    const { email, password, businessName, phoneNumber, staffName } = dto;
    const data: Prisma.PartnerCreateInput = {
      id: generateRandomId(),
      email: email,
      encryptedPassword: await hash(password, 12),
      businessName: businessName,
      phoneNumber: phoneNumber,
      staffName: staffName,
    };

    const partner = await this.prismaService.partner.create({
      data,
      select: { id: true, email: true },
    });

    const accessToken = this.generateAccessToken(partner);

    return accessToken;
  }
  async logIn(dto: PartnersLogInDto) {
    const { email, password } = dto;
    let partner;
    try {
      partner = await this.prismaService.partner.findUnique({
        where: { email },
      });
      if (!partner) throw new NotFoundException('partner Not Found');
    } catch (e) {
      throw new NotFoundException('partner Not Found');
    }

    const isVerified = compare(password, partner.encryptedPassword);
    if (!isVerified) throw new BadRequestException('wrong password');

    const accessToken = this.generateAccessToken(partner);

    return accessToken;
  }

  generateAccessToken(partner: Pick<Partner, 'id' | 'email'>) {
    const { id: subject, email } = partner;
    const secretKey = this.configService.getOrThrow<string>('JWT_SECRET_KET');

    const accessToken = sign({ email, accountType: 'partner' }, secretKey, {
      subject,
      expiresIn: '5d',
    });

    return accessToken;
  }
}
