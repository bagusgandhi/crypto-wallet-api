/*
  Warnings:

  - Added the required column `full_name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;
