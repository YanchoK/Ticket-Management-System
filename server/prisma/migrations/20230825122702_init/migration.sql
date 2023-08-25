-- CreateTable
CREATE TABLE `Ticket` (
    `id` VARCHAR(191) NOT NULL,
    `shortDescription` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `state` ENUM('NEW', 'IN_PROGRESS', 'REVIEW', 'DONE') NOT NULL DEFAULT 'NEW',
    `priority` ENUM('CRITICAL', 'HIGH', 'MODERATE', 'LOW') NOT NULL,
    `assignedToId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'DEVELOPER', 'QA', 'MANAGER') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `fk_ticket_assignedToUser` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
