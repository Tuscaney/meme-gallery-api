-- DropForeignKey
ALTER TABLE "public"."memes" DROP CONSTRAINT "memes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."memes" ADD CONSTRAINT "memes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

