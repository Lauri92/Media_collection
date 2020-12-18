-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql.metropolia.fi
-- Generation Time: 13.12.2020 klo 12:10
-- Palvelimen versio: 10.1.48-MariaDB
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lauriari`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `wop_testcomments`
--

CREATE TABLE `wop_testcomments` (
  `id` int(11) NOT NULL,
  `pic_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment` text,
  `date` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Vedos taulusta `wop_testcomments`
--

INSERT INTO `wop_testcomments` (`id`, `pic_id`, `user_id`, `comment`, `date`) VALUES
(1, 3, 8, 'Wow so nice!', '2020-11-24 17:29:13'),
(3, 49, 1, 'Wow so nice!', '2020-11-24 17:29:13'),
(4, 50, 2, 'Not so nice!', '2020-11-24 17:29:13'),
(82, 73, 20, 'no hei vaa', '2020-12-01 12:00:50'),
(80, 76, 20, 'no hei vaa', '2020-12-01 12:00:50'),
(81, 55, 20, 'no hei vaa', '2020-12-01 12:00:50'),
(9, 55, 2, 'Wow so nice!', '2020-11-24 17:29:13'),
(84, 77, 20, 'no hei vaa', '2020-12-01 12:00:50'),
(11, 63, 16, 'Wow so nice!', '2020-11-24 17:29:13'),
(12, 64, 16, 'Wow so nice!', '2020-11-24 17:29:13'),
(13, 64, 16, 'I dont like this one so much!', '2020-11-24 17:29:13'),
(14, 64, 16, 'Nice cat there.', '2020-11-24 17:29:13'),
(15, 64, 1, 'Breath taking view! I think I can see a lion down there.', '2020-11-24 17:29:13'),
(16, 64, 16, 'Wow man that is an awesome picture!', '2020-11-24 17:29:13'),
(18, 64, 2, 'I really like the t-rex, it looks dangerous', '2020-11-24 17:29:13'),
(83, 76, 20, 'no hei vaa', '2020-12-01 12:00:50'),
(20, 64, 2, 'Throwing another comment here!', '2020-11-24 17:29:13'),
(21, 64, 2, 'Seems to update as it shoud, really nice!', '2020-11-24 17:29:13'),
(22, 64, 16, 'Still works?', '2020-11-24 17:29:13'),
(23, 64, 16, 'Looks like that', '2020-11-24 17:29:13'),
(25, 63, 16, 'Date test.', '2020-11-24 17:47:42'),
(90, 76, 20, 'no hei vaa', '2020-12-01 12:14:04'),
(228, 212, 20, 'tämä on hieno eläin', '2020-12-08 16:52:10'),
(229, 213, 20, 'tämä on hieno eläin', '2020-12-08 16:52:10'),
(30, 65, 16, 'Definitely a Finnish night parrot! You are a great ornithologist!', '2020-11-24 19:25:39'),
(31, 64, 16, 'Date test.', '2020-11-24 21:48:05'),
(32, 64, 16, 'Awesome testing.', '2020-11-24 21:58:10'),
(33, 65, 16, 'Really beautiful parrot, but I can\'t see the location! I thought this app was supposed to show the location for taken photos!', '2020-11-25 10:04:23'),
(199, 76, 43, 'Tetttx\n\n\n', '2020-12-07 13:44:59'),
(198, 157, 43, 'Tetttx\n\n\n', '2020-12-07 13:44:59'),
(197, 76, 43, '\n\n\n', '2020-12-07 13:44:37'),
(37, 66, 18, 'Reaali aika', '2020-11-25 12:59:23'),
(196, 157, 43, '\n\n\n', '2020-12-07 13:44:37'),
(39, 68, 16, 'First comment', '2020-11-25 13:49:27'),
(223, 212, 20, 'komea elukka ', '2020-12-08 16:51:25'),
(41, 70, 16, 'Is the time right?', '2020-11-25 15:20:06'),
(42, 70, 16, 'Nope!', '2020-11-25 15:20:30'),
(43, 71, 16, 'Testing this pic', '2020-11-25 19:02:05'),
(44, 64, 16, 'Hello test', '2020-11-25 23:56:27'),
(45, 50, 2, 'Where does this show up?', '2020-11-26 16:48:53'),
(46, 74, 2, 'Looks more like a polar bear to me!', '2020-11-26 16:50:38'),
(47, 74, 2, 'Looks more like a polar bear to me!', '2020-11-26 16:50:49'),
(195, 76, 43, '\n\n\n', '2020-12-07 13:44:31'),
(49, 50, 2, 'Hello', '2020-11-29 22:02:39'),
(194, 157, 43, '\n\n\n', '2020-12-07 13:44:31'),
(74, 73, 20, 'no hei vaa', '2020-12-01 12:00:17'),
(193, 76, 43, 'Hello everygys\n\n\n\n', '2020-12-07 13:44:25'),
(76, 76, 20, 'no hei vaa', '2020-12-01 12:00:17'),
(192, 157, 43, 'Hello everygys\n\n\n\n', '2020-12-07 13:44:25'),
(191, 76, 43, 'Hello everygys\n\n\n\n', '2020-12-07 13:44:20'),
(301, 213, 20, 'no tiikeeri näytä muna', '2020-12-09 10:46:20'),
(55, 73, 16, 'Toimii', '2020-11-30 11:03:46'),
(56, 77, 1, 'Works?', '2020-11-30 12:18:49'),
(86, 64, 20, 'no jo on', '2020-12-01 12:03:49'),
(190, 157, 43, 'Hello everygys\n\n\n\n', '2020-12-07 13:44:20'),
(60, 76, 16, 'hello test man here', '2020-11-30 12:45:17'),
(295, 213, 20, 'heino lintu', '2020-12-09 10:42:35'),
(63, 55, 2, 'A beautiful cat', '2020-11-30 13:05:41'),
(64, 64, 2, 'Everything seems to operate as expected', '2020-11-30 13:05:59'),
(65, 66, 2, 'Looks terrifying!', '2020-11-30 13:06:48'),
(66, 74, 16, 'Definitely not a Tiger, looks like a giraffe to me to be honest', '2020-11-30 13:16:41'),
(189, 157, 43, 'another hetllo\n\n\n\n', '2020-12-07 13:43:55'),
(188, 157, 43, 'another hetllo\n\n\n\n', '2020-12-07 13:43:46'),
(91, 55, 20, 'no hei vaa', '2020-12-01 12:14:04'),
(92, 73, 20, 'no hei vaa', '2020-12-01 12:14:04'),
(93, 76, 20, 'no hei vaa', '2020-12-01 12:14:04'),
(94, 77, 20, 'no hei vaa', '2020-12-01 12:14:04'),
(96, 76, 20, 'pöllöööö\n', '2020-12-01 12:16:16'),
(97, 64, 20, 'testiä', '2020-12-01 12:21:11'),
(98, 66, 20, 'iha ok', '2020-12-01 12:22:32'),
(99, 66, 20, 'iha ok', '2020-12-01 12:22:45'),
(100, 66, 20, 'ei tää toimi', '2020-12-01 12:24:44'),
(101, 77, 20, 's', '2020-12-01 12:31:36'),
(102, 77, 20, 'adsadsads', '2020-12-01 12:31:59'),
(103, 77, 20, 'a', '2020-12-01 12:32:04'),
(104, 77, 20, 'moi', '2020-12-01 12:33:35'),
(105, 76, 20, 'pulipuli', '2020-12-01 12:35:25'),
(106, 77, 20, 'asd', '2020-12-01 12:38:19'),
(107, 77, 20, 'xas', '2020-12-01 12:39:49'),
(108, 77, 20, 'ok kommenttia', '2020-12-01 12:41:21'),
(224, 212, 20, 'tämä on hieno eläin', '2020-12-08 16:52:10'),
(110, 71, 20, 'kokeillaa', '2020-12-01 12:43:44'),
(111, 77, 20, 'no moi iha kivasti toimii', '2020-12-01 13:21:46'),
(177, 133, 1, 'No likes here', '2020-12-05 02:20:08'),
(113, 73, 20, 'no moi iha kivasti toimii', '2020-12-01 13:21:46'),
(331, 76, 20, 'mikäs vittu saatana moi vaan palalalalalalalalalla', '2020-12-10 20:38:26'),
(119, 77, 20, 's', '2020-12-01 15:06:34'),
(333, 262, 20, 'iha kiva kuva missä olit näytät ihan apinalta senki ruma apina hekohekoXDxDxDxD', '2020-12-10 00:46:53'),
(121, 77, 20, '', '2020-12-01 15:06:37'),
(123, 77, 20, '', '2020-12-01 15:06:40'),
(125, 77, 20, '', '2020-12-01 15:06:41'),
(127, 77, 20, '', '2020-12-01 15:06:43'),
(129, 77, 20, '', '2020-12-01 15:06:43'),
(334, 268, 20, 'adsads', '2020-12-10 01:12:02'),
(131, 77, 20, '', '2020-12-01 15:06:43'),
(133, 77, 20, '', '2020-12-01 15:06:44'),
(134, 76, 20, '', '2020-12-01 15:06:44'),
(135, 77, 20, '', '2020-12-01 15:06:44'),
(136, 76, 20, '', '2020-12-01 15:06:44'),
(137, 74, 20, 'no nyt on koommenttia', '2020-12-01 15:11:10'),
(226, 213, 20, 'tämä on hieno eläin', '2020-12-08 16:52:10'),
(176, 77, 1, 'How about commenting', '2020-12-05 02:11:58'),
(187, 157, 43, 'Hello all I am Admin\n\n\n\n\n', '2020-12-07 13:43:24'),
(147, 74, 19, 'plaaplaa', '2020-12-01 19:56:49'),
(172, 63, 19, 'no hei vaan', '2020-12-04 12:03:43'),
(151, 74, 19, 'hyrskyhyrsky', '2020-12-01 19:57:07'),
(179, 157, 20, 'no hei vaa\n', '2020-12-07 11:09:20'),
(222, 213, 20, 'komea elukka ', '2020-12-08 16:51:25'),
(161, 66, 19, 'kaikki toimii?\n', '2020-12-02 11:17:53'),
(162, 66, 19, 'kai kaikki toimii', '2020-12-02 11:18:13'),
(181, 157, 20, 'hieno sää', '2020-12-07 11:19:50'),
(182, 157, 20, 'no onjoo', '2020-12-07 11:19:54'),
(180, 157, 20, 'no moikkelis', '2020-12-07 11:19:45'),
(227, 211, 20, 'tämä on hieno eläin', '2020-12-08 16:52:10'),
(225, 213, 20, 'tämä on hieno eläin', '2020-12-08 16:52:10'),
(202, 193, 19, 'mikas vittu', '2020-12-08 12:01:25'),
(203, 193, 19, 'mikas vittu', '2020-12-08 12:01:25'),
(204, 193, 19, 'Ihan hölmö näköne otus hyi VITTTUUUU', '2020-12-08 12:01:52'),
(205, 193, 19, 'Ihan hölmö näköne otus hyi VITTTUUUU', '2020-12-08 12:01:52'),
(233, 209, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(231, 212, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(232, 213, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(230, 213, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(215, 183, 43, 'Hello this comment is written by Admin Tester', '2020-12-08 15:05:34'),
(216, 183, 43, 'More comments.', '2020-12-08 15:15:29'),
(235, 212, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(234, 212, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(293, 206, 20, 'heino lintu', '2020-12-09 10:42:34'),
(236, 211, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(237, 213, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(238, 212, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(239, 212, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(240, 212, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(241, 213, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(242, 213, 20, 'miks tää kopioituu toiseen kuvaa', '2020-12-08 16:53:59'),
(243, 212, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(244, 213, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(245, 213, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(246, 213, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(247, 212, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(248, 209, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(249, 207, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(250, 211, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(251, 209, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(252, 212, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(253, 213, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(254, 212, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(255, 212, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(256, 213, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(257, 206, 20, 'vili koira on kiva koira', '2020-12-08 16:57:46'),
(258, 206, 20, 'vili koira on kiva koira', '2020-12-08 16:57:47'),
(259, 208, 20, 'vili koira on kiva koira', '2020-12-08 16:57:47'),
(260, 195, 20, 'vili koira on kiva koira', '2020-12-08 16:57:47'),
(261, 213, 20, 'vili koira on kiva koira', '2020-12-08 16:57:47'),
(262, 212, 20, 'vili koira on kiva koira', '2020-12-08 16:57:47'),
(263, 183, 20, 'leijona', '2020-12-08 17:04:05'),
(264, 212, 20, 'leijona', '2020-12-08 17:04:05'),
(265, 213, 20, 'leijona', '2020-12-08 17:04:05'),
(298, 212, 20, 'heino lintu', '2020-12-09 10:42:34'),
(267, 212, 20, 'mika vaivaa kommentteja', '2020-12-08 17:07:16'),
(268, 213, 20, 'mika vaivaa kommentteja', '2020-12-08 17:07:16'),
(269, 212, 20, 'mika vaivaa kommentteja', '2020-12-08 17:07:16'),
(270, 208, 20, 'mika vaivaa kommentteja', '2020-12-08 17:07:16'),
(274, 183, 43, 'Nice one', '2020-12-08 22:44:48'),
(299, 211, 20, 'heino lintu', '2020-12-09 10:42:35'),
(294, 213, 20, 'heino lintu', '2020-12-09 10:42:34'),
(300, 193, 20, 'heino lintu', '2020-12-09 10:42:35'),
(302, 213, 20, 'mikas lintu', '2020-12-09 10:46:45'),
(303, 211, 20, 'mikas lintu', '2020-12-09 10:46:45'),
(304, 213, 20, 'viiru pöllö vittu', '2020-12-09 10:49:21'),
(305, 211, 20, 'viiru pöllö vittu', '2020-12-09 10:49:21'),
(306, 213, 20, 'viiru pöllö vittu', '2020-12-09 10:49:21'),
(307, 208, 20, 'viiru pöllö vittu', '2020-12-09 10:49:22'),
(317, 243, 16, 'Let\'s say something nice, what is wrong here?', '2020-12-09 17:58:30'),
(328, 250, 43, 'Another thumbs up!', '2020-12-10 14:41:53');

-- --------------------------------------------------------

--
-- Rakenne taululle `wop_testlikes`
--

CREATE TABLE `wop_testlikes` (
  `pic_id` int(11) NOT NULL,
  `likes` int(11) DEFAULT NULL,
  `dislikes` int(11) DEFAULT NULL,
  `user_id` text,
  `id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Vedos taulusta `wop_testlikes`
