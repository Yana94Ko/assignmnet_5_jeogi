import { fakerKO } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import day from 'src/utils/day';

export const prismaExtendedClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    query: {
      user: {
        create({ args, query }) {
          args.data = {
            ...args.data,
            profile: {
              create: {
                nickname: fakerKO.music.songName(),
              },
            },
          };

          return query(args);
        },
      },
      room: {
        async create({ args, query }) {
          const room = await query(args);
          console.log(room);
          const context = Prisma.getExtensionContext(this);

          const startDate = day('2024-02-23');
          const endDate = day('2024-03-31');

          const diffInDay = endDate.diff(startDate, 'day') + 1;

          const promises = Array(diffInDay)
            .fill(0)
            .map((_, idx) => {
              const date = startDate.add(idx, 'day').toDate();
              console.log('context', context);

              return (context as any).reservation.create({
                data: {
                  id: nanoid(),
                  date,
                  roomId: room.id,
                },
              });
            });

          Promise.all(promises);
          return room;
        },
      },
    },
  });
prismaExtendedClient.bind(this);
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  readonly extendedClient = prismaExtendedClient(this);

  constructor() {
    super();
    return new Proxy(this, {
      get: (target, property) =>
        Reflect.get(
          property in this.extendedClient ? this.extendedClient : target,
          property,
        ),
    });
  }
  async onModuleInit() {
    //this.setMiddlewares();
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // setMiddlewares() {
  //   this.$use(async (params, next) => {
  //     const model = params.model;
  //     const action = params.action;
  //     const result = await next(params);

  //     if (model === 'Room' && action === 'create') {
  //       console.log('test middleware');

  //       const room = result as Room;

  //       const startDate = day().startOf('day');
  //       const endDate = day('2024-03-31');

  //       const diffInDay = endDate.diff(startDate, 'day') + 1;

  //       const promises = Array(diffInDay)
  //         .fill(0)
  //         .map((_, idx) => {
  //           const date = startDate.add(idx, 'day').toDate();
  //           return this.reservation.create({
  //             data: {
  //               id: nanoid(),
  //               date,
  //               roomId: room.id,
  //             },
  //           });
  //         });

  //       Promise.all(promises);
  //     }

  //     if (model === 'User' && action === 'create') {
  //       const user = result as User;
  //       await this.userProfile.create({
  //         data: { userId: user.id, nickname: fakerKO.internet.displayName() },
  //       });
  //     }
  //     return result;
  //   });
  // }
}
