/*
  Warnings:

  - You are about to drop the `blog_authors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_post_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_post_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_metrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_technologies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `technologies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blog_comments` DROP FOREIGN KEY `blog_comments_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_comments` DROP FOREIGN KEY `blog_comments_postId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_post_stats` DROP FOREIGN KEY `blog_post_stats_postId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_post_tags` DROP FOREIGN KEY `blog_post_tags_postId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_post_tags` DROP FOREIGN KEY `blog_post_tags_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_posts` DROP FOREIGN KEY `blog_posts_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_posts` DROP FOREIGN KEY `blog_posts_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `project_features` DROP FOREIGN KEY `project_features_featureId_fkey`;

-- DropForeignKey
ALTER TABLE `project_features` DROP FOREIGN KEY `project_features_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_links` DROP FOREIGN KEY `project_links_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_metrics` DROP FOREIGN KEY `project_metrics_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_technologies` DROP FOREIGN KEY `project_technologies_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_technologies` DROP FOREIGN KEY `project_technologies_technologyId_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_categoryId_fkey`;

-- DropTable
DROP TABLE `blog_authors`;

-- DropTable
DROP TABLE `blog_categories`;

-- DropTable
DROP TABLE `blog_comments`;

-- DropTable
DROP TABLE `blog_post_stats`;

-- DropTable
DROP TABLE `blog_post_tags`;

-- DropTable
DROP TABLE `blog_posts`;

-- DropTable
DROP TABLE `blog_tags`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `features`;

-- DropTable
DROP TABLE `project_features`;

-- DropTable
DROP TABLE `project_images`;

-- DropTable
DROP TABLE `project_links`;

-- DropTable
DROP TABLE `project_metrics`;

-- DropTable
DROP TABLE `project_reviews`;

-- DropTable
DROP TABLE `project_technologies`;

-- DropTable
DROP TABLE `projects`;

-- DropTable
DROP TABLE `technologies`;

-- DropTable
DROP TABLE `users`;
