-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."memes" DROP CONSTRAINT "memes_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "user_likes_meme" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memeId" INTEGER NOT NULL,

    CONSTRAINT "user_likes_meme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_likes_meme_userId_memeId_key" ON "user_likes_meme"("userId", "memeId");

-- AddForeignKey
ALTER TABLE "memes" ADD CONSTRAINT "memes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_likes_meme" ADD CONSTRAINT "user_likes_meme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_likes_meme" ADD CONSTRAINT "user_likes_meme_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
