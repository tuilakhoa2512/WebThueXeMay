-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 18, 2026 lúc 03:27 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `webthuexe`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Honda', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Xe tay ga', NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `vehicle_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2026_04_09_064539_create_roles_table', 1),
(4, '2026_04_09_064554_create_brands_table', 1),
(5, '2026_04_09_064559_create_categories_table', 1),
(6, '2026_04_09_064647_create_users_table', 1),
(7, '2026_04_09_064654_create_vehicles_table', 1),
(8, '2026_04_09_064700_create_vehicle_images_table', 1),
(9, '2026_04_09_064705_create_rentals_table', 1),
(10, '2026_04_09_064711_create_reviews_table', 1),
(11, '2026_04_09_064715_create_payments_table', 1),
(12, '2026_04_09_064721_create_favorites_table', 1),
(13, '2026_04_09_064727_create_notifications_table', 1),
(14, '2026_04_09_064735_create_verification_codes_table', 1),
(15, '2026_04_10_074810_create_personal_access_tokens_table', 2),
(16, '2026_04_12_070534_add_comment_to_status_in_rentals', 3),
(17, '2026_04_16_133952_add_timestamps_to_payments_table', 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `content` varchar(255) NOT NULL,
  `is_read` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `rental_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `rental_id`, `amount`, `payment_method`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 350000.00, 'cash', 1, NULL, NULL),