--

INSERT INTO `wop_testlikes` (`pic_id`, `likes`, `dislikes`, `user_id`, `id`) VALUES
(3, 1, 0, '1', 1),
(49, 1, 0, '1', 3),
(50, 1, 0, '1', 4),
(154, 1, 0, '19', 78),
(124, 1, 0, '1', 7),
(55, 1, 0, '1', 8),
(182, 0, 1, '20', 182),
(63, 1, 0, '1', 10),
(64, 1, 0, '1', 11),
(65, 1, 0, '1', 12),
(66, 1, 0, '1', 13),
(121, 1, 0, '1', 14),
(68, 1, 0, '1', 15),
(135, 1, 0, '1', 16),
(70, 1, 0, '1', 18),
(71, 0, 1, '1', 19),
(126, 1, 0, '1', 20),
(73, 1, 0, '1', 21),
(74, 1, 0, '1', 22),
(125, 1, 0, '1', 23),
(76, 1, 0, '1', 24),
(77, 1, 0, '1', 25),
(123, 1, 0, '1', 27),
(122, 1, 0, '1', 28),
(129, 1, 0, '1', 29),
(136, 1, 0, '1', 30),
(154, 1, 0, '20', 180),
(3, 1, 0, '2', 31),
(74, 0, 1, '20', 183),
(71, 1, 0, '20', 181),
(157, 6, 1, '19', 81),
(184, 1, 0, '20', 171),
(155, 0, 1, '19', 79),
(212, 1, 0, '20', 205),
(65, 1, 0, '20', 177),
(183, 1, 0, '20', 176),
(155, 1, 0, '20', 175),
(135, 1, 0, '20', 174),
(65, 1, 0, '43', 209),
(136, 0, 1, '20', 189),
(183, 1, 0, '43', 169),
(3, 1, 0, '43', 207),
(133, 1, 0, '1', 165),
(157, 1, 0, '43', 206),
(157, 1, 0, '20', 188),
(252, 1, 0, '47', 241),
(63, 0, 1, '20', 185),
(3, 0, 1, '20', 186),
(181, 1, 0, '20', 187),
(184, 1, 0, '19', 190),
(181, 1, 0, '19', 191),
(180, 1, 0, '19', 192),
(76, 1, 0, '19', 193),
(63, 1, 0, '19', 194),
(182, 1, 0, '19', 195),
(179, 1, 0, '19', 196),
(183, 0, 1, '19', 197),
(193, 1, 0, '19', 198),
(194, 1, 0, '19', 199),
(195, 1, 0, '19', 200),
(197, 1, 0, '19', 201),
(198, 1, 0, '20', 202),
(196, 0, 1, '20', 203),
(206, 1, 0, '20', 212),
(213, 1, 0, '20', 213),
(230, 0, 1, '20', 214),
(76, 1, 0, '16', 220),
(243, 1, 0, '16', 222),
(243, 1, 0, '2', 223),
(250, 1, 0, '43', 236),
(256, 1, 0, '20', 243),
(243, 0, 1, '20', 231),
(180, 1, 0, '43', 237),
(254, 1, 0, '43', 242),
(243, 1, 0, '43', 240);

