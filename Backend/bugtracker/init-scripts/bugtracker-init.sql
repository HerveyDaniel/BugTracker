CREATE DATABASE  IF NOT EXISTS `bugtracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bugtracker`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: bugtracker
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `PROJECTID` bigint NOT NULL,
  `PROJECTDESCRIPTION` varchar(255) DEFAULT NULL,
  `PROJECTNAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PROJECTID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (53,'this is bugwhack','BugWhack'),(54,'YES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YESYES YES YES YES YES YES','Optimize Code'),(402,'What the helly','FRRR'),(503,'goon','Millions Must');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_seq`
--

DROP TABLE IF EXISTS `projects_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_seq`
--

LOCK TABLES `projects_seq` WRITE;
/*!40000 ALTER TABLE `projects_seq` DISABLE KEYS */;
INSERT INTO `projects_seq` VALUES (601);
/*!40000 ALTER TABLE `projects_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `TICKETID` bigint NOT NULL,
  `PRIORITYSTATUS` enum('HIGH','LOW','MEDIUM','NOT_APPLICABLE') NOT NULL,
  `COMMENTS` json DEFAULT NULL,
  `TICKETINFO` varchar(255) DEFAULT NULL,
  `TICKETPROGRESS` enum('BACKLOG','COMPLETED','IN_PROGRESS','NOT_APPLICABLE') NOT NULL,
  `TICKETTITLE` varchar(255) DEFAULT NULL,
  `TICKETTYPE` enum('BUG','FEATURE','NOT_APPLICABLE','OTHER') NOT NULL,
  `ASSIGNEDUSER` bigint DEFAULT NULL,
  `PROJECT` bigint DEFAULT NULL,
  PRIMARY KEY (`TICKETID`),
  KEY `FKckp0m0pydqii7sbwc31o02mpw` (`ASSIGNEDUSER`),
  KEY `FKb83g59nln7hhvwf9vixidk4h8` (`PROJECT`),
  CONSTRAINT `FKb83g59nln7hhvwf9vixidk4h8` FOREIGN KEY (`PROJECT`) REFERENCES `projects` (`PROJECTID`),
  CONSTRAINT `FKckp0m0pydqii7sbwc31o02mpw` FOREIGN KEY (`ASSIGNEDUSER`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (452,'MEDIUM','[]','AMA','IN_PROGRESS','MAMA','BUG',1,503),(453,'LOW','[]','dddd','IN_PROGRESS','ddddd','BUG',1,NULL),(502,'HIGH','[]','d','COMPLETED','double','OTHER',155,402),(552,'LOW',NULL,'oooo','IN_PROGRESS','Booooo','BUG',803,402),(602,'LOW',NULL,'na','IN_PROGRESS','da boi','FEATURE',152,402),(603,'LOW',NULL,'lele','IN_PROGRESS','lel','BUG',NULL,53),(604,'HIGH',NULL,'pew','IN_PROGRESS','lwiay','OTHER',1,53),(759,'HIGH',NULL,'bbb','COMPLETED','obo','FEATURE',NULL,54),(761,'MEDIUM',NULL,'we','IN_PROGRESS','LEEEE','FEATURE',NULL,54),(865,'HIGH',NULL,'gg','IN_PROGRESS','gg','OTHER',NULL,503),(902,'HIGH',NULL,'sssss','IN_PROGRESS','sssss','OTHER',NULL,53),(903,'HIGH','[{\"content\": \"hu\", \"createdBy\": \"Robert\", \"createdOn\": [2025, 4, 25, 18, 0, 57, 451039400]}, {\"content\": \"ok\", \"createdBy\": \"Robert\", \"createdOn\": [2025, 4, 25, 18, 1, 4, 82817200]}]','ty','IN_PROGRESS','ty','OTHER',NULL,53),(904,'MEDIUM','[{\"content\": \"heyg\", \"createdBy\": \"Robert\", \"createdOn\": [2025, 4, 25, 18, 0, 46, 439572000]}]','hh','IN_PROGRESS','hh','FEATURE',1,53),(952,'MEDIUM',NULL,'yes','IN_PROGRESS','This is a user ticket','FEATURE',NULL,402),(953,'HIGH',NULL,'bruh','COMPLETED','Bruh','OTHER',1002,402),(1102,'MEDIUM',NULL,'','IN_PROGRESS','fiyah','FEATURE',NULL,503),(1103,'MEDIUM',NULL,'hot fiyah','BACKLOG','supah','BUG',NULL,503),(1104,'LOW',NULL,'thank you ma\'am','BACKLOG','Bam','BUG',NULL,503),(1105,'MEDIUM',NULL,'','IN_PROGRESS','sham','FEATURE',NULL,503),(1106,'HIGH',NULL,'','IN_PROGRESS','jam','OTHER',1052,503);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets_seq`
--

DROP TABLE IF EXISTS `tickets_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets_seq`
--

LOCK TABLES `tickets_seq` WRITE;
/*!40000 ALTER TABLE `tickets_seq` DISABLE KEYS */;
INSERT INTO `tickets_seq` VALUES (1201);
/*!40000 ALTER TABLE `tickets_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID` bigint NOT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `ROLE` enum('ADMIN','MANAGER','USER') DEFAULT NULL,
  `USERNAME` varchar(255) DEFAULT NULL,
  `assignedProject` bigint DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK8p662vj39jhtdodamv408jfwh` (`assignedProject`),
  CONSTRAINT `FK8p662vj39jhtdodamv408jfwh` FOREIGN KEY (`assignedProject`) REFERENCES `projects` (`PROJECTID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'$2a$10$IqPLG7oOq4UMzdfd8XtoKOavy02neXAejACXYoF6aVsRHHdbWV3J.','ADMIN','Robert',53),(152,'$2a$10$mUugEw2uDfU27MailvD.MOakOhiPrPMhd0WO.yyo3.FTYpKivZUrW','ADMIN','Ronald',NULL),(155,'$2a$10$IAtTyluz7mIJCEGL2I1ZRuimUmnufQrKT8oxi72gOr3SB5fBS78Ge','USER','Joe Shmo',503),(202,'$2a$10$5IAumOkZmCmbqzVzsQNfIOOhxPTpqc/inxk2mIq96XOW7RAVXZAOi','ADMIN','pepe',503),(203,'$2a$10$xuHitYm8e0vZrlgS/T9j4ubCyadTDVlZPquv7nMY31OGamKxN735a','USER','KSI',503),(802,'$2a$10$iQ9huye5DJD4X82yhXKtH.1jPfdpslnea6RZY6OJmkTG.DwFV2rYi','ADMIN','Meepo',503),(803,'$2a$10$X7oAAmYYsHwz/Gj38Kb.TezVkKXNaruh3E/ZmxoWVD8Vc0FzT9.5i','ADMIN','Mick',NULL),(852,'$2a$10$Vuc55OIwKjD3Y4SPW.3L.OhVdPuS0JP5DOGIRZxrDblFAaBMOGtqS','ADMIN','leeroy jenkins',503),(952,'$2a$10$RGIhDt5cMR.E8jrzZHV1X.mxaIGKDRD5YuX6Zyy/2bZnrZ1KD9Wfa','USER','HUU',53),(1002,'$2a$10$bEXAO5paP/v3p34ruAnxA.9ry/heLHAHJy7tEhGUcNtFNpMxXw9/u','USER','New Guy',402),(1052,'$2a$10$P.sbU9zwLJiMBw9G5eNgh.G7.XtEAf1N8SGAg91/eA4HxuFAblria','USER','WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',53);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_seq`
--

DROP TABLE IF EXISTS `users_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_seq`
--

LOCK TABLES `users_seq` WRITE;
/*!40000 ALTER TABLE `users_seq` DISABLE KEYS */;
INSERT INTO `users_seq` VALUES (1151);
/*!40000 ALTER TABLE `users_seq` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-07 16:37:36
