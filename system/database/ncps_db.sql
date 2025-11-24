-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2025 at 04:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ncps_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cancel_appointment` (IN `p_appt_id` INT, IN `p_reason` TEXT, IN `p_category` VARCHAR(50))   BEGIN
    UPDATE appointments 
    SET status = 'Cancelled', 
        cancellation_reason = p_reason,
        cancellation_category = p_category
    WHERE appointment_id = p_appt_id;
    
    -- Log this action
    INSERT INTO activity_logs (action_type, description) 
    VALUES ('Cancellation', CONCAT('Appointment #', p_appt_id, ' cancelled by user.'));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_admin_dashboard_stats` ()   BEGIN
    SELECT 
        (SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE) AS today_appointments,
        (SELECT COUNT(*) FROM appointments WHERE status = 'Pending') AS pending_requests,
        (SELECT COUNT(*) FROM technician_profiles WHERE availability_status = 'Available') AS available_techs,
        (SELECT COALESCE(SUM(total_cost), 0) FROM appointments WHERE status = 'Completed' AND MONTH(appointment_date) = MONTH(CURRENT_DATE)) AS monthly_revenue;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_customer_stats` (IN `p_customer_id` INT)   BEGIN
    SELECT 
        (SELECT COUNT(*) FROM appointments WHERE customer_id = p_customer_id AND status = 'Pending') AS pending_count,
        (SELECT COUNT(*) FROM appointments WHERE customer_id = p_customer_id AND status = 'Completed') AS completed_count,
        -- Get details of the NEXT upcoming appointment
        (SELECT appointment_date FROM appointments 
         WHERE customer_id = p_customer_id AND status IN ('Confirmed', 'Pending') AND appointment_date > NOW() 
         ORDER BY appointment_date ASC LIMIT 1) AS next_appointment;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action_type`, `description`, `created_at`) VALUES