-- --------------------------------------------------------

--
-- Rakenne taululle `wop_testpic`
--

CREATE TABLE `wop_testpic` (
  `pic_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `filename` text NOT NULL,
  `coords` text,
  `date` datetime DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `mediatype` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Vedos taulusta `wop_testpic`
--

INSERT INTO `wop_testpic` (`pic_id`, `user_id`, `description`, `filename`, `coords`, `date`, `post_date`, `mediatype`) VALUES
(3, 8, 'testDesc', '348c4baaac3f74a4d0c34684d821172e', '24.74,60.24', '2020-11-17 21:11:55', '2020-11-11 13:31:30', 'image'),
(252, 47, 'jekku koira', 'bb56bd6d5a28f295e1b69b5c936a587d', NULL, NULL, '2020-12-10 19:11:44', 'image'),
(135, 16, 'Test exif', '6fbdf2e220e22f7e9e6d115453e08291', '[24.818055555555556,60.220555555555556]', '2020-11-17 21:11:55', '2020-12-04 13:51:10', 'image'),
(133, 1, 'is it working', 'd6f44f94ae46c54c2621d4eb8ae3b1e4', NULL, NULL, '2020-12-04 12:51:50', 'image'),
(154, 19, 'uusia kuvia', 'bdf0476816de7699de381f62d893600f', '[24.84575,60.258116666666666]', '2019-11-27 13:56:08', '2020-12-05 21:53:05', 'image'),
(49, 1, 'Another try should be 49', '529c21375a824fc63d61708cd2ef0480', '[24.748889457492226, 60.14994900964592]', '2020-11-17 21:11:55', '2020-11-23 13:32:08', 'image'),
(50, 2, 'asdasd', '8e089199c87581ac46c3c0c886ead193', '[24.915057670383504, 60.138326935561395]', '2020-11-17 21:11:55', '2020-11-17 13:32:14', 'image'),
(157, 19, 'iha jepa', '1354141e97da104970022f0a3e042c35', '[24.84575,60.258116666666666]', '2019-11-27 13:56:08', '2020-12-06 14:05:06', 'image'),
(55, 2, 'Hello All and everyguys', '928e47eea1bddba791eea849d117442a', '[24.50307036568998, 60.28500979285104]', '2020-11-17 21:11:55', '2020-11-14 13:32:24', 'image'),
(64, 16, 'Here, I have a beautiful screnery of Nuuksio national park', '95a5097502111aa20a187231e11150cb', '[24.57173491647069, 60.320388131599316]', '2020-11-11 21:34:38', '2020-11-18 13:32:31', 'image'),
(65, 16, 'Here we have a beautiful bird, I have no idea of the name though, maybe a Finnish Night parrot? Someone could correct me on that one!', '93cf8d469c3ad31ece2d82169496a42c', '[24.714630539692735, 60.11539431439218]', '2020-11-17 21:11:55', '2020-11-21 13:32:38', 'image'),
(181, 43, 'Video testssss', '857adef2b583fb19fc7e6dfd5c1f290b', NULL, NULL, '2020-12-07 17:02:27', 'video'),
(182, 43, 'regex video test', '3b06f14347d03bc3d784f593307b627c', NULL, NULL, '2020-12-07 17:13:48', 'video'),
(63, 16, 'Test after modifications', 'fdd5ff5ac8e87482cebf7c3f33b91804', '[24.932624040529845, 60.1846456406459]', '2020-11-17 21:11:55', '2020-10-05 13:32:50', 'image'),
(66, 18, 'A fierce lion', '8e361d1f27175483fff9d6a94710db29', '[24.818055555555556,60.220555555555556]', '2020-11-17 21:11:55', '2020-11-25 13:32:55', 'image'),
(68, 16, 'date_time', 'add7a2b5539344a3e0610020c7097f9c', '[24.45459023030773, 60.30539869493765]', '2020-11-17 21:11:55', '2020-11-25 13:37:58', 'image'),
(70, 16, 'Testing after SQL modifications', 'c408246b4ee286d8139e4afbf3093a8f', '[25.08690039462752, 68.04784000943962]', '2020-11-17 21:11:55', '2020-11-25 15:18:24', 'image'),
(71, 16, 'Kaunis ilma tänään!', 'fd8a45f9b7af13d03b4071c83ab66fb0', '[26.13528296196202, 67.01471121389469]', '2020-11-17 21:11:55', '2020-11-25 15:34:03', 'image'),
(73, 16, 'Newest (for now)', '7eacaa7ce5712ce214db4d81b83d582f', '[25.914570842522664, 65.98067511984146]', '2020-11-11 21:34:38', '2020-11-25 23:58:53', 'image'),
(74, 2, 'Tiger in the woods!', 'cab01e82404885d986683ae3d721211a', '[28.783828395229335, 67.44184378894391]', '2020-11-11 21:34:38', '2020-11-26 16:40:14', 'image'),
(180, 43, 'Working video!', '27679cc5e52fa36117126070f74367be', NULL, NULL, '2020-12-07 16:47:44', 'video'),
(76, 16, 'Searching for req', 'bb9ab76527ec10bca2e751083314bbfd', '[24.818055555555556,60.220555555555556]', '2020-11-17 21:11:55', '2020-11-30 12:08:19', 'image'),
(77, 1, 'More testing pictures of dinosaurs', '239ba8d49478d590edcd61ffe4d5a4d3', '[24.818055555555556,60.220555555555556]', '2020-11-11 21:34:38', '2020-11-30 12:17:31', 'image'),
(155, 19, 'paska housu', '0a1c60f4dbf1836054f393e69dd73cfa', '[24.84575,60.258116666666666]', '2019-11-27 13:56:08', '2020-12-05 21:55:09', 'image'),
(183, 43, 'regex photo test', '1fefdc3665ed6c6df63d8f4d02e10070', NULL, NULL, '2020-12-07 17:15:13', 'image'),
(136, 16, 'No exif', '13d846e1b85cfa76bc6b831a736e6c67', NULL, NULL, '2020-12-04 13:51:42', 'image'),
(179, 43, 'VIDEO HERE', 'e9b4a5c2ac1a6ac9273fdde9f644b64d', NULL, NULL, '2020-12-07 16:08:51', 'video'),
(184, 43, 'Latest video', '112d7b590af5d573cd75160186e9a76e', NULL, NULL, '2020-12-07 17:34:06', 'video'),
(250, 43, 'Oranki ph video', '4f7b98e4a175898862b612ea863eb626', NULL, NULL, '2020-12-10 09:27:22', 'video'),
(269, 20, 'adsasdads', '40250b6db5c6274167728c26699d2d45', '[24.84575,60.258116666666666]', '2019-11-27 13:56:08', '2020-12-10 01:24:42', 'image'),
(266, 20, 'dsfdsf', 'fada7ecda7b035d50d7e39fd900fddcf', NULL, NULL, '2020-12-10 01:00:14', 'image'),
(262, 20, 'assa', 'f760b8364b72c8db4cb93bf8e249484e', NULL, '2007-04-28 20:33:47', '2020-12-10 00:42:24', 'image'),
(263, 20, 'hiohoh', '80240d721e0e2ffe0a4f553cabfc0ebf', NULL, '2007-04-28 20:33:47', '2020-12-10 00:43:14', 'image'),
(267, 20, 'asdsda', '85ef4c2b8e9c83d329af3cedf67e8ec5', NULL, '2007-04-28 20:33:47', '2020-12-10 01:02:24', 'image'),
(268, 20, 'asdadsasd', '74857fbfaf719d551af16346d9bca3e4', NULL, NULL, '2020-12-10 01:03:22', 'image'),
(257, 20, 'lion', 'bd2a75a0f83c306cf40b6db548ed65ff', NULL, NULL, '2020-12-10 00:36:11', 'image'),
(264, 20, 'ghgfh', 'e2e1c2a5eb31057f40e6e8ca3793a53f', NULL, '2017-04-18 11:19:59', '2020-12-10 00:56:15', 'image'),
(247, 20, 'video 4', '3c92107072463fffbf519772558ca71a', NULL, NULL, '2020-12-09 21:17:40', 'video'),
(254, 43, 'A nice looking parrot.', 'd1a1d71619ef8b08256ef19a1f3f0aba', NULL, '2017-10-21 16:21:18', '2020-12-10 00:02:20', 'image'),
(255, 20, 'vilsson', 'b49f3eaacaf6028736adb14f9b8e3617', NULL, NULL, '2020-12-10 00:08:07', 'image'),
(245, 20, 'mikä video', '27aa49982c5f7cfeadfaf84b7ff4fdfb', NULL, NULL, '2020-12-09 21:09:17', 'video'),
(243, 16, 'California tree testing, I took this photo while I was travelling in California in 2012. Finland has much smaller trees. Our trees aren\'t so big.', 'fec19ea9609ffba05a202f364284babc', '[-122.22425216666667,37.173141]', '2012-02-05 16:02:16', '2020-12-09 17:57:42', 'image'),
(258, 20, 'joku', 'd1cd461d0ac63638a3e6c89c51980946', NULL, '2005-06-23 14:19:49', '2020-12-10 00:37:50', 'image'),
(265, 20, 'gfghfhf', 'b855ab22c1ac51a3c4af2d637b0dc339', NULL, NULL, '2020-12-10 00:58:10', 'image'),
(256, 20, 'adsadssad', '36bdd6b1eba44c4ebcf52061d599f049', NULL, NULL, '2020-12-10 00:08:22', 'image'),
(241, 43, 'Videotst', 'cb920e9108593b1e594f0a49f8f94fa9', NULL, NULL, '2020-12-09 12:21:26', 'video');

-- --------------------------------------------------------

--
-- Rakenne taululle `wop_testuser`
--

CREATE TABLE `wop_testuser` (
  `user_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `lastname` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `admin` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Vedos taulusta `wop_testuser`
--

INSERT INTO `wop_testuser` (`user_id`, `name`, `lastname`, `email`, `password`, `admin`) VALUES
(1, 'John', 'Doe', 'john@metropolia.fi', '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 0),
(2, 'Jane', 'Doez', 'jane@metropolia.fi', '$2a$10$H7bXhRqd68DjwFIVkw3G1OpfIdRWIRb735GvvzCBeuMhac/ZniGba', 0),
(8, 'hello', 'sdasadasd', 'asd@aasd.fi', '$2a$10$PfhS3K3FXrVhVLy5T1D84erPanlcgo7PTm8ZFxF8UHETjDoIbH9Y.', 0),
(9, 'Hello', 'World', 'a@a.com', '$2a$10$w13L6O8HvRMi0ilDdpJtGum6zAICzV0uWQS.q3cz9BjG8DE/DKHKS', 0),
(10, 'Lauri', 'Peksi', 'hello@kappa.com', '$2a$10$.brdENQ1oJyM.dKR4GsHLOsOPrG9kNUiw5eaRBvlb0EOZcXxtLame', 0),
(11, 'Kalle', 'Keksi', 'my@name.com', '$2a$10$noEdXdP/QkFxbQrFMgPeVuxFceOgi3LRFk.s2iEWzu0iEHzmKPLSO', 0),
(12, 'hello', 'bbbbb', '123@456.com', '$2a$10$GfsyGeLihz3Ng9Jj2VxrLOWanvmo9eqUj7ARBAE8b/iQvT4bBTvX.', 0),
(13, 'heyhey:)', 'aaaaaa', '432@123.com', '$2a$10$x9j8BDpEYchFrsEU43NPPeFJUywwgnY2gAuvuUfql0CSDYQPAoNT6', 0),
(14, 'hello', 'sdasadasd', 'asd@aasd.fi', '$2a$10$nIRfkfz8YW4eQAqx9mIw6u9GB.S1JCf8yfSmcP/IdwR4BO1Xj6Hrm', 0),
(15, 'Test', 'User', 'test@user.com', '$2a$10$TO2UY8P6ztYg0tTuBb5t8ODYJ1s3EU/xZmUvsPmqnMMaPnHxCeGD2', 0),
(16, 'Testing', 'Man', 'lauri@hello.fi', '$2a$10$GJl1HW5GzAn/0Xh5444I4O8QX/Q9MUo6O.t.QqpUQozTUHl12rtvG', 0),
(17, 'patrik', 'polkki', 'patrik@gmail.com', '$2a$10$dR15Xfvn3B.Ao5hoXuFkDuji9bHs1QbOMJnBo2nPJj4uqh03TxJZG', 0),
(18, 'Matti', 'Meikalainen', 'matti@meika.fi', '$2a$10$5I5SJrRkVZVi6C6ckPgffOtJWI5ujcUcgpcx1PfKqGAZWUsSohZ12', 0),
(19, 'plaa', 'plaa', 'plaa@gmail.com', '$2a$10$q4f3JfhOlx2F5WYxUGBIYuh0gYOHiJJ5KNxyPJmZWrS8.wtCxsz8u', 0),
(20, 'Patrik', 'Pölkki', 'pate.polkki@gmail.com', '$2a$10$uEifpUk0tbyhRe6MGk9Odu6ebYf9zRMeVIymf6cvr0N/.urpwlmMa', 0),
(46, 'dasdsa', 'dasdas', 'laurids@hello.fi', '$2a$10$HIyiSsuuV6m33nJLQAyVX.8rHA1cKnQWUh05fwL6/gTqp8c.od022', 0),
(43, 'Admin', 'Tester', 'admin@wildlife.com', '$2a$10$FC/l5n9c0PvHFq7FtOjbVug21nENcyS95V2soeVdNV7XHXK9LgD82', 1),
(45, 'Assa', 'Sassa', 'ass@ass.com', '$2a$10$OtAGF66l4gOfnrwRStf.Uef1S3pH9YIDmGug1QyVLh.BOH3vIlU3q', 0),
(47, 'kimi', 'Räikkönen', 'kimiraikkonen@gmail.com', '$2a$10$123CniUj9qZ/i1IZ3ygfZ.2H1EmQoH3lw7X/fXzfFrgJ.Uwj0vhOG', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `wop_testcomments`
--
ALTER TABLE `wop_testcomments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wop_testlikes`
--
ALTER TABLE `wop_testlikes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wop_testpic`
--
ALTER TABLE `wop_testpic`
  ADD PRIMARY KEY (`pic_id`);

--
-- Indexes for table `wop_testuser`
--
ALTER TABLE `wop_testuser`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `wop_testcomments`
--
ALTER TABLE `wop_testcomments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=336;

--
-- AUTO_INCREMENT for table `wop_testlikes`
--
ALTER TABLE `wop_testlikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `wop_testpic`
--
ALTER TABLE `wop_testpic`
  MODIFY `pic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=270;

--
-- AUTO_INCREMENT for table `wop_testuser`
--
ALTER TABLE `wop_testuser`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
