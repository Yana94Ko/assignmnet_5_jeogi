import { Controller, Get } from '@nestjs/common';
import { RegionsService } from './regions.service';

@Controller('accommodations/regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}
  @Get()
  async getRegions() {
    return await this.regionsService.getRegions();
  }
}
