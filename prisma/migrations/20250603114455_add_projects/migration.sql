-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(191) NULL,
    `client` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `year` VARCHAR(191) NULL,
    `status` ENUM('DEVELOPMENT', 'BETA', 'LIVE', 'ARCHIVED', 'MAINTENANCE') NOT NULL DEFAULT 'DEVELOPMENT',
    `icon` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `projects_categoryId_idx`(`categoryId`),
    INDEX `projects_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technologies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `technologies_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_technologies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `technologyId` INTEGER NOT NULL,

    INDEX `project_technologies_projectId_idx`(`projectId`),
    INDEX `project_technologies_technologyId_idx`(`technologyId`),
    UNIQUE INDEX `project_technologies_projectId_technologyId_key`(`projectId`, `technologyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `features_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `featureId` INTEGER NOT NULL,

    INDEX `project_features_projectId_idx`(`projectId`),
    INDEX `project_features_featureId_idx`(`featureId`),
    UNIQUE INDEX `project_features_projectId_featureId_key`(`projectId`, `featureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_metrics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `users` VARCHAR(191) NULL,
    `performance` VARCHAR(191) NULL,
    `rating` VARCHAR(191) NULL,
    `downloads` VARCHAR(191) NULL,
    `revenue` VARCHAR(191) NULL,
    `uptime` VARCHAR(191) NULL,

    UNIQUE INDEX `project_metrics_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `live` VARCHAR(191) NULL,
    `github` VARCHAR(191) NULL,
    `case` VARCHAR(191) NULL,
    `demo` VARCHAR(191) NULL,
    `docs` VARCHAR(191) NULL,

    UNIQUE INDEX `project_links_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `rating` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_reviews_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('SCREENSHOT', 'MOCKUP', 'LOGO', 'DIAGRAM', 'OTHER') NOT NULL DEFAULT 'SCREENSHOT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_images_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_technologies` ADD CONSTRAINT `project_technologies_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_technologies` ADD CONSTRAINT `project_technologies_technologyId_fkey` FOREIGN KEY (`technologyId`) REFERENCES `technologies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_features` ADD CONSTRAINT `project_features_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_features` ADD CONSTRAINT `project_features_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `features`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_metrics` ADD CONSTRAINT `project_metrics_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_links` ADD CONSTRAINT `project_links_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
