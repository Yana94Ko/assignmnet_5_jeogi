import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Partner, User } from '@prisma/client';
import { DAccountType } from 'src/decorators/partner.decorator';
import { Private } from 'src/decorators/private.decorator';
import day from 'src/utils/day';
import { UserCreateReview } from './rooms.dto';
import { RoomsService } from './rooms.service';

@Controller('/accommodations/:accommodationId/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('/:roomId/reservations')
  @Private('user')
  makeReservation(
    @DAccountType('user') user: User,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body('date') date: string,
  ) {
    return this.roomsService.makeReservation(
      user.id,
      roomId,
      day(date).startOf('day').toDate(),
    );
  }
  @Post('/:roomId/reservations/:reservationId')
  @Private('userOrPartner')
  deleteReservation(@Param('reservationId') reservationId: string) {
    return this.roomsService.deleteReservation(reservationId);
  }
  @Post('/:roomId/reviews/:reservationId')
  @Private('user')
  writeReview(
    @DAccountType('user') user: User,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('reservationId') reservationId: string,
    @Body() reviewDto: UserCreateReview,
  ) {
    return this.roomsService.writeReview(
      user.id,
      roomId,
      reservationId,
      reviewDto,
    );
  }

  @Post('/:roomId/checkedIns/:reservationId')
  @Private('partner')
  setCheckedInAt(
    @DAccountType('partner') partner: Partner,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('accommodationId', ParseIntPipe) accommodationId: number,
    @Param('reservationId') reservationId: string,
    @Body('date') date: string,
  ) {
    return this.roomsService.setCheckedInAt(
      partner.id,
      accommodationId,
      roomId,
      reservationId,
      day(date).startOf('day').toDate(),
    );
  }
}
