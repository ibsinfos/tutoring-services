-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 03, 2017 at 09:27 PM
-- Server version: 5.7.19
-- PHP Version: 7.0.25-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tutoringservices`
--
CREATE DATABASE IF NOT EXISTS `tutoringservices` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `tutoringservices`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAllProjects` ()  BEGIN	

	SELECT * FROM    
    (
    SELECT
	  GROUP_CONCAT(pro_skills.id) AS project_skills_id,
	  GROUP_CONCAT(pro_skills.name) AS project_skills_name,
	  COUNT(pro_project_skills.skill_id) AS project_skill_count
	FROM
	  `pro_project_skills`
	JOIN
	  pro_skills ON pro_project_skills.skill_id = pro_skills.id
	WHERE
	  pro_skills.status = 1 AND pro_skills.is_deleted = 0
	GROUP BY
	  project_id
	) as projectSkills,
    (  
	SELECT
	  GROUP_CONCAT(pro_skills.id) AS user_skills_id,
	  GROUP_CONCAT(pro_skills.name) AS user_skills_name,
	  COUNT(pro_users_skills.skill_id) AS user_skill_count
	FROM
	  pro_users_skills
	JOIN
	  pro_skills ON pro_users_skills.skill_id = pro_skills.id
	WHERE
	  pro_skills.status = 1 AND pro_skills.is_deleted = 0 AND pro_users_skills.status = 1 AND pro_users_skills.is_deleted = 0 AND user_id = 23
	GROUP BY
	  user_id
	) as userSkills;
    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `ts_budgets`
--

CREATE TABLE `ts_budgets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `currency_id` int(11) NOT NULL,
  `range_to` float NOT NULL,
  `range_from` float NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '1:project basis; 2:hourly basis',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1:active;0:inactive',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:not deleted;1:deleted',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_budgets`
--

INSERT INTO `ts_budgets` (`id`, `name`, `currency_id`, `range_to`, `range_from`, `type`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'budget #1', 1, 45.99, 12.67, 0, 1, 0, '2017-09-11 12:16:03', '2017-09-11 06:46:03'),
(2, 'budget #2', 1, 78, 34, 0, 0, 0, '2017-09-11 15:38:39', '2017-09-11 10:08:39'),
(5, 'budget #3', 2, 67.8, 46.89, 0, 1, 0, '2017-09-11 11:10:59', '2017-09-11 10:10:59'),
(6, 'new budget', 2, 56.5, 34.5, 1, 1, 0, '2017-09-11 15:43:35', '2017-09-30 12:39:44'),
(7, 'test budget', 2, 54, 24, 2, 1, 0, '2017-09-11 19:54:33', '2017-09-30 13:27:35');

-- --------------------------------------------------------

--
-- Table structure for table `ts_categories`
--

CREATE TABLE `ts_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `parent_id` int(11) NOT NULL,
  `category_index` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1:active;0:inactive',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ts_categories`
--