(1, 7, 'User Action', 'Updated Profile', '2025-10-10 00:17:51'),
(2, 16, 'User Action', 'Contacted Support', '2025-11-17 22:15:44'),
(3, 30, 'User Action', 'Viewed Dashboard', '2025-10-20 19:15:48'),
(4, 14, 'User Action', 'Updated Profile', '2025-09-25 21:34:31'),
(5, 15, 'User Action', 'Changed Password', '2025-09-12 23:02:37'),
(6, 1, 'User Action', 'Viewed Service List', '2025-10-21 07:35:34'),
(7, 9, 'User Action', 'User Logged In', '2025-09-06 21:07:14'),
(8, 6, 'User Action', 'Checked Appointments', '2025-09-17 18:08:14'),
(9, 15, 'User Action', 'Updated Profile', '2025-10-14 22:34:12'),
(10, 28, 'User Action', 'Checked Appointments', '2025-11-18 15:29:21'),
(11, 5, 'User Action', 'Changed Password', '2025-10-01 03:36:59'),
(12, 26, 'User Action', 'Updated Profile', '2025-09-16 02:54:04'),
(13, 28, 'User Action', 'Contacted Support', '2025-09-09 12:20:19'),
(14, 31, 'User Action', 'User Logged In', '2025-11-15 03:44:57'),
(15, 26, 'User Action', 'Contacted Support', '2025-11-10 18:13:20'),
(16, 19, 'User Action', 'Checked Appointments', '2025-09-09 09:10:23'),
(17, 5, 'User Action', 'Updated Profile', '2025-09-20 15:14:41'),
(18, 14, 'User Action', 'User Logged In', '2025-11-20 03:17:59'),
(19, 23, 'User Action', 'Contacted Support', '2025-10-10 05:26:30'),
(20, 28, 'User Action', 'Contacted Support', '2025-09-02 18:28:16'),
(21, 29, 'User Action', 'User Logged In', '2025-09-14 13:28:31'),
(22, 26, 'User Action', 'Downloaded Report', '2025-11-04 09:08:15'),
(23, 16, 'User Action', 'Checked Appointments', '2025-10-30 21:23:44'),
(24, 1, 'User Action', 'Updated Profile', '2025-08-31 15:27:13'),
(25, 17, 'User Action', 'Viewed Service List', '2025-10-17 06:15:46'),
(26, 26, 'User Action', 'User Logged In', '2025-10-11 16:57:33'),
(27, 14, 'User Action', 'Viewed Service List', '2025-09-16 21:25:09'),
(28, 26, 'User Action', 'Changed Password', '2025-11-12 10:48:14'),
(29, 19, 'User Action', 'Changed Password', '2025-11-06 09:15:15'),
(30, 18, 'User Action', 'Changed Password', '2025-10-05 14:32:05'),
(31, 14, 'User Action', 'Viewed Service List', '2025-11-11 20:52:50'),
(32, 10, 'User Action', 'User Logged In', '2025-09-05 15:46:37'),
(33, 20, 'User Action', 'Viewed Service List', '2025-11-19 12:10:51'),
(34, 22, 'User Action', 'User Logged In', '2025-10-31 04:11:27'),
(35, 20, 'User Action', 'Downloaded Report', '2025-08-31 23:41:29'),
(36, 2, 'User Action', 'Downloaded Report', '2025-10-29 21:30:32'),
(37, 14, 'User Action', 'Downloaded Report', '2025-11-02 17:39:15'),
(38, 24, 'User Action', 'Viewed Dashboard', '2025-09-19 04:45:18'),
(39, 26, 'User Action', 'Viewed Dashboard', '2025-11-09 22:31:49'),
(40, 18, 'User Action', 'Updated Profile', '2025-09-07 19:34:46'),
(41, 28, 'User Action', 'Viewed Dashboard', '2025-09-20 05:00:02'),
(42, 15, 'User Action', 'Updated Profile', '2025-09-27 17:18:20'),
(43, 21, 'User Action', 'Viewed Dashboard', '2025-10-01 05:23:41'),
(44, 3, 'User Action', 'Downloaded Report', '2025-10-25 22:58:57'),
(45, 21, 'User Action', 'Viewed Dashboard', '2025-09-13 01:01:47'),
(46, 27, 'User Action', 'Updated Profile', '2025-09-24 11:23:57'),
(47, 11, 'User Action', 'Contacted Support', '2025-09-02 03:44:06'),
(48, 7, 'User Action', 'Checked Appointments', '2025-11-15 15:44:22'),
(49, 26, 'User Action', 'Viewed Service List', '2025-10-16 10:59:03'),
(50, 16, 'User Action', 'Viewed Dashboard', '2025-10-08 17:39:46'),
(51, 11, 'User Action', 'Changed Password', '2025-09-25 11:12:18'),
(52, 18, 'User Action', 'Viewed Dashboard', '2025-09-05 12:24:12'),
(53, 23, 'User Action', 'Downloaded Report', '2025-10-13 21:43:31'),
(54, 31, 'User Action', 'User Logged In', '2025-11-09 01:57:27'),
(55, 16, 'User Action', 'Viewed Service List', '2025-10-04 08:15:39'),
(56, 19, 'User Action', 'Viewed Service List', '2025-10-11 20:05:07'),
(57, 28, 'User Action', 'Checked Appointments', '2025-09-02 14:34:47'),
(58, 16, 'User Action', 'Contacted Support', '2025-09-25 19:10:27'),
(59, 23, 'User Action', 'Viewed Dashboard', '2025-09-11 12:54:59'),
(60, 20, 'User Action', 'Viewed Service List', '2025-09-09 16:12:23'),
(61, 15, 'User Action', 'User Logged In', '2025-11-17 00:49:50'),
(62, 25, 'User Action', 'Checked Appointments', '2025-09-20 05:53:04'),
(63, 20, 'User Action', 'Changed Password', '2025-09-19 05:40:11'),
(64, 26, 'User Action', 'Updated Profile', '2025-09-19 15:12:15'),
(65, 7, 'User Action', 'Viewed Dashboard', '2025-10-18 13:57:36'),
(66, 31, 'User Action', 'Checked Appointments', '2025-09-09 11:01:29'),
(67, 6, 'User Action', 'Viewed Dashboard', '2025-09-08 15:23:47'),
(68, 26, 'User Action', 'User Logged In', '2025-10-04 01:42:00'),
(69, 13, 'User Action', 'Viewed Dashboard', '2025-09-21 13:54:02'),
(70, 18, 'User Action', 'Viewed Service List', '2025-10-27 01:14:21'),
(71, 5, 'User Action', 'Contacted Support', '2025-10-16 09:21:33'),
(72, 1, 'User Action', 'Contacted Support', '2025-09-05 07:37:23'),
(73, 22, 'User Action', 'Checked Appointments', '2025-10-02 23:55:03'),
(74, 2, 'User Action', 'Viewed Dashboard', '2025-10-23 19:13:34'),
(75, 20, 'User Action', 'Viewed Service List', '2025-08-27 09:07:41'),
(76, 24, 'User Action', 'Contacted Support', '2025-09-30 18:43:11'),
(77, 25, 'User Action', 'User Logged In', '2025-09-09 09:22:16'),
(78, 25, 'User Action', 'User Logged In', '2025-09-12 13:13:12'),
(79, 2, 'User Action', 'Downloaded Report', '2025-11-14 13:26:14'),
(80, 24, 'User Action', 'Checked Appointments', '2025-11-12 06:19:55'),
(81, 26, 'User Action', 'Updated Profile', '2025-11-19 22:03:29'),
(82, 29, 'User Action', 'Contacted Support', '2025-09-19 20:37:21'),
(83, 23, 'User Action', 'Checked Appointments', '2025-09-04 17:54:11'),
(84, 25, 'User Action', 'Updated Profile', '2025-09-23 00:33:10'),
(85, 24, 'User Action', 'Changed Password', '2025-10-20 16:24:23'),
(86, 16, 'User Action', 'Contacted Support', '2025-09-11 08:13:08'),
(87, 27, 'User Action', 'Viewed Service List', '2025-09-27 11:12:21'),
(88, 28, 'User Action', 'Checked Appointments', '2025-10-18 03:38:23'),
(89, 5, 'User Action', 'Checked Appointments', '2025-11-10 00:37:59'),
(90, 2, 'User Action', 'Downloaded Report', '2025-09-04 08:25:51'),
(91, 21, 'User Action', 'Viewed Dashboard', '2025-10-03 17:17:22'),
(92, 21, 'User Action', 'User Logged In', '2025-10-12 13:19:30'),
(93, 26, 'User Action', 'Viewed Service List', '2025-10-19 00:58:55'),
(94, 25, 'User Action', 'Downloaded Report', '2025-09-07 21:56:13'),
(95, 9, 'User Action', 'Checked Appointments', '2025-09-05 06:49:52'),
(96, 23, 'User Action', 'Checked Appointments', '2025-08-30 09:15:08'),
(97, 28, 'User Action', 'Viewed Service List', '2025-10-27 11:15:35'),
(98, 28, 'User Action', 'Viewed Service List', '2025-10-23 04:59:06'),
(99, 12, 'User Action', 'Contacted Support', '2025-11-24 05:56:43'),
(100, 31, 'User Action', 'User Logged In', '2025-11-24 04:13:07'),
(101, 16, 'User Action', 'Contacted Support', '2025-11-12 02:49:21'),
(102, 24, 'User Action', 'Contacted Support', '2025-10-05 01:49:17'),
(103, 32, 'User Action', 'Checked Appointments', '2025-11-18 18:28:12'),
(104, 16, 'User Action', 'Downloaded Report', '2025-09-21 00:28:25'),
(105, 2, 'User Action', 'Changed Password', '2025-10-23 12:33:47'),
(106, 26, 'User Action', 'Checked Appointments', '2025-10-02 02:23:09'),
(107, 7, 'User Action', 'Updated Profile', '2025-11-17 09:53:05'),
(108, 9, 'User Action', 'Checked Appointments', '2025-11-13 06:45:31'),
(109, 22, 'User Action', 'Checked Appointments', '2025-10-12 03:01:23'),
(110, 1, 'User Action', 'User Logged In', '2025-11-07 12:33:09'),
(111, 14, 'User Action', 'Contacted Support', '2025-10-29 16:44:41'),
(112, 17, 'User Action', 'Viewed Service List', '2025-10-19 03:32:45'),
(113, 24, 'User Action', 'Viewed Dashboard', '2025-10-10 07:29:26'),
(114, 23, 'User Action', 'Checked Appointments', '2025-09-17 22:15:48'),
(115, 5, 'User Action', 'Contacted Support', '2025-11-13 18:20:55'),
(116, 28, 'User Action', 'Changed Password', '2025-08-29 14:08:27'),
(117, 19, 'User Action', 'Updated Profile', '2025-10-24 08:14:21'),
(118, 17, 'User Action', 'Contacted Support', '2025-10-05 10:34:36'),
(119, 20, 'User Action', 'Viewed Service List', '2025-10-15 15:25:02'),
(120, 3, 'User Action', 'Contacted Support', '2025-11-09 00:16:29'),
(121, 13, 'User Action', 'User Logged In', '2025-11-17 02:54:28'),
(122, 30, 'User Action', 'Viewed Service List', '2025-08-31 04:12:35'),
(123, 4, 'User Action', 'Updated Profile', '2025-10-21 01:23:52'),
(124, 19, 'User Action', 'User Logged In', '2025-11-23 23:22:32'),
(125, 11, 'User Action', 'Checked Appointments', '2025-09-26 08:56:14'),
(126, 26, 'User Action', 'Changed Password', '2025-09-12 16:39:56'),
(127, 8, 'User Action', 'Changed Password', '2025-11-09 18:41:35'),
(128, 17, 'User Action', 'User Logged In', '2025-10-27 14:04:01'),
(129, 3, 'User Action', 'Updated Profile', '2025-09-07 20:58:27'),
(130, 10, 'User Action', 'Downloaded Report', '2025-10-10 13:32:05'),
(131, 15, 'User Action', 'Checked Appointments', '2025-09-26 18:28:38'),
(132, 28, 'User Action', 'Checked Appointments', '2025-10-13 18:31:48'),
(133, 8, 'User Action', 'Updated Profile', '2025-10-16 07:29:55'),
(134, 6, 'User Action', 'Viewed Dashboard', '2025-10-09 02:16:40'),
(135, 26, 'User Action', 'Updated Profile', '2025-09-09 15:31:51'),
(136, 24, 'User Action', 'Downloaded Report', '2025-09-13 17:12:13'),
(137, 19, 'User Action', 'Updated Profile', '2025-09-09 12:45:45'),
(138, 25, 'User Action', 'Updated Profile', '2025-11-12 14:36:19'),
(139, 27, 'User Action', 'Viewed Dashboard', '2025-09-11 21:48:37'),
(140, 9, 'User Action', 'Viewed Dashboard', '2025-10-10 17:02:01'),
(141, 21, 'User Action', 'Downloaded Report', '2025-10-17 18:45:07'),
(142, 14, 'User Action', 'Updated Profile', '2025-09-13 07:41:02'),
(143, 19, 'User Action', 'Contacted Support', '2025-09-16 23:38:53'),
(144, 16, 'User Action', 'User Logged In', '2025-09-21 22:20:26'),
(145, 27, 'User Action', 'Checked Appointments', '2025-09-30 06:49:20'),
(146, 31, 'User Action', 'Viewed Service List', '2025-10-02 10:17:16'),
(147, 13, 'User Action', 'Viewed Service List', '2025-09-29 16:33:57'),
(148, 28, 'User Action', 'Viewed Dashboard', '2025-09-10 00:22:34'),
(149, 7, 'User Action', 'Changed Password', '2025-08-30 16:44:31'),
(150, 1, 'User Action', 'Changed Password', '2025-11-12 09:11:58'),
(151, 27, 'User Action', 'Viewed Dashboard', '2025-11-07 17:55:15'),
(152, 15, 'User Action', 'Changed Password', '2025-09-06 15:42:02'),
(153, 5, 'User Action', 'Viewed Service List', '2025-11-04 21:37:15'),
(154, 31, 'User Action', 'Viewed Dashboard', '2025-09-08 06:47:28'),
(155, 5, 'User Action', 'Contacted Support', '2025-10-26 16:01:44'),
(156, 19, 'User Action', 'Downloaded Report', '2025-10-26 08:06:16'),
(157, 13, 'User Action', 'Contacted Support', '2025-10-22 02:27:15'),
(158, 30, 'User Action', 'Contacted Support', '2025-09-06 23:12:44'),
(159, 18, 'User Action', 'Checked Appointments', '2025-10-20 15:26:55'),
(160, 16, 'User Action', 'User Logged In', '2025-08-26 18:03:09'),
(161, 19, 'User Action', 'Updated Profile', '2025-10-20 22:43:32'),
(162, 8, 'User Action', 'Viewed Dashboard', '2025-11-18 16:04:06'),
(163, 3, 'User Action', 'Contacted Support', '2025-09-03 18:43:48'),
(164, 25, 'User Action', 'Contacted Support', '2025-10-10 06:57:39'),
(165, 4, 'User Action', 'Downloaded Report', '2025-08-29 18:24:51'),
(166, 18, 'User Action', 'Updated Profile', '2025-09-06 16:49:59'),
(167, 25, 'User Action', 'Viewed Service List', '2025-09-19 04:31:35'),
(168, 17, 'User Action', 'Contacted Support', '2025-10-30 19:40:25'),
(169, 26, 'User Action', 'Viewed Dashboard', '2025-10-21 04:38:22'),
(170, 29, 'User Action', 'Contacted Support', '2025-11-23 21:56:24'),
(171, 2, 'User Action', 'Updated Profile', '2025-10-18 07:28:42'),
(172, 4, 'User Action', 'Viewed Service List', '2025-11-23 10:20:41'),
(173, 2, 'User Action', 'Viewed Service List', '2025-09-26 09:34:42'),
(174, 16, 'User Action', 'Changed Password', '2025-11-21 21:51:06'),
(175, 11, 'User Action', 'Viewed Service List', '2025-11-14 10:59:58'),
(176, 24, 'User Action', 'User Logged In', '2025-09-08 16:12:37'),
(177, 18, 'User Action', 'Changed Password', '2025-11-12 05:40:36'),
(178, 1, 'User Action', 'Viewed Service List', '2025-10-19 17:05:34'),
(179, 31, 'User Action', 'Viewed Dashboard', '2025-11-12 03:23:12'),
(180, 12, 'User Action', 'Contacted Support', '2025-09-19 16:29:41'),
(181, 22, 'User Action', 'Viewed Dashboard', '2025-10-13 18:53:00'),
(182, 21, 'User Action', 'Downloaded Report', '2025-10-28 17:26:33'),
(183, 1, 'User Action', 'Checked Appointments', '2025-10-01 17:40:24'),
(184, 23, 'User Action', 'Updated Profile', '2025-11-13 12:17:31'),
(185, 9, 'User Action', 'Updated Profile', '2025-09-05 07:24:21'),
(186, 26, 'User Action', 'Viewed Service List', '2025-09-26 11:46:29'),
(187, 30, 'User Action', 'Changed Password', '2025-09-19 02:41:54'),
(188, 16, 'User Action', 'User Logged In', '2025-09-06 07:56:46'),
(189, 1, 'User Action', 'Contacted Support', '2025-09-13 14:38:37'),
(190, 14, 'User Action', 'Checked Appointments', '2025-11-02 04:34:06'),
(191, 18, 'User Action', 'Viewed Service List', '2025-09-25 14:30:09'),
(192, 9, 'User Action', 'Contacted Support', '2025-10-29 05:36:51'),
(193, 26, 'User Action', 'Changed Password', '2025-08-31 15:01:53'),
(194, 16, 'User Action', 'Downloaded Report', '2025-11-21 15:09:36'),
(195, 28, 'User Action', 'Viewed Service List', '2025-09-23 10:59:40'),
(196, 8, 'User Action', 'Viewed Dashboard', '2025-10-27 14:55:50'),
(197, 28, 'User Action', 'Changed Password', '2025-10-28 13:58:40'),
(198, 10, 'User Action', 'Downloaded Report', '2025-10-14 18:31:02'),
(199, 10, 'User Action', 'User Logged In', '2025-10-19 08:09:28'),
(200, 17, 'User Action', 'Downloaded Report', '2025-11-20 15:38:29'),
(201, 8, 'User Action', 'Downloaded Report', '2025-10-30 22:38:45'),
(202, 31, 'User Action', 'Checked Appointments', '2025-10-02 15:43:12'),
(203, 18, 'User Action', 'Viewed Dashboard', '2025-10-14 06:29:10'),
(204, 32, 'User Action', 'Changed Password', '2025-11-19 12:28:07'),
(205, 13, 'User Action', 'Changed Password', '2025-10-08 09:17:28'),
(206, 29, 'User Action', 'Checked Appointments', '2025-08-26 23:38:57'),
(207, 3, 'User Action', 'Downloaded Report', '2025-10-01 07:33:49'),
(208, 19, 'User Action', 'Checked Appointments', '2025-10-25 19:33:48'),
(209, 13, 'User Action', 'Updated Profile', '2025-09-17 16:40:35'),
(210, 20, 'User Action', 'Viewed Dashboard', '2025-10-01 16:47:47'),
(211, 24, 'User Action', 'User Logged In', '2025-10-26 23:14:45'),
(212, 2, 'User Action', 'User Logged In', '2025-11-05 09:36:36'),
(213, 31, 'User Action', 'User Logged In', '2025-09-08 10:29:11'),
(214, 23, 'User Action', 'Contacted Support', '2025-11-21 08:23:15'),
(215, 1, 'User Action', 'Viewed Service List', '2025-10-12 11:26:42'),
(216, 23, 'User Action', 'Contacted Support', '2025-09-26 23:28:04'),
(217, 28, 'User Action', 'Checked Appointments', '2025-10-11 01:14:29'),
(218, 12, 'User Action', 'Updated Profile', '2025-09-21 03:00:23'),
(219, 1, 'User Action', 'Contacted Support', '2025-11-07 01:18:42'),
(220, 24, 'User Action', 'Contacted Support', '2025-09-18 11:56:15'),
(221, 30, 'User Action', 'Downloaded Report', '2025-08-27 16:57:51'),
(222, 3, 'User Action', 'Changed Password', '2025-09-07 16:51:37'),
(223, 6, 'User Action', 'Contacted Support', '2025-09-08 02:34:13'),
(224, 10, 'User Action', 'Changed Password', '2025-10-25 21:00:04'),
(225, 25, 'User Action', 'Downloaded Report', '2025-11-22 04:53:01'),
(226, 24, 'User Action', 'Checked Appointments', '2025-10-30 16:08:22'),
(227, 26, 'User Action', 'Viewed Dashboard', '2025-09-15 06:32:22'),
(228, 5, 'User Action', 'User Logged In', '2025-09-19 13:50:08'),
(229, 1, 'User Action', 'User Logged In', '2025-11-20 18:24:04'),
(230, 22, 'User Action', 'Viewed Dashboard', '2025-11-16 20:59:03'),
(231, 17, 'User Action', 'Checked Appointments', '2025-11-02 10:48:38'),
(232, 14, 'User Action', 'Downloaded Report', '2025-11-03 17:01:25'),
(233, 21, 'User Action', 'User Logged In', '2025-08-29 15:17:40'),
(234, 15, 'User Action', 'Downloaded Report', '2025-11-24 00:15:19'),
(235, 1, 'User Action', 'Viewed Dashboard', '2025-11-16 13:09:42'),
(236, 28, 'User Action', 'Viewed Dashboard', '2025-11-11 02:29:51'),
(237, 16, 'User Action', 'Viewed Dashboard', '2025-11-13 08:23:15'),
(238, 31, 'User Action', 'Contacted Support', '2025-11-08 20:18:04'),
(239, 9, 'User Action', 'Updated Profile', '2025-11-01 19:43:28'),
(240, 11, 'User Action', 'Contacted Support', '2025-11-22 06:48:47'),
(241, 10, 'User Action', 'Contacted Support', '2025-10-29 13:03:41'),
(242, 19, 'User Action', 'User Logged In', '2025-10-19 08:12:00'),
(243, 17, 'User Action', 'Checked Appointments', '2025-09-19 11:12:31'),
(244, 20, 'User Action', 'Updated Profile', '2025-11-13 06:44:19'),
(245, 17, 'User Action', 'Contacted Support', '2025-09-28 05:03:30'),
(246, 13, 'User Action', 'Viewed Dashboard', '2025-11-21 22:53:50'),
(247, 1, 'User Action', 'Viewed Service List', '2025-09-26 01:55:04'),
(248, 11, 'User Action', 'Downloaded Report', '2025-11-12 14:09:18'),
(249, 6, 'User Action', 'Contacted Support', '2025-08-29 22:30:26'),
(250, 22, 'User Action', 'Viewed Dashboard', '2025-11-09 07:27:26'),
(251, 28, 'User Action', 'User Logged In', '2025-09-22 10:55:09'),
(252, 11, 'User Action', 'User Logged In', '2025-09-19 18:33:55'),
(253, 24, 'User Action', 'Checked Appointments', '2025-11-07 03:30:03'),
(254, 31, 'User Action', 'Viewed Dashboard', '2025-10-06 16:33:35'),
(255, 24, 'User Action', 'Contacted Support', '2025-09-20 21:52:33'),
(256, 10, 'User Action', 'Updated Profile', '2025-11-18 09:37:09'),
(257, 25, 'User Action', 'Downloaded Report', '2025-09-06 13:22:35'),
(258, 26, 'User Action', 'Contacted Support', '2025-09-16 23:57:53'),
(259, 9, 'User Action', 'Contacted Support', '2025-10-15 07:58:59'),
(260, 24, 'User Action', 'User Logged In', '2025-09-20 03:58:21'),
(261, 21, 'User Action', 'Updated Profile', '2025-10-24 02:04:22'),
(262, 30, 'User Action', 'User Logged In', '2025-11-02 15:01:45'),
(263, 10, 'User Action', 'Checked Appointments', '2025-11-17 22:44:06'),
(264, 25, 'User Action', 'Viewed Service List', '2025-09-01 21:16:35'),
(265, 14, 'User Action', 'Changed Password', '2025-11-05 19:47:13'),
(266, 28, 'User Action', 'User Logged In', '2025-11-04 11:45:08'),
(267, 27, 'User Action', 'Contacted Support', '2025-09-02 23:00:24'),
(268, 5, 'User Action', 'Viewed Service List', '2025-11-18 13:43:28'),
(269, 6, 'User Action', 'Updated Profile', '2025-10-22 12:21:16'),
(270, 9, 'User Action', 'Downloaded Report', '2025-09-27 11:02:18'),
(271, 10, 'User Action', 'Updated Profile', '2025-09-27 11:49:51'),
(272, 29, 'User Action', 'Contacted Support', '2025-09-29 18:39:35'),
(273, 9, 'User Action', 'Contacted Support', '2025-10-06 14:53:55'),
(274, 31, 'User Action', 'Viewed Service List', '2025-08-30 04:41:07'),
(275, 11, 'User Action', 'Changed Password', '2025-09-27 02:48:29'),
(276, 20, 'User Action', 'Checked Appointments', '2025-09-16 07:57:19'),
(277, 20, 'User Action', 'Viewed Service List', '2025-08-27 15:38:32'),
(278, 22, 'User Action', 'Downloaded Report', '2025-10-20 05:35:56'),
(279, 30, 'User Action', 'Updated Profile', '2025-09-01 22:53:22'),
(280, 15, 'User Action', 'Contacted Support', '2025-11-22 00:00:12'),
(281, 15, 'User Action', 'Changed Password', '2025-10-30 23:31:26'),
(282, 29, 'User Action', 'User Logged In', '2025-10-16 23:07:14'),
(283, 18, 'User Action', 'Viewed Service List', '2025-10-09 02:37:42'),
(284, 26, 'User Action', 'Changed Password', '2025-11-01 11:49:47'),
(285, 13, 'User Action', 'Contacted Support', '2025-10-22 14:39:05'),
(286, 12, 'User Action', 'Downloaded Report', '2025-09-21 15:15:07'),
(287, 24, 'User Action', 'Checked Appointments', '2025-09-27 05:23:00'),
(288, 5, 'User Action', 'Updated Profile', '2025-10-13 10:59:30'),
(289, 6, 'User Action', 'Updated Profile', '2025-11-02 21:48:55'),
(290, 19, 'User Action', 'Checked Appointments', '2025-11-04 10:56:35'),
(291, 25, 'User Action', 'Viewed Dashboard', '2025-10-23 10:01:34'),
(292, 27, 'User Action', 'Changed Password', '2025-09-13 00:41:31'),
(293, 3, 'User Action', 'Viewed Dashboard', '2025-08-27 21:48:29'),
(294, 1, 'User Action', 'Viewed Dashboard', '2025-08-27 07:07:07'),
(295, 10, 'User Action', 'Downloaded Report', '2025-10-15 12:22:09'),
(296, 27, 'User Action', 'Changed Password', '2025-11-24 05:03:55'),
(297, 2, 'User Action', 'Changed Password', '2025-09-06 22:19:50'),
(298, 9, 'User Action', 'Viewed Service List', '2025-08-27 05:55:34'),
(299, 7, 'User Action', 'Viewed Dashboard', '2025-09-06 02:42:46'),
(300, 1, 'User Action', 'Viewed Dashboard', '2025-11-11 00:43:23'),
(301, NULL, 'Appointment Cancelled', 'Appointment #80 was cancelled Category: Scheduling conflict Reason: sorry bud, there are conflicts in the sched lmao', '2025-11-24 12:50:52'),
(302, NULL, 'Appointment Cancelled', 'Appointment #91 was cancelled Category: No available technician Reason: YOU\'RE GAY', '2025-11-24 12:57:10'),
(303, 1, 'Appointment Rejected', 'Appointment #50 was rejected Category: Other Reason: bcos you\'re gay', '2025-11-24 13:07:20'),
(304, 1, 'Appointment Cancelled', 'Appointment #16 was cancelled Category: Customer request Reason: mukha kang burat', '2025-11-24 13:08:05');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `technician_id` int(11) DEFAULT NULL,
  `service_id` int(11) NOT NULL,
  `appointment_date` datetime NOT NULL,
  `status` enum('Pending','Confirmed','In Progress','Completed','Cancelled','Rejected') DEFAULT 'Pending',
  `total_cost` decimal(10,2) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `cancellation_category` enum('Change of plans','Found another service','Budget constraints','Emergency','Other','No available technician','Scheduling conflict','Service unavailable','Customer request','Duplicate booking') DEFAULT NULL,
  `is_walk_in` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_status` enum('Unpaid','Paid','Refunded') DEFAULT 'Unpaid',
  `cancelled_by` int(11) DEFAULT NULL,
  `marked_for_deletion` tinyint(1) DEFAULT 0,
  `deletion_marked_at` datetime DEFAULT NULL,
  `deletion_marked_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `customer_id`, `technician_id`, `service_id`, `appointment_date`, `status`, `total_cost`, `customer_notes`, `cancellation_reason`, `rejection_reason`, `cancellation_category`, `is_walk_in`, `created_at`, `updated_at`, `payment_status`, `cancelled_by`, `marked_for_deletion`, `deletion_marked_at`, `deletion_marked_by`) VALUES
