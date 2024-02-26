/*
  Warnings:

  - You are about to drop the column `datd` on the `Reservation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId,date]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reservation_roomId_datd_key";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "datd",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_roomId_date_key" ON "Reservation"("roomId", "date");
