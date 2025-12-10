-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('ALL', 'FRONTEND', 'MOBILE', 'BACKEND', 'DESIGN');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "category" "Categories" NOT NULL DEFAULT 'ALL';