INSERT INTO `ts_categories` (`id`, `name`, `description`, `parent_id`, `category_index`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(15, 'Business Study', 'Business Study', 0, 0, 1, 0, '2017-11-03 08:30:49', '2017-11-03 08:30:49'),
(16, 'Computer Science', 'Computer Science', 0, 1, 1, 0, '2017-11-03 08:30:57', '2017-11-03 08:33:10'),
(17, 'Creative & Performance Arts', 'Creative & Performance Arts', 0, 2, 1, 0, '2017-11-03 08:31:05', '2017-11-03 08:33:10'),
(18, 'English', 'English', 0, 3, 1, 0, '2017-11-03 08:31:16', '2017-11-03 08:33:10'),
(19, 'Foreign Languages', 'Foreign Languages', 0, 4, 1, 0, '2017-11-03 08:31:21', '2017-11-03 08:33:10'),
(20, 'Math', 'Math', 0, 5, 1, 0, '2017-11-03 08:31:28', '2017-11-03 08:33:10'),
(21, 'Project Management', 'Project Management', 0, 6, 1, 0, '2017-11-03 08:31:34', '2017-11-03 08:33:10'),
(22, 'Science', 'Science', 0, 7, 1, 0, '2017-11-03 08:31:39', '2017-11-03 08:33:10'),
(23, 'Social Science', 'Social Science', 0, 8, 1, 0, '2017-11-03 08:31:45', '2017-11-03 08:33:10'),
(24, 'Speech Disability', 'Speech Disability', 0, 9, 1, 0, '2017-11-03 08:31:50', '2017-11-03 08:33:10'),
(25, 'Sports', 'Sports', 0, 10, 1, 0, '2017-11-03 08:31:55', '2017-11-03 08:33:10'),
(26, 'Study Skills', 'Study Skills', 0, 11, 1, 0, '2017-11-03 08:32:01', '2017-11-03 08:33:17'),
(27, 'Test Prep', 'Test Prep', 0, 12, 1, 0, '2017-11-03 08:32:06', '2017-11-03 08:33:17');

-- --------------------------------------------------------

--
-- Table structure for table `ts_currency`
--

CREATE TABLE `ts_currency` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `symbol` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:inactive;1:active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ts_currency`
--

INSERT INTO `ts_currency` (`id`, `name`, `symbol`, `status`, `created_at`, `updated_at`) VALUES
(1, 'USD', '$', 0, NULL, '2017-09-19 15:32:06'),
(2, 'GBP', '£', 1, NULL, '2017-09-19 15:32:06');

-- --------------------------------------------------------

--
-- Table structure for table `ts_default_percentage`
--

CREATE TABLE `ts_default_percentage` (
  `id` int(11) NOT NULL,
  `percentage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_default_percentage`
--

INSERT INTO `ts_default_percentage` (`id`, `percentage`) VALUES
(1, 60),
(2, 70),
(3, 80),
(4, 90),
(5, 100);

-- --------------------------------------------------------

--
-- Table structure for table `ts_email_templete`
--

CREATE TABLE `ts_email_templete` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `subject` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `message` text COLLATE utf8_unicode_ci,
  `type` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT 'admin or user',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ts_hire_freelancer`
--

CREATE TABLE `ts_hire_freelancer` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `freelancer_id` int(11) NOT NULL,
  `payment_type` int(11) NOT NULL COMMENT '1 = Weekly, 2 = Complete',
  `initial_amt` double NOT NULL,
  `project_hours` int(11) NOT NULL,
  `hours_per_week` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `agreement_desc` text NOT NULL,
  `project_days` int(11) NOT NULL,
  `project_weeks` int(11) NOT NULL,
  `per_week_amt` double NOT NULL,
  `total_project_cost` double NOT NULL,
  `intent` varchar(255) DEFAULT NULL,
  `payer_id` varchar(255) DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `payment_token` varchar(255) DEFAULT NULL,
  `payment_status` int(11) NOT NULL DEFAULT '0',
  `payment_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_hire_freelancer`
--

INSERT INTO `ts_hire_freelancer` (`id`, `project_id`, `freelancer_id`, `payment_type`, `initial_amt`, `project_hours`, `hours_per_week`, `start_date`, `end_date`, `agreement_desc`, `project_days`, `project_weeks`, `per_week_amt`, `total_project_cost`, `intent`, `payer_id`, `payment_id`, `payment_token`, `payment_status`, `payment_created`) VALUES
(22, 8, 3, 2, 5500, 5000, 500, '2017-11-01 00:00:00', '2018-01-10 00:00:00', 'Test Payment', 70, 10, 0, 5500, 'sale', 'EAY5ZPY4FD82G', 'PAY-3C952899Y8657083ALH3P46A', 'EC-80201231NB717811P', 1, '2017-10-30 10:27:28'),
(23, 9, 3, 1, 26, 200, 100, '2017-11-10 00:00:00', '2017-11-24 00:00:00', 'Test Payment by Jameela', 14, 2, 2600, 5200, 'sale', 'EAY5ZPY4FD82G', 'PAY-4AG87460WD104842KLH3P5SQ', 'EC-1PB05381WW526621J', 1, '2017-10-30 10:28:43'),
(24, 15, 4, 2, 1000, 1000, 500, '2017-11-03 00:00:00', '2017-11-17 00:00:00', 'Test Start', 14, 2, 0, 1000, NULL, NULL, NULL, NULL, 0, '2017-11-02 14:18:02');

-- --------------------------------------------------------

--
-- Table structure for table `ts_key_tags`
--

CREATE TABLE `ts_key_tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_key_tags`
--

INSERT INTO `ts_key_tags` (`id`, `name`, `color_code`) VALUES
(1, 'Recruiter', '#8c3cd6'),
(2, 'Featured', '#f77d0e'),
(3, 'Urgent', '#e02a28'),
(4, 'Private', '#ffa32d');

-- --------------------------------------------------------

--
-- Table structure for table `ts_packages`
--

CREATE TABLE `ts_packages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `amount` float NOT NULL,
  `key_tags` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1:Active;0:Inactive',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1:Deleted;0:Deleted',
  `created_at` datetime DEFAULT NULL,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_packages`
--

INSERT INTO `ts_packages` (`id`, `name`, `description`, `amount`, `key_tags`, `status`, `is_deleted`, `created_at`, `modified_at`) VALUES
(1, 'Success Bundle', 'We curated this custom bundle to attract the best freelancers to your project. Make your job more visible', 1234, '1,3,2', 1, 1, '2017-09-12 19:34:50', '2017-09-12 14:04:50'),
(2, 'Success Bundles', 'We curated this custom bundle to attract the best  er', 12.7, '1', 1, 0, '2017-09-12 20:06:54', '2017-09-12 14:36:54'),
(3, 'Expert help finding a freelancer', 'test', 1286.9, '2', 0, 0, '2017-09-13 12:07:57', '2017-09-13 06:37:57'),
(4, 'Featured', 'Featured Projects', 10, '1,3,5,7,6,4,8,2', 1, 0, '2017-10-03 12:15:23', '2017-10-03 11:15:23');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_abuse`
--

CREATE TABLE `ts_project_abuse` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `comments` varchar(1000) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_project_abuse`
--

INSERT INTO `ts_project_abuse` (`id`, `user_id`, `project_id`, `reason`, `comments`, `is_deleted`, `status`, `created_at`, `updated_at`) VALUES
(16, 3, 8, '17', 'aaaa', 0, 1, '2017-10-05 19:11:02', '2017-10-05 19:11:02'),
(17, 3, 8, '2', 'This is a Fake Project', 0, 1, '2017-10-05 19:11:39', '2017-10-05 19:11:39'),
(18, 3, 8, '1', 'fff', 0, 1, '2017-10-05 19:12:58', '2017-10-05 19:12:58'),
(19, 3, 8, '1', 'Client is disclosing the contact information.', 0, 1, '2017-10-05 19:26:42', '2017-10-05 19:26:42'),
(20, 3, 8, '15', 'hghghgh', 0, 1, '2017-10-09 11:57:39', '2017-10-09 11:57:39'),
(21, 3, 8, '15', 'dddd', 0, 1, '2017-10-09 20:55:17', '2017-10-09 20:55:17'),
(22, 3, 8, '15', 'asasas', 0, 1, '2017-10-09 20:56:06', '2017-10-09 20:56:06'),
(23, 3, 8, '16', 'cvdfdfd', 0, 1, '2017-10-09 20:56:45', '2017-10-09 20:56:45'),
(24, 3, 8, '17', 'dfdfdfd', 0, 1, '2017-10-09 20:57:53', '2017-10-09 20:57:53'),
(25, 3, 8, '18', 'vcbvcbffgf', 0, 1, '2017-10-09 20:58:14', '2017-10-09 20:58:14');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_bids`
--

CREATE TABLE `ts_project_bids` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bid_amount` varchar(255) NOT NULL,
  `deliver_days` int(11) NOT NULL,
  `bid_summary` varchar(500) NOT NULL,
  `skills_summary` varchar(500) NOT NULL,
  `question_for_employer` varchar(500) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0 = Hide This, 1 = Show This',
  `is_decline` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_project_bids`
--

INSERT INTO `ts_project_bids` (`id`, `project_id`, `user_id`, `bid_amount`, `deliver_days`, `bid_summary`, `skills_summary`, `question_for_employer`, `status`, `is_decline`, `created_at`, `updated_at`) VALUES
(1, 8, 3, '100', 10, 'demo', 'demo', 'demo content', 0, 0, '2017-10-09 23:42:57', '2017-10-30 15:57:28'),
(2, 9, 3, '1000', 10, 'dfdfdf', 'dfdfdfdf', 'fdgfdgdfg', 0, 0, '2017-10-10 19:03:48', '2017-10-30 15:58:43'),
(3, 9, 3, '1000', 10, 'dfdfdf', 'dfdfdfdf', 'fdgfdgdfg', 0, 1, '2017-10-10 19:03:54', '2017-10-14 15:20:34'),
(4, 9, 3, '1000', 10, 'dfdfdf', 'dfdfdfdf', 'fdgfdgdfg', 0, 0, '2017-10-10 19:04:49', '2017-10-16 19:26:19'),
(5, 9, 3, '1000', 10, 'dfdfdf', 'dfdfdfdf', 'fdgfdgdfg', 0, 0, '2017-10-10 19:04:53', '2017-10-30 15:58:43'),
(6, 13, 3, '5200', 45, 'sddf', 'dfdfdfd', 'sdsdsd', 0, 0, '2017-10-10 19:08:35', '2017-10-16 19:26:29'),
(7, 14, 3, '7895', 452, 'sdsds', 'dsdsds', 'sdfsfdfdfdf', 0, 0, '2017-10-10 19:11:03', '2017-10-16 19:26:27'),
(9, 15, 3, '78951', 421, 'adsd', 'jhghjgjh', 'azsdsdsds', 0, 0, '2017-10-10 19:12:53', '2017-10-14 12:30:47'),
(10, 8, 4, '5200', 10, 'sdsdsdd', 'gfgfgfg', 'sdsdsdsd', 0, 0, '2017-10-10 19:17:35', '2017-10-16 19:26:36'),
(14, 15, 4, '100', 20, 'sddsf', 'dfdfdf', 'dfdfd', 1, 0, '2017-10-11 22:12:53', '2017-10-14 12:25:17'),
(15, 15, 4, '100', 20, 'sddsf', 'dfdfdf', 'dfdfd', 1, 0, '2017-10-11 22:15:44', '2017-10-14 12:25:17'),
(16, 15, 4, '100', 20, 'sddsf', 'dfdfdf', 'dfdfd', 1, 0, '2017-10-11 22:16:02', '2017-10-14 12:25:17'),
(17, 9, 4, '850', 45, 'Test Summary', 'Test Skills', 'Test question for Employer', 0, 0, '2017-10-11 22:19:49', '2017-10-16 19:26:40');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_complaints`
--

CREATE TABLE `ts_project_complaints` (
  `id` int(11) NOT NULL,
  `reference_number` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(500) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '2' COMMENT '1 = Freelancer, 2 = Employer',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_project_complaints`
--

INSERT INTO `ts_project_complaints` (`id`, `reference_number`, `project_id`, `user_id`, `message`, `type`, `created_at`, `updated_at`) VALUES
(1, 10005, 8, 2, 'Test', 2, '2017-10-30 19:36:53', '2017-10-30 19:36:53'),
(2, 10006, 9, 2, 'werwerewwrewrewer', 2, '2017-10-30 19:37:34', '2017-10-30 19:37:34'),
(3, 10006, 9, 2, 'rertyt', 2, '2017-10-30 19:38:09', '2017-10-30 19:38:09'),
(4, 10005, 8, 2, 'fgfgfgfgfg', 2, '2017-10-30 19:39:06', '2017-10-30 19:39:06'),
(5, 10005, 8, 2, 'utrurtyrfjgyf', 2, '2017-10-30 19:39:15', '2017-10-30 19:39:15'),
(6, 10005, 8, 2, 'ffghghghghg', 2, '2017-10-30 19:39:19', '2017-10-30 19:39:19'),
(7, 10005, 8, 2, 'gfhhfd', 2, '2017-10-30 19:40:41', '2017-10-30 19:40:41'),
(8, 10005, 8, 2, 'sdsfdfgfg', 2, '2017-10-30 19:55:35', '2017-10-30 19:55:35'),
(9, 10006, 9, 2, 'sdgfgfgg', 2, '2017-10-30 19:55:40', '2017-10-30 19:55:40');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_files`
--

CREATE TABLE `ts_project_files` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `file_name` text,
  `type` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1:active,0:inactive',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:not deleted, 1:deleted',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_project_files`
--

INSERT INTO `ts_project_files` (`id`, `project_id`, `file_name`, `type`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 8, 'ad924fa3d5949e4cdeeac807618dd98d.png', 'png', 1, 0, '2017-09-30 14:37:06', '2017-09-30 13:37:06'),
(2, 9, '91e5bf6023eab1bf08dca6cfcb66b3fb.png', 'png', 1, 0, '2017-09-30 15:23:41', '2017-09-30 14:23:41'),
(3, 13, 'd829ec5a83e7ea6ce88b88fdfe65c41e.png', 'png', 1, 0, '2017-09-30 15:36:30', '2017-09-30 14:36:30'),
(4, 14, 'd396b3e93e5773f9bb96ce2e5960f94a.jpg', 'jpg', 1, 0, '2017-09-30 15:38:10', '2017-09-30 14:38:10'),
(5, 15, 'f0c9c97a4f206c396f10ef005faebced.jpg', 'jpg', 1, 0, '2017-09-30 15:39:03', '2017-09-30 14:39:03'),
(6, 16, '744448363f15f03ed56430b582d409e7.jpg', 'jpg', 1, 0, '2017-10-09 13:06:39', '2017-10-09 12:06:39'),
(7, 17, '180f562a0c788a4171bab285613053b2.jpg', 'jpg', 1, 0, '2017-10-09 13:07:12', '2017-10-09 12:07:12'),
(8, 18, '91c247956a7269f6ee06b66918cc44df.jpg', 'jpg', 1, 0, '2017-10-09 13:07:54', '2017-10-09 12:07:54'),
(9, 19, '4af789490374f495320f9b0904434688.jpg', 'jpg', 1, 0, '2017-10-09 13:08:39', '2017-10-09 12:08:39'),
(10, 20, '2bd43c53456d5f8b3cefefd89e5cdae0.png', 'png', 1, 0, '2017-10-09 13:09:03', '2017-10-09 12:09:03'),
(11, 21, '6d9f0510bb482f3be43b855e6ae9d480.odp', 'odp', 1, 0, '2017-10-30 13:10:08', '2017-10-30 13:10:08');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_messages`
--

CREATE TABLE `ts_project_messages` (
  `id` int(11) NOT NULL,
  `bidder_id` int(11) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_project_messages`
--

INSERT INTO `ts_project_messages` (`id`, `bidder_id`, `message`, `created_at`, `updated_at`) VALUES
(1, 1, 'ppprr', '2017-10-14 16:15:57', '2017-10-14 16:15:57'),
(2, 1, 'ppprrcxnfhgfhfgh', '2017-10-14 16:16:05', '2017-10-14 16:16:05'),
(3, 1, 'asasas', '2017-10-14 16:17:47', '2017-10-14 16:17:47'),
(4, 1, 'sdsdsdsd', '2017-10-14 16:20:10', '2017-10-14 16:20:10'),
(5, 1, 'asasas', '2017-10-14 16:21:48', '2017-10-14 16:21:48'),
(6, 1, 'dffdf', '2017-10-14 16:23:28', '2017-10-14 16:23:28'),
(7, 4, 'dfdf', '2017-10-14 16:23:33', '2017-10-14 16:23:33'),
(8, 10, 'sddgthfdhgf', '2017-10-14 16:23:49', '2017-10-14 16:23:49'),
(9, 10, 'sdgdhf', '2017-10-14 16:23:51', '2017-10-14 16:23:51'),
(10, 3, 'Test message, you are welcome for this project', '2017-10-30 18:20:59', '2017-10-30 18:20:59'),
(11, 3, 'asasasa', '2017-10-30 19:41:31', '2017-10-30 19:41:31'),
(12, 3, 'asasasa', '2017-10-30 19:55:26', '2017-10-30 19:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_milestones`
--

CREATE TABLE `ts_project_milestones` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_project_milestones`
--

INSERT INTO `ts_project_milestones` (`id`, `project_id`, `user_id`, `amount`, `description`, `created_at`, `updated_at`) VALUES
(1, 15, 4, '111', 'dfdf', '2017-10-11 22:16:02', '2017-10-11 22:16:02'),
(2, 15, 4, '333', 'dfdfd', '2017-10-11 22:16:02', '2017-10-11 22:16:02'),
(3, 9, 4, '100', 'Task 1', '2017-10-11 22:19:49', '2017-10-11 22:19:49'),
(4, 9, 4, '200', 'Task 2', '2017-10-11 22:19:49', '2017-10-11 22:19:49'),
(5, 9, 4, '100', 'Task 3', '2017-10-11 22:19:49', '2017-10-11 22:19:49'),
(6, 9, 4, '200', 'Task 4', '2017-10-11 22:19:49', '2017-10-11 22:19:49'),
(7, 9, 4, '150', 'Task 5', '2017-10-11 22:19:49', '2017-10-11 22:19:49');

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_skills`
--

CREATE TABLE `ts_project_skills` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `skill_id` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_project_skills`
--

INSERT INTO `ts_project_skills` (`id`, `project_id`, `skill_id`, `category_id`) VALUES
(8, 5, '8', 2),
(12, 8, '39', 7),
(13, 8, '38', 7),
(14, 8, '43', 7),
(15, 8, '41', 7),
(16, 8, '42', 7),
(17, 8, '37', 7),
(18, 8, '40', 7),
(19, 8, '38', 7),
(20, 8, '39', 7),
(21, 8, '42', 7),
(22, 8, '46', 9),
(23, 8, '44', 9),
(24, 8, '47', 9),
(25, 9, '38', 7),
(26, 9, '39', 7),
(54, 13, '29', 1),
(55, 13, '42', 7),
(56, 13, '41', 7),
(57, 14, '18', 1),
(58, 14, '25', 1),
(59, 14, '19', 1),
(60, 15, '32', 2),
(61, 15, '33', 2),
(62, 15, '15', 1),
(63, 15, '26', 1),
(64, 15, '27', 1),
(65, 16, '32', 2),
(66, 16, '33', 2),
(67, 16, '36', 2),
(68, 17, '32', 2),
(69, 17, '33', 2),
(70, 17, '36', 2),
(71, 18, '32', 2),
(72, 18, '33', 2),
(73, 18, '36', 2),
(74, 19, '32', 2),
(75, 19, '33', 2),
(76, 19, '36', 2),
(77, 20, '32', 2),
(78, 21, '23', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ts_project_tasks`
--

CREATE TABLE `ts_project_tasks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `project_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1:Active,0:Inactive',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1:Deleted:Not deleted',
  `created_at` datetime DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ts_projects`
--

CREATE TABLE `ts_projects` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(500) NOT NULL,
  `description` text,
  `category` int(11) DEFAULT NULL,
  `budget` int(11) DEFAULT NULL,
  `urgency` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL COMMENT '1:project basis,2:Hourly basis',
  `approved` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:not approved,1:approved',
  `reference_number` bigint(20) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:not started;1:in progress;2:completed',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1:deleted;0:not deleted',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_projects`
--

INSERT INTO `ts_projects` (`id`, `user_id`, `name`, `slug`, `description`, `category`, `budget`, `urgency`, `type`, `approved`, `reference_number`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 2, 'Test Project', 'test-project', 'Test Project Description', 1, 5, 5, 0, 1, 10001, 0, 1, '2017-09-19 10:50:00', '2017-10-30 13:03:10'),
(4, 2, 'Test Project 1', 'test-project-1', 'Test Project 1 description', 1, 5, 6, 0, 1, 10002, 0, 1, '2017-09-19 11:48:06', '2017-10-30 13:03:15'),
(5, 2, 'Test Project 2', 'test-project-2', 'Test Project 2 Description', 1, 6, 4, 0, 1, 10003, 0, 0, '2017-09-19 11:49:49', '2017-10-30 13:03:18'),
(6, 2, 'Test  Project 11', 'test-project-11', 'Test  Project 11 Description', 1, 6, 8, 0, 1, 10004, 0, 1, '2017-09-19 12:33:19', '2017-10-30 13:03:23'),
(8, 2, 'ActionScript Developer', 'actionscript-developer', 'Need developer who can work on ActionScipt with PHP', 1, 6, 4, 1, 1, 10005, 0, 0, '2017-09-30 14:37:06', '2017-10-30 13:03:27'),
(9, 2, 'Need HTML5 Developer', 'need-html5-developer', 'Need HTML5 Developer Need HTML5 Developer Need HTML5 Developer', 1, 7, 7, 2, 1, 10006, 0, 0, '2017-09-30 15:23:41', '2017-10-30 13:03:30'),
(13, 2, 'Need Oracle Developer', 'need-oracle-developer', 'Need Oracle Developer Need Oracle Developer Need Oracle Developer', 1, 6, 8, 1, 1, 10007, 0, 0, '2017-09-30 15:36:30', '2017-10-30 13:03:34'),
(14, 2, 'Build a Website', 'build-a-website', 'Build a Website for our company', 1, 6, 6, 1, 1, 10008, 0, 0, '2017-09-30 15:38:09', '2017-10-30 13:03:38'),
(15, 2, 'Build a Mobile application', 'build-a-mobile-application', 'Build a Mobile application Build a Mobile application Build a Mobile application', 2, 7, 4, 2, 1, 10009, 0, 0, '2017-09-30 15:39:03', '2017-10-30 13:03:42'),
(16, 2, 'a', 'rfgegegbvdfs', 'fdgfdgf', 2, 7, 5, 2, 1, 10010, 0, 1, '2017-10-09 13:06:39', '2017-10-30 13:03:48'),
(17, 2, 'b', 'rfgegegbvdfs-1', 'fdgfdgf', 2, 7, 5, 2, 0, 10011, 0, 1, '2017-10-09 13:07:12', '2017-10-30 13:03:53'),
(18, 2, 'c', 'rfgegegbvdfs-2', 'fdgfdgf', 2, 7, 5, 2, 1, 10012, 0, 1, '2017-10-09 13:07:54', '2017-10-30 13:03:57'),
(19, 2, 'd', 'rfgegegbvdfs-3', 'fdgfdgf', 2, 7, 5, 2, 1, 10013, 0, 1, '2017-10-09 13:08:39', '2017-10-30 13:04:01'),
(20, 2, 'e', 'gfjgh', 'jhmjvbhjkhgjk', 6, 6, 4, 1, 0, 10014, 0, 1, '2017-10-09 13:09:03', '2017-10-30 13:04:04'),
(21, 2, 'fgfdgdfg', 'fgfdgdfg', 'dghgfhgfhjfg', 1, 6, 4, 1, 0, 10015, 0, 0, '2017-10-30 13:10:08', '2017-10-30 13:10:08');

-- --------------------------------------------------------

--
-- Table structure for table `ts_review_rating`
--

CREATE TABLE `ts_review_rating` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `full_review` text,
  `job_quality` int(11) DEFAULT NULL,
  `communication` int(11) DEFAULT NULL,
  `availaibility` int(11) DEFAULT NULL,
  `time_management` int(11) DEFAULT NULL,
  `clarity_of_requirements` int(11) DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1:employer to freelancer;2:freelancer to employer',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0:inactive;1:active',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:not deleted;1:deleted',
  `created_at` datetime DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ts_roles`
--

CREATE TABLE `ts_roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_name` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `role_details` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ts_roles`
--

INSERT INTO `ts_roles` (`id`, `role_name`, `role_details`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'This is Super Admin role', NULL, '2017-11-03 08:20:32'),
(2, 'Teacher', 'This is Teacher role', NULL, '2017-11-03 08:20:28'),
(3, 'Student', 'This is Student role', NULL, '2017-11-03 08:20:20');

-- --------------------------------------------------------

--
-- Table structure for table `ts_subjects`
--

CREATE TABLE `ts_subjects` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `parent_category_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1:active, 0: inactive',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:not deleted, 1:delete',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ts_subjects`
--

INSERT INTO `ts_subjects` (`id`, `name`, `parent_category_id`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(52, 'Arabic', 11, 1, 1, '2017-09-26 09:31:41', '2017-11-03 12:23:12'),
(53, 'CakePHP', 4, 1, 1, '2017-09-26 11:14:57', '2017-11-03 12:23:16'),
(54, 'PHP7', 16, 1, 0, '2017-11-03 10:06:03', '2017-11-03 10:06:03'),
(55, 'Calculus', 20, 1, 0, '2017-11-03 12:27:23', '2017-11-03 12:27:23'),
(56, 'Projects', 21, 1, 0, '2017-11-03 12:27:41', '2017-11-03 12:27:49');

-- --------------------------------------------------------

--
-- Table structure for table `ts_urgency`
--

CREATE TABLE `ts_urgency` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `days` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ts_urgency`
--

INSERT INTO `ts_urgency` (`id`, `name`, `days`) VALUES
(4, NULL, 1),
(5, NULL, 7),
(6, NULL, 14),
(7, NULL, 21),
(8, NULL, 30);

-- --------------------------------------------------------

--
-- Table structure for table `ts_users`
--

CREATE TABLE `ts_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `role_id` int(11) NOT NULL,
  `slug` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_email_verified` tinyint(4) NOT NULL DEFAULT '0',
  `token` text COLLATE utf8_unicode_ci,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ts_users`
--

INSERT INTO `ts_users` (`id`, `email`, `password`, `role_id`, `slug`, `is_email_verified`, `token`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'admin@dev.com', 'e10adc3949ba59abbe56e057f20f883e', 1, 'admin', 1, 'MSYxNmFjZmI5NjFkOTEzNmViYTE4YmU3MjM1NWJlYWMyZTYxODE5MTgzNDZmN2RhN2FiZDQ2YTA1NTc2M2QyM2U2', 1, 0, '2017-09-06 14:14:57', '2017-11-03 12:51:08'),
(2, 'student@dev.com', 'e10adc3949ba59abbe56e057f20f883e', 2, 'student', 1, 'MiY0YTI2OTE0YWUwYjAyYTBhZmUxNWYwYWM1ZWMzZjI0YzhiZTRjMzE4Y2QxZjg3ZmRlZDhkMjY5ZTc3ZjQzNTY0', 1, 0, '2017-09-06 14:16:11', '2017-11-03 08:19:25'),
(3, 'teacher@dev.com', 'e10adc3949ba59abbe56e057f20f883e', 3, 'teacher', 1, 'MyYwYmQ1Y2JmMGVhMjE0Yzc5MDNkNGYyMThjMDMxMWFhNjAzYTk0ZWE2NjQ1MDU4ODJhNTNlYWQ2NjRjODYxMmVh', 1, 0, '2017-09-06 14:16:56', '2017-11-03 08:19:38');

-- --------------------------------------------------------

--
-- Table structure for table `ts_users_bank_details`
--

CREATE TABLE `ts_users_bank_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_code` varchar(100) NOT NULL,
  `bank_account_number` varchar(255) NOT NULL,
  `bank_iban` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_users_bank_details`
--

INSERT INTO `ts_users_bank_details` (`id`, `user_id`, `bank_name`, `bank_code`, `bank_account_number`, `bank_iban`) VALUES
(1, 3, 'asdsadhhhh', 'asdasd', 'asdadad', 'asdasd');

-- --------------------------------------------------------

--
-- Table structure for table `ts_users_profile`
--

CREATE TABLE `ts_users_profile` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `firstname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cover_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8_unicode_ci,
  `city` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `country` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `headline` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bio` varchar(1000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `hourly_rate` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ts_users_profile`
--

INSERT INTO `ts_users_profile` (`id`, `user_id`, `firstname`, `lastname`, `cover_image`, `profile_image`, `address`, `city`, `country`, `phone`, `headline`, `bio`, `hourly_rate`, `created_at`, `updated_at`) VALUES
(1, 1, 'Neil', 'Parsont', NULL, NULL, 'UK', 'UK', 'UK', '789456123', NULL, NULL, 0, '2017-09-07 07:40:30', '2017-11-03 08:24:15'),
(2, 2, 'Ruth', 'Ann', NULL, '846c9d514f16d3f27eab3f051f9c03b3.png', 'UK', 'UK', 'UK', '789456123', 'Telecommunications', 'We can provide work to all!!', 0, '2017-09-07 08:05:01', '2017-11-03 08:24:53'),
(3, 3, 'John', 'Wick', NULL, '6d29cdd4efdb6f056aa16237b6b5406c.png', 'UK', 'UK', 'Uk', '789456123', 'Web Designer & Developer', 'I am a web designer and developer with 15 years experience in the industry. I have done projects on my own as well as part of a large team.', 0, '2017-09-07 08:05:01', '2017-11-03 08:25:29');

-- --------------------------------------------------------

--
-- Table structure for table `ts_users_skills`
--

CREATE TABLE `ts_users_skills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_deleted` tinyint(11) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_users_skills`
--

INSERT INTO `ts_users_skills` (`id`, `user_id`, `skill_id`, `category_id`, `is_deleted`, `status`, `created_at`, `updated_at`) VALUES
(61, 3, 31, 1, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(62, 3, 17, 1, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(63, 3, 25, 1, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(64, 3, 23, 1, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(65, 3, 19, 1, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(66, 3, 26, 1, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(67, 3, 50, 10, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(68, 3, 52, 11, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(69, 3, 34, 2, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(70, 3, 32, 2, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(71, 3, 33, 2, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(72, 3, 35, 2, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(73, 3, 38, 7, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(74, 3, 42, 7, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(75, 3, 40, 7, 0, 1, '2017-10-05 18:59:57', '2017-10-25 19:24:21'),
(76, 4, 32, 2, 0, 1, '2017-10-10 19:16:01', '2017-10-11 11:45:51'),
(77, 4, 33, 2, 0, 1, '2017-10-10 19:16:01', '2017-10-11 11:45:51'),
(78, 4, 35, 2, 0, 1, '2017-10-10 19:16:01', '2017-10-11 11:45:51'),
(79, 4, 36, 2, 0, 1, '2017-10-10 19:16:01', '2017-10-11 11:45:51'),
(80, 4, 31, 1, 0, 1, '2017-10-11 11:45:51', '2017-10-11 11:45:51'),
(81, 4, 18, 1, 0, 1, '2017-10-11 11:45:51', '2017-10-11 11:45:51'),
(82, 4, 15, 1, 0, 1, '2017-10-11 11:45:51', '2017-10-11 11:45:51'),
(83, 4, 16, 1, 0, 1, '2017-10-11 11:45:51', '2017-10-11 11:45:51'),
(84, 3, 27, 1, 0, 1, '2017-10-25 19:24:21', '2017-10-25 19:24:21'),
(85, 3, 24, 1, 0, 1, '2017-10-25 19:24:21', '2017-10-25 19:24:21'),
(86, 3, 18, 1, 0, 1, '2017-10-25 19:24:21', '2017-10-25 19:24:21'),
(87, 3, 29, 1, 0, 1, '2017-10-25 19:24:21', '2017-10-25 19:24:21'),
(88, 3, 21, 1, 0, 1, '2017-10-25 19:24:21', '2017-10-25 19:24:21');

-- --------------------------------------------------------

--
-- Table structure for table `ts_violation_reasons`
--

CREATE TABLE `ts_violation_reasons` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `reason_index` tinyint(4) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ts_violation_reasons`
--

INSERT INTO `ts_violation_reasons` (`id`, `name`, `reason_index`, `is_deleted`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Posting contact Informatin', 0, 0, 1, '2017-10-04 23:01:46', '2017-10-04 23:01:46'),
(2, 'Fake project posted', 0, 0, 1, '2017-10-04 23:01:46', '2017-10-04 23:01:46'),
(15, 'Advertising another website', 0, 0, 1, '2017-10-04 19:36:37', '2017-10-05 00:06:37'),
(16, 'Obscenities or harassing behaviour', 0, 0, 1, '2017-10-04 19:36:45', '2017-10-05 00:06:45'),
(17, 'Non-full time project posted requiring abnormal bidding', 0, 0, 1, '2017-10-04 19:36:52', '2017-10-05 00:06:52'),
(18, 'Other', 0, 0, 1, '2017-10-04 19:36:59', '2017-10-05 00:06:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ts_budgets`
--
ALTER TABLE `ts_budgets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_categories`
--
ALTER TABLE `ts_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_currency`
--
ALTER TABLE `ts_currency`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_default_percentage`
--
ALTER TABLE `ts_default_percentage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_email_templete`
--
ALTER TABLE `ts_email_templete`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_hire_freelancer`
--
ALTER TABLE `ts_hire_freelancer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_key_tags`
--
ALTER TABLE `ts_key_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_packages`
--
ALTER TABLE `ts_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_abuse`
--
ALTER TABLE `ts_project_abuse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_bids`
--
ALTER TABLE `ts_project_bids`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_complaints`
--
ALTER TABLE `ts_project_complaints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_files`
--
ALTER TABLE `ts_project_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_messages`
--
ALTER TABLE `ts_project_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_milestones`
--
ALTER TABLE `ts_project_milestones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_skills`
--
ALTER TABLE `ts_project_skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_project_tasks`
--
ALTER TABLE `ts_project_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_projects`
--
ALTER TABLE `ts_projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_number` (`reference_number`);

--
-- Indexes for table `ts_review_rating`
--
ALTER TABLE `ts_review_rating`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_roles`
--
ALTER TABLE `ts_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_subjects`
--
ALTER TABLE `ts_subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_urgency`
--
ALTER TABLE `ts_urgency`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_users`
--
ALTER TABLE `ts_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_users_bank_details`
--
ALTER TABLE `ts_users_bank_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_users_profile`
--
ALTER TABLE `ts_users_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_users_skills`
--
ALTER TABLE `ts_users_skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ts_violation_reasons`
--
ALTER TABLE `ts_violation_reasons`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ts_budgets`
--
ALTER TABLE `ts_budgets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `ts_categories`
--
ALTER TABLE `ts_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `ts_currency`
--
ALTER TABLE `ts_currency`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `ts_default_percentage`
--
ALTER TABLE `ts_default_percentage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `ts_email_templete`
--
ALTER TABLE `ts_email_templete`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ts_hire_freelancer`
--
ALTER TABLE `ts_hire_freelancer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `ts_key_tags`
--
ALTER TABLE `ts_key_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `ts_packages`
--
ALTER TABLE `ts_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `ts_project_abuse`
--
ALTER TABLE `ts_project_abuse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `ts_project_bids`
--
ALTER TABLE `ts_project_bids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `ts_project_complaints`
--
ALTER TABLE `ts_project_complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `ts_project_files`
--
ALTER TABLE `ts_project_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `ts_project_messages`
--
ALTER TABLE `ts_project_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `ts_project_milestones`
--
ALTER TABLE `ts_project_milestones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `ts_project_skills`
--
ALTER TABLE `ts_project_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;
--
-- AUTO_INCREMENT for table `ts_project_tasks`
--
ALTER TABLE `ts_project_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ts_projects`
--
ALTER TABLE `ts_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `ts_review_rating`
--
ALTER TABLE `ts_review_rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ts_roles`
--
ALTER TABLE `ts_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `ts_subjects`
--
ALTER TABLE `ts_subjects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT for table `ts_urgency`
--
ALTER TABLE `ts_urgency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `ts_users`
--
ALTER TABLE `ts_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `ts_users_bank_details`
--
ALTER TABLE `ts_users_bank_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `ts_users_profile`
--
ALTER TABLE `ts_users_profile`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `ts_users_skills`
--
ALTER TABLE `ts_users_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;
--
-- AUTO_INCREMENT for table `ts_violation_reasons`
--
ALTER TABLE `ts_violation_reasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
