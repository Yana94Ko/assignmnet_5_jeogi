import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Accommodation,
  Partner,
  Prisma,
  Reservation,
  Review,
  Room,
} from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserCreateReview } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(
    accommodationId: Accommodation['id'],
    roomDataWithoutAccommodationId: Prisma.RoomCreateWithoutAccommodationInput,
  ) {
    const data: Prisma.RoomUncheckedCreateInput = {
      accommodationId,
      ...roomDataWithoutAccommodationId,
    };
    const room = this.prismaService.room.create({ data });
    return room;
  }

  async deleteRoom(roomId: Room['id']) {
    try {
      await this.prismaService.room.delete({ where: { id: roomId } });
    } catch {
      return false;
    }
    return true;
  }

  async makeReservation(
    reservedById: Reservation['reservedById'],
    roomId: Reservation['roomId'],
    date: Reservation['date'],
  ) {
    const reservation = await this.prismaService.reservation.update({
      where: { roomId_date: { roomId, date } },
      data: { reservedAt: new Date(), reservedById },
    });

    return reservation;
  }

  async deleteReservation(reservationId: Reservation['id']) {
    const reservation = await this.prismaService.reservation.update({
      where: { id: reservationId },
      data: { reservedAt: null, reservedById: null },
    });

    return reservation;
  }

  async writeReview(
    reservedById: Review['userId'],
    roomId: Review['roomId'],
    reservationId: Reservation['id'],
    reviewDto: UserCreateReview,
  ) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { reservedById, roomId, id: reservationId },
    });

    if (!reservation)
      throw new ForbiddenException(
        `No reservation  No.${reservationId} with user No ${reservedById}'s room No.${roomId}`,
      );
    const { rating, content } = reviewDto;
    const review = await this.prismaService.review.create({
      data: { roomId, userId: reservedById, rating, content, reservationId },
    });

    return review;
  }

  async setCheckedInAt(
    partnerId: Partner['id'],
    accommodationId: Accommodation['id'],
    roomId: Reservation['roomId'],
    reservationId: Reservation['id'],
    date: Reservation['checkedInAt'],
  ) {
    const accommodation = await this.prismaService.accommodation.findUnique({
      where: { id: accommodationId, partnerId: partnerId },
    });
    if (!accommodation)
      throw new ForbiddenException('Only Can add Own accommodations Room');

    const reservation = await this.prismaService.reservation.update({
      where: {
        id: reservationId,
        room: { id: roomId, accommodationId: accommodationId },
      },
      data: { checkedInAt: date },
    });
    if (!reservation)
      throw new NotFoundException(
        `No reservation  No.${reservationId} from ${accommodation.name}'s room No.${roomId}`,
      );
    return reservation;
  }
}
