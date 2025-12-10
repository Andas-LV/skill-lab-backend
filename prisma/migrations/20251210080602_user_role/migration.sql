-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'USER', 'TEACHER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER';