(2, 7, 450000.00, 'vnpay', 0, NULL, NULL),
(3, 9, 360000.00, 'cash', 1, NULL, NULL),
(4, 8, 450000.00, 'vnpay', 0, NULL, NULL),
(5, 10, 2250000.00, 'vnpay', 1, NULL, NULL),
(6, 11, 450000.00, 'vnpay', 1, NULL, NULL),
(7, 12, 450000.00, 'cash', 1, NULL, NULL),
(8, 13, 450000.00, 'cash', 1, NULL, NULL),
(9, 14, 450000.00, 'vnpay', 0, NULL, NULL),
(10, 15, 450000.00, 'vnpay', 1, NULL, NULL),
(11, 16, 750000.00, 'cash', 1, NULL, NULL),
(12, 17, 450000.00, 'vnpay', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'api-token', 'bedbeb6154869f9139fc6af389868838507d0b02dc1b6e9c193f1998061e40f6', '[\"*\"]', NULL, NULL, '2026-04-10 00:49:42', '2026-04-10 00:49:42'),
(2, 'App\\Models\\User', 3, 'api-token', '110215751acfe1fa5c9cdf07e17fc89d64f92797160e7a2a2646b74bb7e5f916', '[\"*\"]', NULL, NULL, '2026-04-10 00:53:44', '2026-04-10 00:53:44'),
(3, 'App\\Models\\User', 2, 'api-token', 'c9ef9248c62d53589f218ecce73166edd923d4dec2e0e8ea94356c757c25650b', '[\"*\"]', '2026-04-10 01:27:24', NULL, '2026-04-10 01:03:50', '2026-04-10 01:27:24'),
(4, 'App\\Models\\User', 2, 'api-token', 'b0865e04f5f4e8bc191b54dadb84b5087883b4687958eee8b7a0e9763d3cd62e', '[\"*\"]', '2026-04-10 02:40:56', NULL, '2026-04-10 02:07:29', '2026-04-10 02:40:56'),
(5, 'App\\Models\\User', 2, 'api-token', 'b6b6b8c720176b627eb14e5a9ea0421b0812a947d3de6798c3611dd3ed987c98', '[\"*\"]', '2026-04-11 23:10:45', NULL, '2026-04-11 22:26:31', '2026-04-11 23:10:45'),
(6, 'App\\Models\\User', 1, 'api-token', '86d9d01a1fada77cd639246e31e24de369bd1b48c82d24bb02ab8e911af83b60', '[\"*\"]', NULL, NULL, '2026-04-11 23:09:17', '2026-04-11 23:09:17'),
(7, 'App\\Models\\User', 1, 'api-token', '596e60ec56f49c519e02a236f9d3c275d614fa63f1cda16c88073c2908a78e92', '[\"*\"]', '2026-04-11 23:14:01', NULL, '2026-04-11 23:12:07', '2026-04-11 23:14:01'),
(8, 'App\\Models\\User', 2, 'api-token', '84c0eab4917e8f0e6d3ba37994691f17dc303daab953fd8349a3aeb913bef5dc', '[\"*\"]', '2026-04-11 23:20:37', NULL, '2026-04-11 23:14:38', '2026-04-11 23:20:37'),
(9, 'App\\Models\\User', 2, 'api-token', 'ffaf7cf3a4d52432b73b1c0086771b5f9d7fc11ea08c394c006c80d447a7e5e0', '[\"*\"]', '2026-04-11 23:23:33', NULL, '2026-04-11 23:21:38', '2026-04-11 23:23:33'),
(10, 'App\\Models\\User', 2, 'api-token', '5db2b2f54a313631d242b743ad55994314af02c7b71a70e95f58b8026db3258c', '[\"*\"]', '2026-04-12 01:19:13', NULL, '2026-04-11 23:27:02', '2026-04-12 01:19:13'),
(11, 'App\\Models\\User', 1, 'api-token', '5f5526afbeb1364e74a8e65c7b58e11b9fc3f4574cafb7fd9b1b746905b56933', '[\"*\"]', '2026-04-12 23:55:00', NULL, '2026-04-12 23:26:00', '2026-04-12 23:55:00'),
(12, 'App\\Models\\User', 1, 'api-token', '5346f6dccd4c41aa8902af7b8c6156375b580ea932b5a229ef68365e34e0f363', '[\"*\"]', '2026-04-13 00:33:50', NULL, '2026-04-13 00:00:51', '2026-04-13 00:33:50'),
(13, 'App\\Models\\User', 1, 'api-token', '43e363ba43fe5814c9bd4b60f5d9e489e7358607cadf3935757cf2dbc9c2c603', '[\"*\"]', '2026-04-13 01:03:13', NULL, '2026-04-13 00:59:19', '2026-04-13 01:03:13'),
(14, 'App\\Models\\User', 2, 'api-token', '7c755fc675430a4ff123cfa4601a4f6df8809ddd8c3bb2ba3516cb08513d79d3', '[\"*\"]', '2026-04-13 01:05:08', NULL, '2026-04-13 01:03:43', '2026-04-13 01:05:08'),
(15, 'App\\Models\\User', 2, 'api-token', '8ff61c72a5bb435f33faefb1e28c5d16f631adf5ab0589a95047aba08c2ce1da', '[\"*\"]', '2026-04-13 01:20:53', NULL, '2026-04-13 01:05:29', '2026-04-13 01:20:53'),
(16, 'App\\Models\\User', 1, 'api-token', '718f820f81d7afbb4bb4805a9c901f5f52ffba0bd89f421b4980dcc47b40d0d7', '[\"*\"]', '2026-04-14 00:08:45', NULL, '2026-04-13 23:26:56', '2026-04-14 00:08:45'),
(17, 'App\\Models\\User', 2, 'api-token', '9e1fd24919d061c7dba93b75e64df1b8cf2a2406589619efcb0b3ae5920380f2', '[\"*\"]', '2026-04-14 00:10:10', NULL, '2026-04-14 00:09:43', '2026-04-14 00:10:10'),
(18, 'App\\Models\\User', 1, 'api-token', '6a8f755d7f05e9e5800bafd64ce966c7119fe7f1e64f8f2900c918186f96f206', '[\"*\"]', '2026-04-14 01:22:43', NULL, '2026-04-14 00:10:31', '2026-04-14 01:22:43'),
(19, 'App\\Models\\User', 1, 'api-token', '5e681a9e1cedb37713b8bf527e1460f64148953a5a3536421854cfca8afd98c6', '[\"*\"]', '2026-04-14 09:16:51', NULL, '2026-04-14 01:25:28', '2026-04-14 09:16:51'),
(20, 'App\\Models\\User', 2, 'api-token', '582181621f28ec116279de86c2ab6702d2f9a265dd3c5a375c346f852e608373', '[\"*\"]', '2026-04-16 07:09:38', NULL, '2026-04-16 06:34:34', '2026-04-16 07:09:38'),
(21, 'App\\Models\\User', 4, 'user-token', '1bdd30a80820ad97140cc0a1ebfc7b859da3db828125e32e3dd701b29929e0c1', '[\"*\"]', NULL, NULL, '2026-04-16 07:22:22', '2026-04-16 07:22:22'),
(23, 'App\\Models\\User', 2, 'admin-token', '9b114f0c026eab5acef40671dec9d53aa99a8776043041479818aeb3880534d0', '[\"*\"]', '2026-04-16 07:42:11', NULL, '2026-04-16 07:26:36', '2026-04-16 07:42:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rentals`
--

CREATE TABLE `rentals` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `vehicle_id` int(10) UNSIGNED NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '0: pending | 1: confirmed | 2: renting | 3: completed | 4: canceled',
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rentals`
--

INSERT INTO `rentals` (`id`, `user_id`, `vehicle_id`, `start_date`, `end_date`, `status`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 2, 2, '2026-04-15 10:00:00', '2026-04-17 10:00:00', 4, 450000.00, '2026-04-11 22:28:49', '2026-04-11 22:33:11'),
(2, 2, 3, '2026-04-25 10:00:00', '2026-04-27 10:00:00', 2, 450000.00, '2026-04-11 23:05:39', '2026-04-11 23:56:51'),
(3, 1, 5, '2026-04-25 12:00:00', '2026-04-27 10:00:00', 1, 350000.00, '2026-04-11 23:13:00', '2026-04-11 23:15:33'),
(4, 2, 2, '2026-04-25 10:00:00', '2026-04-27 10:00:00', 4, 450000.00, '2026-04-11 23:27:52', '2026-04-11 23:29:08'),
(5, 2, 4, '2026-04-28 10:00:00', '2026-04-30 10:00:00', 3, 450000.00, '2026-04-11 23:59:41', '2026-04-12 00:02:48'),
(6, 1, 2, '2026-04-15 10:00:00', '2026-04-17 10:00:00', 3, 450000.00, '2026-04-13 01:00:46', '2026-04-13 01:20:11'),
(7, 1, 2, '2026-04-15 10:00:00', '2026-04-17 10:00:00', 1, 450000.00, '2026-04-13 23:50:25', '2026-04-14 00:10:10'),
(8, 1, 4, '2026-04-15 10:00:00', '2026-04-17 10:00:00', 0, 450000.00, '2026-04-14 00:14:14', '2026-04-14 00:14:14'),
(9, 1, 5, '2026-04-15 10:00:00', '2026-04-17 10:00:00', 1, 360000.00, '2026-04-14 00:37:00', '2026-04-14 00:42:09'),
(10, 1, 4, '2026-04-25 10:00:00', '2026-05-09 10:00:00', 1, 2250000.00, '2026-04-14 00:45:05', '2026-04-14 00:55:29'),
(11, 1, 2, '2026-12-25 10:00:00', '2026-12-27 10:00:00', 1, 450000.00, '2026-04-14 00:57:09', '2026-04-14 01:10:56'),
(12, 1, 2, '2026-06-20 10:00:00', '2026-06-22 10:00:00', 1, 450000.00, '2026-04-14 01:08:49', '2026-04-14 01:13:05'),
(13, 1, 2, '2026-04-22 10:00:00', '2026-04-24 10:00:00', 1, 450000.00, '2026-04-14 01:11:57', '2026-04-14 01:13:57'),
(14, 1, 2, '2026-04-28 10:00:00', '2026-04-30 10:00:00', 0, 450000.00, '2026-04-14 01:14:23', '2026-04-14 01:14:23'),
(15, 1, 2, '2026-11-30 10:00:00', '2026-12-02 10:00:00', 1, 450000.00, '2026-04-14 01:48:31', '2026-04-14 09:12:36'),
(16, 1, 4, '2026-05-16 10:00:00', '2026-05-20 10:00:00', 1, 750000.00, '2026-04-14 09:14:12', '2026-04-14 09:15:27'),
(17, 1, 4, '2026-11-20 10:00:00', '2026-11-22 10:00:00', 1, 450000.00, '2026-04-14 09:16:11', '2026-04-14 09:17:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `rental_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', NULL, NULL),
(2, 'Customer', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `fullname` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `role_id`, `fullname`, `email`, `password`, `phone`, `status`, `image`, `created_at`, `updated_at`) VALUES
(1, 2, 'Lâm Tuấn Khoa', 'fbkhoqkhoa2512@gmail.com', '$2y$12$t1gYYkH1vS5O8Rh6FODp8OuS9ViDZY8Egtf94K15o3kAJPiP47/Y2', '0325910045', 1, 'users/VzRHpUKd01wGLBw7PWu74PXYCc7PsISg0RSGH2n7.jpg', NULL, '2026-04-13 00:33:51'),
(2, 1, 'Admin', 'admin@gmail.com', '$2y$12$qTj5NQnvu/stjmljDmq3BOds1dTgh8ITjJb.PX4gVPn9QSwWezGMK', NULL, 1, NULL, '2026-04-10 00:25:27', '2026-04-10 00:25:27'),
(3, 2, 'Thue xe 1', 'user1@gmail.com', '$2y$12$acVBLnu4/wNnr9cM1IJ5BeXP.9k3L5P1kKoDZASMVSmwTbXM6gb/i', '0123456789', 1, NULL, '2026-04-10 00:53:44', '2026-04-10 00:53:44'),
(4, 2, 'Lâm Ngọc Phương Trinh', 'lnpt@gmail.com', '$2y$12$0IevEdQSPi.Zy7HWDb0gue27ZcQH6RoPbufn9W0uhi.3OixEdbiWO', '0325910045', 1, NULL, '2026-04-16 07:22:22', '2026-04-16 07:22:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `brand_id` int(10) UNSIGNED NOT NULL,
  `license_plate` varchar(50) NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `description`, `category_id`, `brand_id`, `license_plate`, `price_per_day`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Honda AirBlade', NULL, 1, 1, '54L4-6666', 150000.00, 0, NULL, '2026-04-13 01:20:11'),
(3, 'Honda Vision', NULL, 1, 1, '59A-12345', 150000.00, 1, '2026-04-10 01:05:23', '2026-04-11 23:56:51'),
(4, 'Honda Vario', NULL, 1, 1, '59A-85284', 150000.00, 0, '2026-04-10 02:13:42', '2026-04-12 00:02:48'),
(5, 'Honda Wave', NULL, 1, 1, '59A-99999', 120000.00, 0, '2026-04-10 02:19:09', '2026-04-10 02:19:09'),
(6, 'Wave Alpha', NULL, 1, 1, '54A-8888', 150000.00, 0, '2026-04-16 07:04:19', '2026-04-16 07:04:19'),
(7, 'SH Mode 125', NULL, 1, 1, '59A-6969', 150000.00, 3, '2026-04-16 07:06:29', '2026-04-16 07:37:08'),
(8, 'Yamaha Yaz', NULL, 1, 1, '59A-6666', 120000.00, 0, '2026-04-16 07:30:37', '2026-04-16 07:30:37'),
(9, 'Yaz 150', NULL, 1, 1, '59A-1569', 150000.00, 0, '2026-04-16 07:34:24', '2026-04-16 07:42:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicle_images`
--

CREATE TABLE `vehicle_images` (
  `id` int(10) UNSIGNED NOT NULL,
  `vehicle_id` int(10) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicle_images`
--

INSERT INTO `vehicle_images` (`id`, `vehicle_id`, `image`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 4, 'vehicles/2kkDYAmGj2aqhtw28tjKFIj2GKLMWrAgwMih9XGw.webp', 1, NULL, NULL),
(2, 4, 'vehicles/tyFiF295GhvxSGROm6ulhoiapOl4vRVqyMVi8sRG.png', 0, NULL, NULL),
(3, 9, 'vehicles/TUTCtlFULbUOUT6rv1m7LbvIAp82lMKhsWeiBuU7.jpg', 1, NULL, NULL),
(4, 9, 'vehicles/UFGEchft0T8cQzUr23CWKkCJzTFwpAUR0EVWWVA6.jpg', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `verification_codes`
--

CREATE TABLE `verification_codes` (
  `id` int(10) UNSIGNED NOT NULL,
  `contact` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expired_at` datetime NOT NULL,
  `is_used` tinyint(3) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favorites_user_id_vehicle_id_unique` (`user_id`,`vehicle_id`),
  ADD KEY `favorites_vehicle_id_foreign` (`vehicle_id`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_rental_id_unique` (`rental_id`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rentals_user_id_foreign` (`user_id`),
  ADD KEY `rentals_vehicle_id_foreign` (`vehicle_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_rental_id_unique` (`rental_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- Chỉ mục cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicles_license_plate_unique` (`license_plate`),
  ADD KEY `vehicles_category_id_foreign` (`category_id`),
  ADD KEY `vehicles_brand_id_foreign` (`brand_id`);

--
-- Chỉ mục cho bảng `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_images_vehicle_id_foreign` (`vehicle_id`);

--
-- Chỉ mục cho bảng `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `vehicle_images`
--
ALTER TABLE `vehicle_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `verification_codes`
--
ALTER TABLE `verification_codes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rentals_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vehicles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD CONSTRAINT `vehicle_images_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
