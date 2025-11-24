-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 02:25 PM
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
  `cancellation_category` enum('Changed Mind','Found Cheaper','Emergency','Tech Unavailable','Other') DEFAULT NULL,
  `is_walk_in` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `base_price` decimal(10,2) NOT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `technician_profiles`
--

CREATE TABLE `technician_profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `availability_status` enum('Available','On Job','Offline') DEFAULT 'Offline',
  `total_jobs_completed` int(11) DEFAULT 0,
  `average_rating` decimal(3,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Receptionist','Technician','Customer') NOT NULL DEFAULT 'Customer',
  `status` enum('Active','Inactive','Banned') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD KEY `service_id` (`service_id`);

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
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `technician_profiles`
--
ALTER TABLE `technician_profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);

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
