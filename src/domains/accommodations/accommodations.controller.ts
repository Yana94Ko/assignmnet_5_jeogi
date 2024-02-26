import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Accommodation,
  AccommodationType,
  Partner,
  Room,
} from '@prisma/client';
import { DAccountType } from 'src/decorators/partner.decorator';
import { Private } from 'src/decorators/private.decorator';
import {
  AccommodationsAddRoomDto,
  AccommodationsRegisterDto,
} from './accommodations.dto';
import { AccommodationsService } from './accommodations.service';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Post()
  @Private('partner')
  create(
    @DAccountType('partner') partner: Partner,
    @Body() dto: AccommodationsRegisterDto,
  ) {
    console.log('AccountType : ' + partner);
    return this.accommodationsService.createAccommodation({
      ...dto,
      partnerId: partner.id,
    });
  }

  @Get()
  getAccommodations(@Query('type') type: AccommodationType) {
    return this.accommodationsService.getAccommodations(type);
  }

  @Get('/:accommodationId')
  getAccommodation(
    @Param('accommodationId', ParseIntPipe) accommodationId: number,
  ) {
    return this.accommodationsService.getAccommodation(accommodationId);
  }
  @Patch(':accommodationId')
  @Private('partner')
  updateAccommodation() {}

  @Post('/:accommodationId/rooms')
  @Private('partner')
  addRoom(
    @Body() dto: AccommodationsAddRoomDto,
    @DAccountType('partner') partner: Partner,
    @Param('accommodationId', ParseIntPipe)
    accommodationId: Accommodation['id'],
  ) {
    return this.accommodationsService.addRoomToAccommodation(
      partner,
      accommodationId,
      dto,
    );
  }

  @Delete('/:accommodationId/rooms/:roomId')
  @Private('partner')
  deleteRoom(
    @DAccountType('partner') partner: Partner,
    @Param('accommodationId', ParseIntPipe)
    accommodationId: Accommodation['id'],
    @Param('roomId', ParseIntPipe) roomId: Room['id'],
  ) {
    return this.accommodationsService.deleteRoomFromAccommodation(
      partner,
      accommodationId,
      roomId,
    );
  }

  @Post('/:accommodationId/images')
  @Private('partner')
  @UseInterceptors(FileInterceptor('file'))
  uploadAccommodationMainImg(@UploadedFile() file: Express.Multer.File) {
    return this.accommodationsService.addImgToAccommodation(file);
  }
}
