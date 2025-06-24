-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 24 jun 2025 om 11:09
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sed`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `dashboard`
--

CREATE TABLE `dashboard` (
  `Dashboard_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `hydrogen data`
--

CREATE TABLE `hydrogen data` (
  `sensor_data_id` int(11) NOT NULL,
  `production_rate` float NOT NULL,
  `auto_consumption_rate` int(11) NOT NULL,
  `storage_home` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `preferences`
--

CREATE TABLE `preferences` (
  `User_id` int(11) NOT NULL,
  `unit_system` varchar(10) NOT NULL,
  `notification_enabled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `sensor data`
--

CREATE TABLE `sensor data` (
  `sensor_data_id` int(11) NOT NULL,
  `dashboard_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sensor_type` varchar(50) NOT NULL,
  `value` float NOT NULL,
  `unit` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user`
--

CREATE TABLE `user` (
  `User_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`Dashboard_id`);

--
-- Indexen voor tabel `hydrogen data`
--
ALTER TABLE `hydrogen data`
  ADD PRIMARY KEY (`sensor_data_id`);

--
-- Indexen voor tabel `preferences`
--
ALTER TABLE `preferences`
  ADD PRIMARY KEY (`User_id`);

--
-- Indexen voor tabel `sensor data`
--
ALTER TABLE `sensor data`
  ADD PRIMARY KEY (`sensor_data_id`);

--
-- Indexen voor tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `Dashboard_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `hydrogen data`
--
ALTER TABLE `hydrogen data`
  MODIFY `sensor_data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `preferences`
--
ALTER TABLE `preferences`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `sensor data`
--
ALTER TABLE `sensor data`
  MODIFY `sensor_data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `user`
--
ALTER TABLE `user`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
