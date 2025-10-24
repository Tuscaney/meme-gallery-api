-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FUNNY', 'ANIMALS', 'GAMING', 'OTHER');

-- AlterTable
ALTER TABLE "memes" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER';