(1, 32, 8, 3, '2025-06-14 22:03:00', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(2, 28, 12, 5, '2025-06-23 09:30:31', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(3, 24, 4, 1, '2025-10-11 18:01:45', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(4, 18, 9, 1, '2025-07-03 04:34:04', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(5, 18, 4, 5, '2025-12-06 13:15:47', 'Confirmed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(6, 29, NULL, 1, '2025-11-25 10:05:29', 'Pending', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(7, 25, NULL, 8, '2025-12-10 03:35:40', 'Pending', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(8, 14, 4, 6, '2025-06-24 22:21:38', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(9, 23, 12, 5, '2025-05-30 22:15:39', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(10, 26, 10, 6, '2025-10-06 05:03:44', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(11, 32, 12, 6, '2025-10-21 02:05:23', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(12, 31, 11, 5, '2025-08-05 19:45:08', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(13, 23, 10, 8, '2025-09-22 19:02:32', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(14, 28, 4, 3, '2025-06-29 00:37:45', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(15, 24, 4, 1, '2025-07-30 16:22:14', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(16, 20, 11, 7, '2025-12-23 08:45:10', 'Cancelled', 500.00, NULL, 'mukha kang burat', NULL, 'Customer request', 0, '2025-11-24 09:18:17', '2025-11-24 13:08:05', 'Unpaid', 1, 0, NULL, NULL),
(17, 31, 9, 3, '2025-06-26 23:08:59', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(18, 27, 9, 6, '2025-12-08 20:29:24', 'Confirmed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(19, 30, NULL, 4, '2025-12-06 15:28:36', 'Pending', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(20, 19, 12, 4, '2025-12-17 07:24:04', 'Confirmed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(21, 15, NULL, 7, '2025-11-28 05:26:44', 'Pending', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(22, 2, 4, 1, '2025-06-05 21:59:33', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(23, 31, 9, 5, '2025-12-10 21:46:54', 'Confirmed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(24, 30, 4, 2, '2025-12-19 01:57:10', 'Confirmed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(25, 32, NULL, 5, '2025-12-19 19:36:10', 'Pending', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(26, 17, 12, 2, '2025-09-04 09:13:37', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(27, 18, 8, 6, '2025-10-14 08:52:40', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(28, 21, 8, 8, '2025-09-18 01:22:51', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(29, 21, 4, 3, '2025-09-29 08:14:52', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(30, 32, 4, 5, '2025-06-29 00:57:25', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(31, 18, 12, 1, '2025-08-06 20:25:52', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(32, 13, NULL, 8, '2025-11-13 16:41:11', 'Cancelled', 0.00, NULL, 'Customer reason: Emergency', NULL, 'Emergency', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(33, 22, 11, 2, '2025-11-30 08:20:09', 'Confirmed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(34, 20, 12, 5, '2025-12-19 23:35:13', 'Confirmed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(35, 27, 8, 6, '2025-07-26 08:05:31', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(36, 29, 10, 6, '2025-06-02 08:51:43', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(37, 30, 12, 5, '2025-11-30 13:19:52', 'Confirmed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(38, 24, NULL, 3, '2025-11-30 09:34:42', 'Pending', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(39, 30, NULL, 1, '2025-12-01 02:08:09', 'Pending', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(40, 27, NULL, 5, '2025-12-18 18:48:14', 'Pending', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(41, 20, 4, 4, '2025-10-29 14:03:24', 'Completed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(42, 21, NULL, 8, '2025-12-19 21:52:34', 'Pending', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(43, 13, 9, 2, '2025-08-30 08:29:20', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(44, 19, NULL, 6, '2025-05-25 05:10:30', 'Cancelled', 2000.00, NULL, 'Customer reason: Tech Unavailable', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(45, 29, NULL, 3, '2025-07-24 09:30:24', 'Cancelled', 800.00, NULL, 'Customer reason: Emergency', NULL, 'Emergency', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(46, 31, 8, 3, '2025-12-12 22:58:54', 'Confirmed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(47, 23, 10, 6, '2025-10-19 02:59:56', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(48, 18, NULL, 3, '2025-12-06 08:58:44', 'Pending', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(49, 14, 10, 4, '2025-12-16 23:36:22', 'Confirmed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(50, 30, NULL, 5, '2025-12-24 06:09:42', 'Rejected', 1000.00, NULL, NULL, 'bcos you\'re gay', 'Other', 0, '2025-11-24 09:18:17', '2025-11-24 13:07:20', 'Unpaid', NULL, 0, NULL, NULL),
(51, 25, NULL, 2, '2025-12-09 12:34:19', 'Pending', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(52, 27, 9, 6, '2025-09-15 23:29:43', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(53, 31, 9, 5, '2025-05-24 14:24:02', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(54, 26, 4, 7, '2025-11-01 23:36:42', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(55, 23, 10, 2, '2025-10-03 19:13:00', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(56, 21, 9, 1, '2025-10-10 16:09:08', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(57, 21, 12, 1, '2025-10-10 16:36:12', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(58, 27, 12, 4, '2025-12-16 20:14:30', 'Confirmed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(59, 26, 10, 6, '2025-07-19 13:20:51', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(60, 2, 4, 3, '2025-07-29 19:22:37', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(61, 30, NULL, 8, '2025-12-21 08:44:20', 'Pending', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(62, 14, NULL, 8, '2025-05-29 03:19:54', 'Cancelled', 0.00, NULL, 'Customer reason: Changed Mind', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(63, 25, NULL, 4, '2025-10-19 23:01:52', 'Cancelled', 1200.00, NULL, 'Customer reason: Emergency', NULL, 'Emergency', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(64, 15, NULL, 2, '2025-08-28 12:08:27', 'Cancelled', 3000.00, NULL, 'Customer reason: Other', NULL, 'Other', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(65, 30, NULL, 8, '2025-07-20 06:54:30', 'Cancelled', 0.00, NULL, 'Customer reason: Other', NULL, 'Other', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(66, 2, 4, 5, '2025-09-15 16:12:16', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(67, 29, 12, 1, '2025-08-25 22:05:19', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(68, 19, 9, 1, '2025-10-10 21:32:10', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(69, 20, 4, 3, '2025-06-28 18:40:23', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(70, 13, 9, 2, '2025-09-05 05:26:27', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(71, 16, 10, 8, '2025-08-31 22:56:16', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(72, 13, 9, 5, '2025-11-01 12:58:42', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(73, 31, 4, 8, '2025-06-27 19:24:34', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(74, 2, 4, 7, '2025-08-02 06:33:36', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(75, 24, NULL, 3, '2025-09-01 13:20:42', 'Cancelled', 800.00, NULL, 'Customer reason: Found Cheaper', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(76, 21, 8, 5, '2025-12-19 19:35:52', 'Confirmed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(77, 28, 12, 6, '2025-10-02 09:25:25', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(78, 2, 10, 2, '2025-12-11 17:48:42', 'Confirmed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(79, 26, NULL, 7, '2025-12-24 05:08:34', 'Pending', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(80, 14, 4, 7, '2025-12-23 16:48:52', 'Cancelled', 500.00, NULL, 'sorry bud, there are conflicts in the sched lmao', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 12:56:47', 'Unpaid', NULL, 1, '2025-11-24 20:56:47', NULL),
(81, 32, 11, 6, '2025-11-11 11:46:59', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(82, 19, 11, 4, '2025-10-07 16:16:19', 'Completed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(83, 17, 8, 8, '2025-07-12 12:08:04', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(84, 18, NULL, 8, '2025-06-25 18:30:31', 'Cancelled', 0.00, NULL, 'Customer reason: Emergency', NULL, 'Emergency', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(85, 30, 9, 1, '2025-09-19 12:46:23', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(86, 16, 10, 5, '2025-11-15 05:08:39', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(87, 32, 4, 7, '2025-07-16 02:58:25', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(88, 15, NULL, 5, '2025-12-18 02:39:04', 'Pending', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(89, 26, 9, 1, '2025-06-14 09:16:56', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(90, 2, 11, 6, '2025-07-14 05:47:39', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(91, 25, 9, 7, '2025-12-22 09:24:29', 'Cancelled', 500.00, NULL, 'YOU\'RE GAY', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 12:57:34', 'Unpaid', NULL, 0, NULL, NULL),
(92, 16, 4, 3, '2025-09-23 10:37:52', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(93, 2, 4, 4, '2025-11-24 18:59:12', 'Confirmed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(94, 19, 4, 7, '2025-12-12 07:23:51', 'Confirmed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(95, 27, 9, 2, '2025-08-11 23:57:33', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(96, 29, NULL, 3, '2025-08-22 13:05:17', 'Cancelled', 800.00, NULL, 'Customer reason: Changed Mind', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(97, 18, 11, 6, '2025-11-30 02:12:08', 'Confirmed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(98, 32, 12, 5, '2025-09-20 11:39:56', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(99, 25, 12, 3, '2025-08-23 05:11:29', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(100, 29, 9, 2, '2025-09-22 21:09:58', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(101, 2, 11, 4, '2025-09-05 14:05:12', 'Completed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(102, 22, 10, 2, '2025-11-02 10:26:41', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(103, 13, 8, 6, '2025-10-02 14:51:18', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(104, 29, 4, 8, '2025-12-18 02:42:48', 'Confirmed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(105, 28, NULL, 5, '2025-11-22 18:32:42', 'Cancelled', 1000.00, NULL, 'Customer reason: Other', NULL, 'Other', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(106, 2, NULL, 1, '2025-06-09 02:54:47', 'Cancelled', 1500.00, NULL, 'Customer reason: Emergency', NULL, 'Emergency', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(107, 19, 11, 3, '2025-06-28 06:06:49', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(108, 16, NULL, 1, '2025-09-03 03:17:03', 'Cancelled', 1500.00, NULL, 'Customer reason: Tech Unavailable', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(109, 31, 11, 1, '2025-12-09 03:22:46', 'Confirmed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(110, 16, 9, 7, '2025-07-01 16:54:30', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(111, 14, 8, 7, '2025-12-06 10:35:25', 'Confirmed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(112, 32, 8, 8, '2025-10-06 12:25:52', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(113, 26, 9, 1, '2025-06-01 11:11:19', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(114, 28, 8, 7, '2025-08-16 04:27:59', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(115, 19, 11, 5, '2025-09-06 12:58:07', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(116, 19, 10, 5, '2025-08-26 01:26:48', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(117, 14, 10, 6, '2025-11-09 18:26:50', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(118, 28, 10, 6, '2025-06-23 23:00:02', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(119, 19, NULL, 3, '2025-09-28 04:48:25', 'Cancelled', 800.00, NULL, 'Customer reason: Tech Unavailable', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(120, 29, 4, 6, '2025-11-13 04:34:28', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(121, 28, NULL, 5, '2025-12-21 14:05:05', 'Pending', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(122, 25, 4, 5, '2025-09-04 09:09:18', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(123, 32, 12, 8, '2025-06-26 02:34:03', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(124, 2, 10, 2, '2025-08-03 02:04:41', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(125, 28, NULL, 4, '2025-10-04 07:24:31', 'Cancelled', 1200.00, NULL, 'Customer reason: Found Cheaper', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(126, 27, 8, 8, '2025-09-23 01:58:20', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(127, 21, NULL, 4, '2025-08-27 06:25:56', 'Cancelled', 1200.00, NULL, 'Customer reason: Found Cheaper', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(128, 28, 12, 4, '2025-11-01 04:00:07', 'Completed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(129, 26, 8, 6, '2025-07-15 14:52:39', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(130, 2, 4, 3, '2025-08-29 18:04:43', 'Completed', 800.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(131, 30, NULL, 2, '2025-06-19 19:19:59', 'Cancelled', 3000.00, NULL, 'Customer reason: Found Cheaper', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(132, 24, 4, 4, '2025-07-27 04:55:06', 'Completed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(133, 22, 8, 6, '2025-06-23 14:18:19', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(134, 31, 10, 1, '2025-07-12 03:37:02', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(135, 2, NULL, 2, '2025-12-07 08:42:36', 'Pending', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(136, 27, 12, 4, '2025-12-12 10:22:41', 'Confirmed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(137, 25, 12, 4, '2025-06-09 21:15:50', 'Completed', 1200.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(138, 2, 9, 5, '2025-05-31 16:54:18', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(139, 26, 12, 2, '2025-08-08 00:38:33', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(140, 31, NULL, 8, '2025-07-26 04:23:33', 'Cancelled', 0.00, NULL, 'Customer reason: Changed Mind', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(141, 31, 8, 8, '2025-09-04 01:54:41', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(142, 14, 11, 5, '2025-08-24 13:34:32', 'Completed', 1000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(143, 20, NULL, 6, '2025-11-28 10:35:46', 'Pending', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(144, 19, 9, 7, '2025-08-31 15:57:03', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(145, 26, NULL, 2, '2025-08-04 03:04:56', 'Cancelled', 3000.00, NULL, 'Customer reason: Tech Unavailable', NULL, '', 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Unpaid', NULL, 0, NULL, NULL),
(146, 27, 8, 7, '2025-11-04 12:39:08', 'Completed', 500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(147, 15, 12, 2, '2025-08-19 15:58:09', 'Completed', 3000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(148, 16, 4, 6, '2025-06-20 08:33:42', 'Completed', 2000.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(149, 31, 9, 1, '2025-10-14 22:56:30', 'Completed', 1500.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL),
(150, 30, 11, 8, '2025-10-17 08:42:38', 'Completed', 0.00, NULL, NULL, NULL, NULL, 0, '2025-11-24 09:18:17', '2025-11-24 09:18:17', 'Paid', NULL, 0, NULL, NULL);

--
-- Triggers `appointments`
--
DELIMITER $$
CREATE TRIGGER `trg_appointment_notifications` AFTER UPDATE ON `appointments` FOR EACH ROW BEGIN
    -- Notify Customer: Appointment Approved
    IF NEW.status = 'Confirmed' AND OLD.status != 'Confirmed' THEN
        INSERT INTO notifications (user_id, title, message, related_appointment_id)
        VALUES (NEW.customer_id, 'Appointment Approved', 'Your appointment has been confirmed.', NEW.appointment_id);
    END IF;

    -- Notify Customer: Appointment Rejected
    IF NEW.status = 'Rejected' AND OLD.status != 'Rejected' THEN
        INSERT INTO notifications (user_id, title, message, related_appointment_id)
        VALUES (NEW.customer_id, 'Appointment Rejected', CONCAT('Rejected. Reason: ', COALESCE(NEW.rejection_reason, 'Unavailable')), NEW.appointment_id);
    END IF;

    -- Notify Customer: Appointment Completed (Prompt to rate)
    IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
        INSERT INTO notifications (user_id, title, message, related_appointment_id)
        VALUES (NEW.customer_id, 'Appointment Completed', 'Your service is complete. Please rate your technician.', NEW.appointment_id);
    END IF;

    -- Notify Technician: New Job Assigned
    IF NEW.technician_id IS NOT NULL AND (OLD.technician_id IS NULL OR OLD.technician_id != NEW.technician_id) THEN
        INSERT INTO notifications (user_id, title, message, related_appointment_id)
        VALUES (NEW.technician_id, 'New Job Assigned', CONCAT('You have been assigned to Appointment #', NEW.appointment_id), NEW.appointment_id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` enum('Appointment Approved','Appointment Rejected','Appointment Cancelled','Appointment Completed','New Job Assigned','Reminder') NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `related_appointment_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `title`, `message`, `is_read`, `related_appointment_id`, `created_at`) VALUES
(1, 32, '', 'Your service for Appointment #1 is complete. Please leave a review!', 0, 1, '2025-11-24 09:18:17'),
(2, 8, 'New Job Assigned', 'You have been assigned to Appointment #1.', 0, 1, '2025-11-24 09:18:17'),
(3, 28, '', 'Your service for Appointment #2 is complete. Please leave a review!', 0, 2, '2025-11-24 09:18:17'),
(4, 12, 'New Job Assigned', 'You have been assigned to Appointment #2.', 0, 2, '2025-11-24 09:18:17'),
(5, 24, '', 'Your service for Appointment #3 is complete. Please leave a review!', 0, 3, '2025-11-24 09:18:17'),
(6, 4, 'New Job Assigned', 'You have been assigned to Appointment #3.', 0, 3, '2025-11-24 09:18:17'),
(7, 18, '', 'Your service for Appointment #4 is complete. Please leave a review!', 0, 4, '2025-11-24 09:18:17'),
(8, 9, 'New Job Assigned', 'You have been assigned to Appointment #4.', 1, 4, '2025-11-24 09:18:17'),
(9, 18, '', 'Your appointment on 12/6/2025 has been confirmed.', 0, 5, '2025-11-24 09:18:17'),
(10, 4, 'New Job Assigned', 'You have been assigned to Appointment #5.', 0, 5, '2025-11-24 09:18:17'),
(11, 14, '', 'Your service for Appointment #8 is complete. Please leave a review!', 1, 8, '2025-11-24 09:18:17'),
(12, 4, 'New Job Assigned', 'You have been assigned to Appointment #8.', 1, 8, '2025-11-24 09:18:17'),
(13, 23, '', 'Your service for Appointment #9 is complete. Please leave a review!', 0, 9, '2025-11-24 09:18:17'),
(14, 12, 'New Job Assigned', 'You have been assigned to Appointment #9.', 0, 9, '2025-11-24 09:18:17'),
(15, 26, '', 'Your service for Appointment #10 is complete. Please leave a review!', 1, 10, '2025-11-24 09:18:17'),
(16, 10, 'New Job Assigned', 'You have been assigned to Appointment #10.', 1, 10, '2025-11-24 09:18:17'),
(17, 32, '', 'Your service for Appointment #11 is complete. Please leave a review!', 1, 11, '2025-11-24 09:18:17'),
(18, 12, 'New Job Assigned', 'You have been assigned to Appointment #11.', 1, 11, '2025-11-24 09:18:17'),
(19, 31, '', 'Your service for Appointment #12 is complete. Please leave a review!', 0, 12, '2025-11-24 09:18:17'),
(20, 11, 'New Job Assigned', 'You have been assigned to Appointment #12.', 1, 12, '2025-11-24 09:18:17'),
(21, 23, '', 'Your service for Appointment #13 is complete. Please leave a review!', 1, 13, '2025-11-24 09:18:17'),
(22, 10, 'New Job Assigned', 'You have been assigned to Appointment #13.', 1, 13, '2025-11-24 09:18:17'),
(23, 28, '', 'Your service for Appointment #14 is complete. Please leave a review!', 0, 14, '2025-11-24 09:18:17'),
(24, 4, 'New Job Assigned', 'You have been assigned to Appointment #14.', 0, 14, '2025-11-24 09:18:17'),
(25, 24, '', 'Your service for Appointment #15 is complete. Please leave a review!', 0, 15, '2025-11-24 09:18:17'),
(26, 4, 'New Job Assigned', 'You have been assigned to Appointment #15.', 0, 15, '2025-11-24 09:18:17'),
(27, 20, '', 'Your appointment on 12/23/2025 has been confirmed.', 0, 16, '2025-11-24 09:18:17'),
(28, 11, 'New Job Assigned', 'You have been assigned to Appointment #16.', 1, 16, '2025-11-24 09:18:17'),
(29, 31, '', 'Your service for Appointment #17 is complete. Please leave a review!', 1, 17, '2025-11-24 09:18:17'),
(30, 9, 'New Job Assigned', 'You have been assigned to Appointment #17.', 0, 17, '2025-11-24 09:18:17'),
(31, 27, '', 'Your appointment on 12/8/2025 has been confirmed.', 0, 18, '2025-11-24 09:18:17'),
(32, 9, 'New Job Assigned', 'You have been assigned to Appointment #18.', 0, 18, '2025-11-24 09:18:17'),
(33, 19, '', 'Your appointment on 12/17/2025 has been confirmed.', 0, 20, '2025-11-24 09:18:17'),
(34, 12, 'New Job Assigned', 'You have been assigned to Appointment #20.', 1, 20, '2025-11-24 09:18:17'),
(35, 2, '', 'Your service for Appointment #22 is complete. Please leave a review!', 0, 22, '2025-11-24 09:18:17'),
(36, 4, 'New Job Assigned', 'You have been assigned to Appointment #22.', 0, 22, '2025-11-24 09:18:17'),
(37, 31, '', 'Your appointment on 12/10/2025 has been confirmed.', 0, 23, '2025-11-24 09:18:17'),
(38, 9, 'New Job Assigned', 'You have been assigned to Appointment #23.', 1, 23, '2025-11-24 09:18:17'),
(39, 30, '', 'Your appointment on 12/19/2025 has been confirmed.', 0, 24, '2025-11-24 09:18:17'),
(40, 4, 'New Job Assigned', 'You have been assigned to Appointment #24.', 0, 24, '2025-11-24 09:18:17'),
(41, 17, '', 'Your service for Appointment #26 is complete. Please leave a review!', 1, 26, '2025-11-24 09:18:17'),
(42, 12, 'New Job Assigned', 'You have been assigned to Appointment #26.', 1, 26, '2025-11-24 09:18:17'),
(43, 18, '', 'Your service for Appointment #27 is complete. Please leave a review!', 0, 27, '2025-11-24 09:18:17'),
(44, 8, 'New Job Assigned', 'You have been assigned to Appointment #27.', 0, 27, '2025-11-24 09:18:17'),
(45, 21, '', 'Your service for Appointment #28 is complete. Please leave a review!', 0, 28, '2025-11-24 09:18:17'),
(46, 8, 'New Job Assigned', 'You have been assigned to Appointment #28.', 0, 28, '2025-11-24 09:18:17'),
(47, 21, '', 'Your service for Appointment #29 is complete. Please leave a review!', 1, 29, '2025-11-24 09:18:17'),
(48, 4, 'New Job Assigned', 'You have been assigned to Appointment #29.', 1, 29, '2025-11-24 09:18:17'),
(49, 32, '', 'Your service for Appointment #30 is complete. Please leave a review!', 0, 30, '2025-11-24 09:18:17'),
(50, 4, 'New Job Assigned', 'You have been assigned to Appointment #30.', 1, 30, '2025-11-24 09:18:17'),
(51, 18, '', 'Your service for Appointment #31 is complete. Please leave a review!', 1, 31, '2025-11-24 09:18:17'),
(52, 12, 'New Job Assigned', 'You have been assigned to Appointment #31.', 0, 31, '2025-11-24 09:18:17'),
(53, 13, 'Appointment Cancelled', 'Appointment #32 has been cancelled.', 1, 32, '2025-11-24 09:18:17'),
(54, 22, '', 'Your appointment on 11/30/2025 has been confirmed.', 1, 33, '2025-11-24 09:18:17'),
(55, 11, 'New Job Assigned', 'You have been assigned to Appointment #33.', 0, 33, '2025-11-24 09:18:17'),
(56, 20, '', 'Your appointment on 12/19/2025 has been confirmed.', 1, 34, '2025-11-24 09:18:17'),
(57, 12, 'New Job Assigned', 'You have been assigned to Appointment #34.', 1, 34, '2025-11-24 09:18:17'),
(58, 27, '', 'Your service for Appointment #35 is complete. Please leave a review!', 0, 35, '2025-11-24 09:18:17'),
(59, 8, 'New Job Assigned', 'You have been assigned to Appointment #35.', 1, 35, '2025-11-24 09:18:17'),
(60, 29, '', 'Your service for Appointment #36 is complete. Please leave a review!', 1, 36, '2025-11-24 09:18:17'),
(61, 10, 'New Job Assigned', 'You have been assigned to Appointment #36.', 1, 36, '2025-11-24 09:18:17'),
(62, 30, '', 'Your appointment on 11/30/2025 has been confirmed.', 1, 37, '2025-11-24 09:18:17'),
(63, 12, 'New Job Assigned', 'You have been assigned to Appointment #37.', 1, 37, '2025-11-24 09:18:17'),
(64, 20, '', 'Your service for Appointment #41 is complete. Please leave a review!', 1, 41, '2025-11-24 09:18:17'),
(65, 4, 'New Job Assigned', 'You have been assigned to Appointment #41.', 0, 41, '2025-11-24 09:18:17'),
(66, 13, '', 'Your service for Appointment #43 is complete. Please leave a review!', 1, 43, '2025-11-24 09:18:17'),
(67, 9, 'New Job Assigned', 'You have been assigned to Appointment #43.', 1, 43, '2025-11-24 09:18:17'),
(68, 19, 'Appointment Cancelled', 'Appointment #44 has been cancelled.', 1, 44, '2025-11-24 09:18:17'),
(69, 29, 'Appointment Cancelled', 'Appointment #45 has been cancelled.', 1, 45, '2025-11-24 09:18:17'),
(70, 31, '', 'Your appointment on 12/12/2025 has been confirmed.', 0, 46, '2025-11-24 09:18:17'),
(71, 8, 'New Job Assigned', 'You have been assigned to Appointment #46.', 0, 46, '2025-11-24 09:18:17'),
(72, 23, '', 'Your service for Appointment #47 is complete. Please leave a review!', 1, 47, '2025-11-24 09:18:17'),
(73, 10, 'New Job Assigned', 'You have been assigned to Appointment #47.', 1, 47, '2025-11-24 09:18:17'),
(74, 14, '', 'Your appointment on 12/16/2025 has been confirmed.', 0, 49, '2025-11-24 09:18:17'),
(75, 10, 'New Job Assigned', 'You have been assigned to Appointment #49.', 0, 49, '2025-11-24 09:18:17'),
(76, 27, '', 'Your service for Appointment #52 is complete. Please leave a review!', 0, 52, '2025-11-24 09:18:17'),
(77, 9, 'New Job Assigned', 'You have been assigned to Appointment #52.', 0, 52, '2025-11-24 09:18:17'),
(78, 31, '', 'Your service for Appointment #53 is complete. Please leave a review!', 1, 53, '2025-11-24 09:18:17'),
(79, 9, 'New Job Assigned', 'You have been assigned to Appointment #53.', 0, 53, '2025-11-24 09:18:17'),
(80, 26, '', 'Your service for Appointment #54 is complete. Please leave a review!', 1, 54, '2025-11-24 09:18:17'),
(81, 4, 'New Job Assigned', 'You have been assigned to Appointment #54.', 0, 54, '2025-11-24 09:18:17'),
(82, 23, '', 'Your service for Appointment #55 is complete. Please leave a review!', 1, 55, '2025-11-24 09:18:17'),
(83, 10, 'New Job Assigned', 'You have been assigned to Appointment #55.', 1, 55, '2025-11-24 09:18:17'),
(84, 21, '', 'Your service for Appointment #56 is complete. Please leave a review!', 0, 56, '2025-11-24 09:18:17'),
(85, 9, 'New Job Assigned', 'You have been assigned to Appointment #56.', 1, 56, '2025-11-24 09:18:17'),
(86, 21, '', 'Your service for Appointment #57 is complete. Please leave a review!', 0, 57, '2025-11-24 09:18:17'),
(87, 12, 'New Job Assigned', 'You have been assigned to Appointment #57.', 0, 57, '2025-11-24 09:18:17'),
(88, 27, '', 'Your appointment on 12/16/2025 has been confirmed.', 1, 58, '2025-11-24 09:18:17'),
(89, 12, 'New Job Assigned', 'You have been assigned to Appointment #58.', 1, 58, '2025-11-24 09:18:17'),
(90, 26, '', 'Your service for Appointment #59 is complete. Please leave a review!', 0, 59, '2025-11-24 09:18:17'),
(91, 10, 'New Job Assigned', 'You have been assigned to Appointment #59.', 0, 59, '2025-11-24 09:18:17'),
(92, 2, '', 'Your service for Appointment #60 is complete. Please leave a review!', 1, 60, '2025-11-24 09:18:17'),
(93, 4, 'New Job Assigned', 'You have been assigned to Appointment #60.', 0, 60, '2025-11-24 09:18:17'),
(94, 14, 'Appointment Cancelled', 'Appointment #62 has been cancelled.', 0, 62, '2025-11-24 09:18:17'),
(95, 25, 'Appointment Cancelled', 'Appointment #63 has been cancelled.', 1, 63, '2025-11-24 09:18:17'),
(96, 15, 'Appointment Cancelled', 'Appointment #64 has been cancelled.', 1, 64, '2025-11-24 09:18:17'),
(97, 30, 'Appointment Cancelled', 'Appointment #65 has been cancelled.', 0, 65, '2025-11-24 09:18:17'),
(98, 2, '', 'Your service for Appointment #66 is complete. Please leave a review!', 1, 66, '2025-11-24 09:18:17'),
(99, 4, 'New Job Assigned', 'You have been assigned to Appointment #66.', 0, 66, '2025-11-24 09:18:17'),
(100, 29, '', 'Your service for Appointment #67 is complete. Please leave a review!', 0, 67, '2025-11-24 09:18:17'),
(101, 12, 'New Job Assigned', 'You have been assigned to Appointment #67.', 1, 67, '2025-11-24 09:18:17'),
(102, 19, '', 'Your service for Appointment #68 is complete. Please leave a review!', 0, 68, '2025-11-24 09:18:17'),
(103, 9, 'New Job Assigned', 'You have been assigned to Appointment #68.', 0, 68, '2025-11-24 09:18:17'),
(104, 20, '', 'Your service for Appointment #69 is complete. Please leave a review!', 0, 69, '2025-11-24 09:18:17'),
(105, 4, 'New Job Assigned', 'You have been assigned to Appointment #69.', 0, 69, '2025-11-24 09:18:17'),
(106, 13, '', 'Your service for Appointment #70 is complete. Please leave a review!', 0, 70, '2025-11-24 09:18:17'),
(107, 9, 'New Job Assigned', 'You have been assigned to Appointment #70.', 1, 70, '2025-11-24 09:18:17'),
(108, 16, '', 'Your service for Appointment #71 is complete. Please leave a review!', 0, 71, '2025-11-24 09:18:17'),
(109, 10, 'New Job Assigned', 'You have been assigned to Appointment #71.', 1, 71, '2025-11-24 09:18:17'),
(110, 13, '', 'Your service for Appointment #72 is complete. Please leave a review!', 0, 72, '2025-11-24 09:18:17'),
(111, 9, 'New Job Assigned', 'You have been assigned to Appointment #72.', 0, 72, '2025-11-24 09:18:17'),
(112, 31, '', 'Your service for Appointment #73 is complete. Please leave a review!', 0, 73, '2025-11-24 09:18:17'),
(113, 4, 'New Job Assigned', 'You have been assigned to Appointment #73.', 0, 73, '2025-11-24 09:18:17'),
(114, 2, '', 'Your service for Appointment #74 is complete. Please leave a review!', 1, 74, '2025-11-24 09:18:17'),
(115, 4, 'New Job Assigned', 'You have been assigned to Appointment #74.', 0, 74, '2025-11-24 09:18:17'),
(116, 24, 'Appointment Cancelled', 'Appointment #75 has been cancelled.', 1, 75, '2025-11-24 09:18:17'),
(117, 21, '', 'Your appointment on 12/19/2025 has been confirmed.', 0, 76, '2025-11-24 09:18:17'),
(118, 8, 'New Job Assigned', 'You have been assigned to Appointment #76.', 1, 76, '2025-11-24 09:18:17'),
(119, 28, '', 'Your service for Appointment #77 is complete. Please leave a review!', 0, 77, '2025-11-24 09:18:17'),
(120, 12, 'New Job Assigned', 'You have been assigned to Appointment #77.', 0, 77, '2025-11-24 09:18:17'),
(121, 2, '', 'Your appointment on 12/11/2025 has been confirmed.', 0, 78, '2025-11-24 09:18:17'),
(122, 10, 'New Job Assigned', 'You have been assigned to Appointment #78.', 0, 78, '2025-11-24 09:18:17'),
(123, 14, '', 'Your appointment on 12/23/2025 has been confirmed.', 0, 80, '2025-11-24 09:18:17'),
(124, 4, 'New Job Assigned', 'You have been assigned to Appointment #80.', 0, 80, '2025-11-24 09:18:17'),
(125, 32, '', 'Your service for Appointment #81 is complete. Please leave a review!', 1, 81, '2025-11-24 09:18:17'),
(126, 11, 'New Job Assigned', 'You have been assigned to Appointment #81.', 1, 81, '2025-11-24 09:18:17'),
(127, 19, '', 'Your service for Appointment #82 is complete. Please leave a review!', 1, 82, '2025-11-24 09:18:17'),
(128, 11, 'New Job Assigned', 'You have been assigned to Appointment #82.', 1, 82, '2025-11-24 09:18:17'),
(129, 17, '', 'Your service for Appointment #83 is complete. Please leave a review!', 0, 83, '2025-11-24 09:18:17'),
(130, 8, 'New Job Assigned', 'You have been assigned to Appointment #83.', 1, 83, '2025-11-24 09:18:17'),
(131, 18, 'Appointment Cancelled', 'Appointment #84 has been cancelled.', 1, 84, '2025-11-24 09:18:17'),
(132, 30, '', 'Your service for Appointment #85 is complete. Please leave a review!', 0, 85, '2025-11-24 09:18:17'),
(133, 9, 'New Job Assigned', 'You have been assigned to Appointment #85.', 0, 85, '2025-11-24 09:18:17'),
(134, 16, '', 'Your service for Appointment #86 is complete. Please leave a review!', 1, 86, '2025-11-24 09:18:17'),
(135, 10, 'New Job Assigned', 'You have been assigned to Appointment #86.', 0, 86, '2025-11-24 09:18:17'),
(136, 32, '', 'Your service for Appointment #87 is complete. Please leave a review!', 0, 87, '2025-11-24 09:18:17'),
(137, 4, 'New Job Assigned', 'You have been assigned to Appointment #87.', 1, 87, '2025-11-24 09:18:17'),
(138, 26, '', 'Your service for Appointment #89 is complete. Please leave a review!', 1, 89, '2025-11-24 09:18:17'),
(139, 9, 'New Job Assigned', 'You have been assigned to Appointment #89.', 1, 89, '2025-11-24 09:18:17'),
(140, 2, '', 'Your service for Appointment #90 is complete. Please leave a review!', 0, 90, '2025-11-24 09:18:17'),
(141, 11, 'New Job Assigned', 'You have been assigned to Appointment #90.', 1, 90, '2025-11-24 09:18:17'),
(142, 25, '', 'Your appointment on 12/22/2025 has been confirmed.', 1, 91, '2025-11-24 09:18:17'),
(143, 9, 'New Job Assigned', 'You have been assigned to Appointment #91.', 0, 91, '2025-11-24 09:18:17'),
(144, 16, '', 'Your service for Appointment #92 is complete. Please leave a review!', 1, 92, '2025-11-24 09:18:17'),
(145, 4, 'New Job Assigned', 'You have been assigned to Appointment #92.', 1, 92, '2025-11-24 09:18:17'),
(146, 2, '', 'Your appointment on 11/24/2025 has been confirmed.', 1, 93, '2025-11-24 09:18:17'),
(147, 4, 'New Job Assigned', 'You have been assigned to Appointment #93.', 1, 93, '2025-11-24 09:18:17'),
(148, 19, '', 'Your appointment on 12/12/2025 has been confirmed.', 1, 94, '2025-11-24 09:18:17'),
(149, 4, 'New Job Assigned', 'You have been assigned to Appointment #94.', 1, 94, '2025-11-24 09:18:17'),
(150, 27, '', 'Your service for Appointment #95 is complete. Please leave a review!', 0, 95, '2025-11-24 09:18:17'),
(151, 9, 'New Job Assigned', 'You have been assigned to Appointment #95.', 0, 95, '2025-11-24 09:18:17'),
(152, 29, 'Appointment Cancelled', 'Appointment #96 has been cancelled.', 1, 96, '2025-11-24 09:18:17'),
(153, 18, '', 'Your appointment on 11/30/2025 has been confirmed.', 0, 97, '2025-11-24 09:18:17'),
(154, 11, 'New Job Assigned', 'You have been assigned to Appointment #97.', 1, 97, '2025-11-24 09:18:17'),
(155, 32, '', 'Your service for Appointment #98 is complete. Please leave a review!', 0, 98, '2025-11-24 09:18:17'),
(156, 12, 'New Job Assigned', 'You have been assigned to Appointment #98.', 0, 98, '2025-11-24 09:18:17'),
(157, 25, '', 'Your service for Appointment #99 is complete. Please leave a review!', 1, 99, '2025-11-24 09:18:17'),
(158, 12, 'New Job Assigned', 'You have been assigned to Appointment #99.', 0, 99, '2025-11-24 09:18:17'),
(159, 29, '', 'Your service for Appointment #100 is complete. Please leave a review!', 0, 100, '2025-11-24 09:18:17'),
(160, 9, 'New Job Assigned', 'You have been assigned to Appointment #100.', 0, 100, '2025-11-24 09:18:17'),
(161, 2, '', 'Your service for Appointment #101 is complete. Please leave a review!', 1, 101, '2025-11-24 09:18:17'),
(162, 11, 'New Job Assigned', 'You have been assigned to Appointment #101.', 0, 101, '2025-11-24 09:18:17'),
(163, 22, '', 'Your service for Appointment #102 is complete. Please leave a review!', 1, 102, '2025-11-24 09:18:17'),
(164, 10, 'New Job Assigned', 'You have been assigned to Appointment #102.', 0, 102, '2025-11-24 09:18:17'),
(165, 13, '', 'Your service for Appointment #103 is complete. Please leave a review!', 0, 103, '2025-11-24 09:18:17'),
(166, 8, 'New Job Assigned', 'You have been assigned to Appointment #103.', 1, 103, '2025-11-24 09:18:17'),
(167, 29, '', 'Your appointment on 12/18/2025 has been confirmed.', 1, 104, '2025-11-24 09:18:17'),
(168, 4, 'New Job Assigned', 'You have been assigned to Appointment #104.', 0, 104, '2025-11-24 09:18:17'),
(169, 28, 'Appointment Cancelled', 'Appointment #105 has been cancelled.', 1, 105, '2025-11-24 09:18:17'),
(170, 2, 'Appointment Cancelled', 'Appointment #106 has been cancelled.', 0, 106, '2025-11-24 09:18:17'),
(171, 19, '', 'Your service for Appointment #107 is complete. Please leave a review!', 0, 107, '2025-11-24 09:18:17'),
(172, 11, 'New Job Assigned', 'You have been assigned to Appointment #107.', 1, 107, '2025-11-24 09:18:17'),
(173, 16, 'Appointment Cancelled', 'Appointment #108 has been cancelled.', 1, 108, '2025-11-24 09:18:17'),
(174, 31, '', 'Your appointment on 12/9/2025 has been confirmed.', 1, 109, '2025-11-24 09:18:17'),
(175, 11, 'New Job Assigned', 'You have been assigned to Appointment #109.', 1, 109, '2025-11-24 09:18:17'),
(176, 16, '', 'Your service for Appointment #110 is complete. Please leave a review!', 1, 110, '2025-11-24 09:18:17'),
(177, 9, 'New Job Assigned', 'You have been assigned to Appointment #110.', 0, 110, '2025-11-24 09:18:17'),
(178, 14, '', 'Your appointment on 12/6/2025 has been confirmed.', 1, 111, '2025-11-24 09:18:17'),
(179, 8, 'New Job Assigned', 'You have been assigned to Appointment #111.', 0, 111, '2025-11-24 09:18:17'),
(180, 32, '', 'Your service for Appointment #112 is complete. Please leave a review!', 1, 112, '2025-11-24 09:18:17'),
(181, 8, 'New Job Assigned', 'You have been assigned to Appointment #112.', 1, 112, '2025-11-24 09:18:17'),
(182, 26, '', 'Your service for Appointment #113 is complete. Please leave a review!', 1, 113, '2025-11-24 09:18:17'),
(183, 9, 'New Job Assigned', 'You have been assigned to Appointment #113.', 1, 113, '2025-11-24 09:18:17'),
(184, 28, '', 'Your service for Appointment #114 is complete. Please leave a review!', 0, 114, '2025-11-24 09:18:17'),
(185, 8, 'New Job Assigned', 'You have been assigned to Appointment #114.', 0, 114, '2025-11-24 09:18:17'),
(186, 19, '', 'Your service for Appointment #115 is complete. Please leave a review!', 1, 115, '2025-11-24 09:18:17'),
(187, 11, 'New Job Assigned', 'You have been assigned to Appointment #115.', 0, 115, '2025-11-24 09:18:17'),
(188, 19, '', 'Your service for Appointment #116 is complete. Please leave a review!', 1, 116, '2025-11-24 09:18:17'),
(189, 10, 'New Job Assigned', 'You have been assigned to Appointment #116.', 1, 116, '2025-11-24 09:18:17'),
(190, 14, '', 'Your service for Appointment #117 is complete. Please leave a review!', 0, 117, '2025-11-24 09:18:17'),
(191, 10, 'New Job Assigned', 'You have been assigned to Appointment #117.', 1, 117, '2025-11-24 09:18:17'),
(192, 28, '', 'Your service for Appointment #118 is complete. Please leave a review!', 1, 118, '2025-11-24 09:18:17'),
(193, 10, 'New Job Assigned', 'You have been assigned to Appointment #118.', 1, 118, '2025-11-24 09:18:17'),
(194, 19, 'Appointment Cancelled', 'Appointment #119 has been cancelled.', 0, 119, '2025-11-24 09:18:17'),
(195, 29, '', 'Your service for Appointment #120 is complete. Please leave a review!', 1, 120, '2025-11-24 09:18:17'),
(196, 4, 'New Job Assigned', 'You have been assigned to Appointment #120.', 0, 120, '2025-11-24 09:18:17'),
(197, 25, '', 'Your service for Appointment #122 is complete. Please leave a review!', 0, 122, '2025-11-24 09:18:17'),
(198, 4, 'New Job Assigned', 'You have been assigned to Appointment #122.', 0, 122, '2025-11-24 09:18:17'),
(199, 32, '', 'Your service for Appointment #123 is complete. Please leave a review!', 0, 123, '2025-11-24 09:18:17'),
(200, 12, 'New Job Assigned', 'You have been assigned to Appointment #123.', 1, 123, '2025-11-24 09:18:17'),
(201, 2, '', 'Your service for Appointment #124 is complete. Please leave a review!', 0, 124, '2025-11-24 09:18:17'),
(202, 10, 'New Job Assigned', 'You have been assigned to Appointment #124.', 0, 124, '2025-11-24 09:18:17'),
(203, 28, 'Appointment Cancelled', 'Appointment #125 has been cancelled.', 1, 125, '2025-11-24 09:18:17'),
(204, 27, '', 'Your service for Appointment #126 is complete. Please leave a review!', 0, 126, '2025-11-24 09:18:17'),
(205, 8, 'New Job Assigned', 'You have been assigned to Appointment #126.', 1, 126, '2025-11-24 09:18:17'),
(206, 21, 'Appointment Cancelled', 'Appointment #127 has been cancelled.', 0, 127, '2025-11-24 09:18:17'),
(207, 28, '', 'Your service for Appointment #128 is complete. Please leave a review!', 1, 128, '2025-11-24 09:18:17'),
(208, 12, 'New Job Assigned', 'You have been assigned to Appointment #128.', 1, 128, '2025-11-24 09:18:17'),
(209, 26, '', 'Your service for Appointment #129 is complete. Please leave a review!', 1, 129, '2025-11-24 09:18:17'),
(210, 8, 'New Job Assigned', 'You have been assigned to Appointment #129.', 0, 129, '2025-11-24 09:18:17'),
(211, 2, '', 'Your service for Appointment #130 is complete. Please leave a review!', 0, 130, '2025-11-24 09:18:17'),
(212, 4, 'New Job Assigned', 'You have been assigned to Appointment #130.', 1, 130, '2025-11-24 09:18:17'),
(213, 30, 'Appointment Cancelled', 'Appointment #131 has been cancelled.', 1, 131, '2025-11-24 09:18:17'),
(214, 24, '', 'Your service for Appointment #132 is complete. Please leave a review!', 0, 132, '2025-11-24 09:18:17'),
(215, 4, 'New Job Assigned', 'You have been assigned to Appointment #132.', 1, 132, '2025-11-24 09:18:17'),
(216, 22, '', 'Your service for Appointment #133 is complete. Please leave a review!', 0, 133, '2025-11-24 09:18:17'),
(217, 8, 'New Job Assigned', 'You have been assigned to Appointment #133.', 0, 133, '2025-11-24 09:18:17'),
(218, 31, '', 'Your service for Appointment #134 is complete. Please leave a review!', 0, 134, '2025-11-24 09:18:17'),
(219, 10, 'New Job Assigned', 'You have been assigned to Appointment #134.', 0, 134, '2025-11-24 09:18:17'),
(220, 27, '', 'Your appointment on 12/12/2025 has been confirmed.', 0, 136, '2025-11-24 09:18:17'),
(221, 12, 'New Job Assigned', 'You have been assigned to Appointment #136.', 0, 136, '2025-11-24 09:18:17'),
(222, 25, '', 'Your service for Appointment #137 is complete. Please leave a review!', 1, 137, '2025-11-24 09:18:17'),
(223, 12, 'New Job Assigned', 'You have been assigned to Appointment #137.', 1, 137, '2025-11-24 09:18:17'),
(224, 2, '', 'Your service for Appointment #138 is complete. Please leave a review!', 1, 138, '2025-11-24 09:18:17'),
(225, 9, 'New Job Assigned', 'You have been assigned to Appointment #138.', 0, 138, '2025-11-24 09:18:17'),
(226, 26, '', 'Your service for Appointment #139 is complete. Please leave a review!', 0, 139, '2025-11-24 09:18:17'),
(227, 12, 'New Job Assigned', 'You have been assigned to Appointment #139.', 1, 139, '2025-11-24 09:18:17'),
(228, 31, 'Appointment Cancelled', 'Appointment #140 has been cancelled.', 1, 140, '2025-11-24 09:18:17'),
(229, 31, '', 'Your service for Appointment #141 is complete. Please leave a review!', 0, 141, '2025-11-24 09:18:17'),
(230, 8, 'New Job Assigned', 'You have been assigned to Appointment #141.', 1, 141, '2025-11-24 09:18:17'),
(231, 14, '', 'Your service for Appointment #142 is complete. Please leave a review!', 0, 142, '2025-11-24 09:18:17'),
(232, 11, 'New Job Assigned', 'You have been assigned to Appointment #142.', 1, 142, '2025-11-24 09:18:17'),
(233, 19, '', 'Your service for Appointment #144 is complete. Please leave a review!', 1, 144, '2025-11-24 09:18:17'),
(234, 9, 'New Job Assigned', 'You have been assigned to Appointment #144.', 0, 144, '2025-11-24 09:18:17'),
(235, 26, 'Appointment Cancelled', 'Appointment #145 has been cancelled.', 1, 145, '2025-11-24 09:18:17'),
(236, 27, '', 'Your service for Appointment #146 is complete. Please leave a review!', 1, 146, '2025-11-24 09:18:17'),
(237, 8, 'New Job Assigned', 'You have been assigned to Appointment #146.', 0, 146, '2025-11-24 09:18:17'),
(238, 15, '', 'Your service for Appointment #147 is complete. Please leave a review!', 1, 147, '2025-11-24 09:18:17'),
(239, 12, 'New Job Assigned', 'You have been assigned to Appointment #147.', 1, 147, '2025-11-24 09:18:17'),
(240, 16, '', 'Your service for Appointment #148 is complete. Please leave a review!', 1, 148, '2025-11-24 09:18:17'),
(241, 4, 'New Job Assigned', 'You have been assigned to Appointment #148.', 1, 148, '2025-11-24 09:18:17'),
(242, 31, '', 'Your service for Appointment #149 is complete. Please leave a review!', 0, 149, '2025-11-24 09:18:17'),
(243, 9, 'New Job Assigned', 'You have been assigned to Appointment #149.', 0, 149, '2025-11-24 09:18:17'),
(244, 30, '', 'Your service for Appointment #150 is complete. Please leave a review!', 0, 150, '2025-11-24 09:18:17'),
(245, 11, 'New Job Assigned', 'You have been assigned to Appointment #150.', 0, 150, '2025-11-24 09:18:17'),
(246, 30, 'Appointment Rejected', 'Rejected. Reason: bcos you\'re gay', 0, 50, '2025-11-24 13:07:20');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `technician_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `feedback_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `appointment_id`, `customer_id`, `technician_id`, `rating`, `feedback_text`, `created_at`) VALUES
(1, 1, 32, 8, 3, 'Took longer than expected, but the job got done.', '2025-06-21 10:21:04'),
(2, 2, 28, 12, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-06-27 19:29:20'),
(3, 3, 24, 4, 4, 'Satisfied with the installation. Clean work.', '2025-10-14 20:01:18'),
(4, 4, 18, 9, 5, 'Excellent service! The technician was very professional and efficient.', '2025-07-03 12:14:30'),
(5, 8, 14, 4, 5, 'Excellent service! The technician was very professional and efficient.', '2025-06-30 01:37:43'),
(6, 10, 26, 10, 3, 'Took longer than expected, but the job got done.', '2025-10-07 07:24:25'),
(7, 11, 32, 12, 4, 'Satisfied with the installation. Clean work.', '2025-10-25 22:00:39'),
(8, 13, 23, 10, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-09-26 09:17:35'),
(9, 14, 28, 4, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-06-29 08:58:45'),
(10, 17, 31, 9, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-06-26 18:34:03'),
(11, 22, 2, 4, 4, 'Satisfied with the installation. Clean work.', '2025-06-12 08:33:57'),
(12, 26, 17, 12, 5, 'Excellent service! The technician was very professional and efficient.', '2025-09-10 00:35:48'),
(13, 27, 18, 8, 4, 'Satisfied with the installation. Clean work.', '2025-10-15 21:12:25'),
(14, 29, 21, 4, 3, 'Took longer than expected, but the job got done.', '2025-10-05 11:36:44'),
(15, 30, 32, 4, 5, 'Excellent service! The technician was very professional and efficient.', '2025-07-02 10:05:18'),
(16, 31, 18, 12, 4, 'Good service, but arrived a bit late. Work quality was great though.', '2025-08-07 11:35:19'),
(17, 35, 27, 8, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-07-30 04:43:39'),
(18, 36, 29, 10, 3, 'Took longer than expected, but the job got done.', '2025-06-07 21:35:30'),
(19, 41, 20, 4, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-10-30 03:25:27'),
(20, 43, 13, 9, 3, 'Took longer than expected, but the job got done.', '2025-09-02 19:26:16'),
(21, 47, 23, 10, 2, 'Technician was rude and left a mess.', '2025-10-19 20:22:09'),
(22, 52, 27, 9, 4, 'Good service, but arrived a bit late. Work quality was great though.', '2025-09-19 00:05:29'),
(23, 53, 31, 9, 2, 'Technician was rude and left a mess.', '2025-05-30 01:43:31'),
(24, 54, 26, 4, 1, 'Terrible experience. System stopped working after 2 days.', '2025-11-03 20:41:00'),
(25, 57, 21, 12, 1, 'Terrible experience. System stopped working after 2 days.', '2025-10-16 03:00:04'),
(26, 59, 26, 10, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-07-26 00:11:18'),
(27, 60, 2, 4, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-08-03 18:35:59'),
(28, 69, 20, 4, 4, 'Satisfied with the installation. Clean work.', '2025-06-29 07:54:37'),
(29, 70, 13, 9, 3, 'Took longer than expected, but the job got done.', '2025-09-11 19:30:12'),
(30, 71, 16, 10, 5, 'Excellent service! The technician was very professional and efficient.', '2025-09-04 01:15:45'),
(31, 72, 13, 9, 2, 'Technician was rude and left a mess.', '2025-11-04 03:29:20'),
(32, 73, 31, 4, 2, 'Technician was rude and left a mess.', '2025-06-28 08:16:48'),
(33, 74, 2, 4, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-08-08 14:15:16'),
(34, 81, 32, 11, 3, 'Took longer than expected, but the job got done.', '2025-11-16 01:48:06'),
(35, 82, 19, 11, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-10-13 07:07:13'),
(36, 85, 30, 9, 4, 'Satisfied with the installation. Clean work.', '2025-09-20 12:57:05'),
(37, 87, 32, 4, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-07-16 21:00:53'),
(38, 89, 26, 9, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-06-15 06:55:34'),
(39, 90, 2, 11, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-07-19 23:50:22'),
(40, 92, 16, 4, 2, 'Technician was rude and left a mess.', '2025-09-25 13:45:47'),
(41, 95, 27, 9, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-08-14 01:15:39'),
(42, 98, 32, 12, 5, 'Excellent service! The technician was very professional and efficient.', '2025-09-25 00:58:51'),
(43, 99, 25, 12, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-08-27 14:14:24'),
(44, 102, 22, 10, 4, 'Satisfied with the installation. Clean work.', '2025-11-02 03:44:09'),
(45, 103, 13, 8, 2, 'Technician was rude and left a mess.', '2025-10-02 13:29:19'),
(46, 107, 19, 11, 4, 'Good service, but arrived a bit late. Work quality was great though.', '2025-07-01 05:58:54'),
(47, 110, 16, 9, 1, 'Terrible experience. System stopped working after 2 days.', '2025-07-02 05:35:29'),
(48, 113, 26, 9, 2, 'Technician was rude and left a mess.', '2025-06-03 21:31:40'),
(49, 114, 28, 8, 5, 'Excellent service! The technician was very professional and efficient.', '2025-08-16 15:46:31'),
(50, 115, 19, 11, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-09-07 00:59:35'),
(51, 116, 19, 10, 5, 'Excellent service! The technician was very professional and efficient.', '2025-08-26 21:36:49'),
(52, 117, 14, 10, 5, 'Excellent service! The technician was very professional and efficient.', '2025-11-13 04:25:05'),
(53, 118, 28, 10, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-06-27 12:41:56'),
(54, 120, 29, 4, 1, 'Terrible experience. System stopped working after 2 days.', '2025-11-17 05:56:10'),
(55, 122, 25, 4, 3, 'Took longer than expected, but the job got done.', '2025-09-10 09:25:52'),
(56, 124, 2, 10, 4, 'Good service, but arrived a bit late. Work quality was great though.', '2025-08-06 20:19:54'),
(57, 126, 27, 8, 1, 'Terrible experience. System stopped working after 2 days.', '2025-09-29 03:31:31'),
(58, 128, 28, 12, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-11-03 00:54:38'),
(59, 129, 26, 8, 1, 'Terrible experience. System stopped working after 2 days.', '2025-07-20 05:44:53'),
(60, 130, 2, 4, 3, 'Took longer than expected, but the job got done.', '2025-09-02 08:20:46'),
(61, 134, 31, 10, 5, 'Great job, highly recommended. Fixed the issue quickly.', '2025-07-16 12:09:51'),
(62, 141, 31, 8, 5, 'Excellent service! The technician was very professional and efficient.', '2025-09-07 16:18:09'),
(63, 142, 14, 11, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-08-26 01:48:51'),
(64, 146, 27, 8, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-11-07 01:03:55'),
(65, 147, 15, 12, 3, 'Average service. The camera works but the angle isn\'t what I asked for.', '2025-08-25 10:21:35'),
(66, 150, 30, 11, 5, 'Very happy with the installation. The cameras are crystal clear.', '2025-10-17 22:18:47');

--
-- Triggers `reviews`
--
DELIMITER $$
CREATE TRIGGER `trg_update_tech_rating` AFTER INSERT ON `reviews` FOR EACH ROW BEGIN
    UPDATE technician_profiles 
    SET average_rating = (SELECT AVG(rating) FROM reviews WHERE technician_id = NEW.technician_id)
    WHERE user_id = NEW.technician_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `estimated_price` decimal(10,2) DEFAULT NULL,
  `price_type` enum('Fixed','Starting At','Quote Required') DEFAULT 'Fixed',
  `duration_minutes` int(11) DEFAULT 60,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `category_id`, `name`, `description`, `estimated_price`, `price_type`, `duration_minutes`, `is_active`) VALUES
(1, 1, 'CCTV Installation (Basic)', NULL, 1500.00, 'Fixed', 120, 1),
(2, 1, 'CCTV Installation (Advanced)', 'Advanced CCTV Installation', 2500.00, 'Fixed', 240, 1),
(3, 2, 'Camera Repair', NULL, 800.00, 'Fixed', 60, 1),
(4, 6, 'System Maintenance', 'Maintenance', 1200.00, 'Fixed', 90, 1),
(5, 7, 'DVR/NVR Configuration', NULL, 1000.00, 'Fixed', 60, 1),
(6, 1, 'Cabling & Wiring', NULL, 2000.00, 'Fixed', 180, 1),
(7, 7, 'Remote Viewing Setup', NULL, 500.00, 'Fixed', 45, 1),
(8, 7, 'Security Consultation', NULL, 0.00, 'Fixed', 30, 1);

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `color` varchar(20) DEFAULT '#9CA3AF',
  `icon` varchar(50) DEFAULT 'Menu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_categories`
--

INSERT INTO `service_categories` (`category_id`, `name`, `color`, `icon`) VALUES
(1, 'Installation', '#5B8FFF', 'Settings'),
(2, 'Repair', '#FF9B66', 'Wrench'),
(6, 'Upgrade & Maintenance', '#4ADE80', 'Sparkles'),
(7, 'Others', '#c2c2c2', 'Box');

-- --------------------------------------------------------

--
-- Table structure for table `technician_profiles`
--

CREATE TABLE `technician_profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specialty` enum('Hardware Repair','Software Support','Network Setup','Data Recovery','System Maintenance','Virus Removal','Custom Build','Consultation','General') DEFAULT 'General',
  `bio` text DEFAULT NULL,
  `availability_status` enum('Available','On Job','Offline') DEFAULT 'Offline',
  `total_jobs_completed` int(11) DEFAULT 0,
  `average_rating` decimal(3,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technician_profiles`
--

INSERT INTO `technician_profiles` (`profile_id`, `user_id`, `specialty`, `bio`, `availability_status`, `total_jobs_completed`, `average_rating`) VALUES
(1, 4, '', NULL, 'Available', 0, 3.53),
(2, 8, '', NULL, 'Available', 0, 3.22),
(3, 9, '', NULL, 'Available', 0, 3.25),
(4, 10, '', NULL, 'Available', 0, 3.92),
(5, 11, '', NULL, 'Available', 0, 4.29),
(6, 12, '', NULL, 'Available', 0, 4.11),
(7, 32, 'Network Setup', NULL, 'Available', 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(11) NOT NULL,
  `address` text DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Receptionist','Technician','Customer') NOT NULL DEFAULT 'Customer',
  `status` enum('Active','Inactive','Banned') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `first_name`, `last_name`, `email`, `phone_number`, `address`, `password_hash`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'sherwin', 'Sherwin', 'Arizobal', 'sherwin@gmail.com', '09634045671', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Admin', 'Active', '2025-10-30 08:32:06', '2025-11-24 09:18:17'),
(2, 'edrian', 'Edrian', 'Balingbing', 'edrian@gmail.com', '09955824197', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 08:34:33', '2025-11-24 09:18:17'),
(3, 'ishi', 'Ishi', 'Ganda', 'ishi@gmail.com', '09999999999', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Receptionist', 'Active', '2025-11-07 08:35:44', '2025-11-24 09:18:17'),
(4, 'frank', 'frank', 'ocean', 'blonded@gmail.com', '09783813287', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-01 08:35:44', '2025-11-24 09:18:17'),
(5, 'lunamarie', 'Luna', 'Marie', 'luna.marie@example.com', '09806367741', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Receptionist', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(6, 'sarahconnor', 'Sarah', 'Connor', 'sarah.connor@example.com', '09329465187', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Receptionist', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(7, 'pambeesly', 'Pam', 'Beesly', 'pam.beesly@example.com', '09211063703', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Receptionist', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(8, 'bobbuilder', 'Bob', 'Builder', 'bobbuilder@example.com', '09532562007', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(9, 'fixit', 'Fix', 'It', 'fixit@example.com', '09802843386', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(10, 'handymanny', 'Handy', 'Manny', 'handymanny@example.com', '09882602529', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(11, 'timtaylor', 'Tim', 'Taylor', 'timtaylor@example.com', '09425547033', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(12, 'alborland', 'Al', 'Borland', 'alborland@example.com', '09911773013', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(13, 'patriciataylor0', 'Patricia', 'Taylor', 'patriciataylor0@example.com', '09322981200', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(14, 'lindawilliams1', 'Linda', 'Williams', 'lindawilliams1@example.com', '099907278', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(15, 'sarahwilliams2', 'Sarah', 'Williams', 'sarahwilliams2@example.com', '0946698306', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(16, 'michaelmoore3', 'Michael', 'Moore', 'michaelmoore3@example.com', '09129214966', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(17, 'thomasgonzalez4', 'Thomas', 'Gonzalez', 'thomasgonzalez4@example.com', '09772281612', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(18, 'williamwilson5', 'William', 'Wilson', 'williamwilson5@example.com', '09454943742', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(19, 'josephjones6', 'Joseph', 'Jones', 'josephjones6@example.com', '09528277042', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(20, 'davidbrown7', 'David', 'Brown', 'davidbrown7@example.com', '09111949885', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(21, 'williamgonzalez8', 'William', 'Gonzalez', 'williamgonzalez8@example.com', '09490082945', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(22, 'robertwilliams9', 'Robert', 'Williams', 'robertwilliams9@example.com', '09210847636', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(23, 'marygonzalez10', 'Mary', 'Gonzalez', 'marygonzalez10@example.com', '09169434857', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(24, 'barbararodriguez11', 'Barbara', 'Rodriguez', 'barbararodriguez11@example.com', '09513242060', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(25, 'maryrodriguez12', 'Mary', 'Rodriguez', 'maryrodriguez12@example.com', '09251118917', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(26, 'marytaylor13', 'Mary', 'Taylor', 'marytaylor13@example.com', '0996895546', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(27, 'jamestaylor14', 'James', 'Taylor', 'jamestaylor14@example.com', '09575720939', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(28, 'patriciawilson15', 'Patricia', 'Wilson', 'patriciawilson15@example.com', '09800948295', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(29, 'karenjohnson16', 'Karen', 'Johnson', 'karenjohnson16@example.com', '09536186144', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(30, 'richarddavis17', 'Richard', 'Davis', 'richarddavis17@example.com', '09822468053', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(31, 'elizabethmartinez18', 'Elizabeth', 'Martinez', 'elizabethmartinez18@example.com', '09143091841', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Customer', 'Active', '2025-11-24 09:18:17', '2025-11-24 09:18:17'),
(32, 'davidmiller19', 'David', 'Miller', 'davidmiller19@example.com', '09500137252', NULL, '$2b$10$32KhlcYBYCNObGMou8pQ7.QAKf2dHFgoutDyMlXjOZrStiyOewhUe', 'Technician', 'Active', '2025-11-24 09:18:17', '2025-11-24 15:32:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `technician_id` (`technician_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `fk_cancelled_by` (`cancelled_by`),
  ADD KEY `fk_deletion_marked_by` (`deletion_marked_by`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `related_appointment_id` (`related_appointment_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `technician_id` (`technician_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `technician_profiles`
--
ALTER TABLE `technician_profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=305;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=247;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `technician_profiles`
--
ALTER TABLE `technician_profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`),
  ADD CONSTRAINT `fk_cancelled_by` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_deletion_marked_by` FOREIGN KEY (`deletion_marked_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`related_appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`technician_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`category_id`);

--
-- Constraints for table `technician_profiles`
--
ALTER TABLE `technician_profiles`
  ADD CONSTRAINT `technician_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
