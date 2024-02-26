import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Accommodation,
  AccommodationType,
  Partner,
  Prisma,
  Room,
} from '@prisma/client';
import * as fs from 'fs/promises';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { RoomsService } from './rooms/rooms.service';

@Injectable()
export class AccommodationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomsService: RoomsService,
  ) {}
  async createAccommodation(dto: Prisma.AccommodationUncheckedCreateInput) {
    const {
      type,
      partnerId,
      name,
      description,
      imgUrl,
      address1,
      address2,
      latitude,
      longitude,
    } = dto;

    const data: Prisma.AccommodationUncheckedCreateInput = {
      type,
      partnerId,
      name,
      description,
      imgUrl,
      address1,
      address2,
      latitude,
      longitude,
    };
    const accommodation = await this.prismaService.accommodation.create({
      data,
    });
    return accommodation;
  }
  async getAccommodations(type?: AccommodationType) {
    const accommodations = await this.prismaService.accommodation.findMany({
      where: { type },
    });
    return accommodations;
  }

  async getAccommodation(accommodationId: number) {
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId },
      include: { rooms: true },
    });
    return accommodation;
  }

  async addRoomToAccommodation(
    partner: Pick<Partner, 'id'>,
    accommodationId: Accommodation['id'],
    data: Parameters<typeof this.roomsService.createRoom>[1],
  ) {
    //소유자 확인
    const accommodation = this.prismaService.accommodation.findUnique({
      where: { id: accommodationId, partnerId: partner.id },
    });
    if (!accommodation)
      throw new ForbiddenException('Only Can add Own accommodations Room');

    const room = this.roomsService.createRoom(accommodationId, data);
    return room;
  }

  async deleteRoomFromAccommodation(
    partner: Pick<Partner, 'id'>,
    accommodationId: Accommodation['id'],
    roomId: Room['id'],
  ) {
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId, partnerId: partner.id },
    });
    if (!accommodation)
      throw new ForbiddenException('Only Can add Own accommodations Room');
    await this.roomsService.deleteRoom(roomId);
    return `delete room No.${roomId} form  ${accommodation.name} success`;
  }
  async addImgToAccommodation(file: Express.Multer.File) {
    await fs.writeFile(`./public/images/${file.originalname}`, file.buffer);
    return `http://localhost:5050/${file.originalname}`;
  }
}
