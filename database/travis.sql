CREATE TABLE IF NOT EXISTS `orgs` (`id` INTEGER auto_increment , `orgName` VARCHAR(255), `orgPassword` VARCHAR(255), `orgEmail` VARCHAR(255), `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), PRIMARY KEY (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `polls` (`id` INTEGER auto_increment , `pollName` VARCHAR(255), `pollTimeStart` DATETIME, `pollTimeEnd` DATETIME, `pollHash` VARCHAR(255), `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), `orgId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`orgId`) REFERENCES `orgs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `options` (`id` INTEGER auto_increment , `optionName` VARCHAR(255), `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), `pollId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`pollId`) REFERENCES `polls` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `votes` (`id` INTEGER auto_increment , `voteHash` VARCHAR(255), `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), `optionId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`optionId`) REFERENCES `options` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `votekeys` (`id` INTEGER auto_increment , `voterUniqueId` VARCHAR(255), `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), `pollId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`pollId`) REFERENCES `polls` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;