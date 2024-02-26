import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private readonly prismaService: PrismaService) {}

  getRegions() {
    return this.prismaService.region.findMany({ orderBy: { label: 'asc' } });
  }
}
