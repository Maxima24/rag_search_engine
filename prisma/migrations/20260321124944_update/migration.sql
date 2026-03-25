/*
  Warnings:

  - You are about to drop the column `chunkInt` on the `DocumentChunks` table. All the data in the column will be lost.
  - Added the required column `chunkIndex` to the `DocumentChunks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentChunks" DROP COLUMN "chunkIndex",
ADD COLUMN     "chunkIndex" INTEGER NOT NULL;
