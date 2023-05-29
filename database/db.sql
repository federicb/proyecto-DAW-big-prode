DROP DATABASE IF EXISTS DEV_BIG_PRODE;
CREATE DATABASE DEV_BIG_PRODE CHARSET utf8mb4;
USE DEV_BIG_PRODE;

-- USERS TABLE
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users ADD COLUMN total_points INT DEFAULT 0;

-- FORECASTS TABLE
CREATE TABLE forecasts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_round INT NOT NULL,
    id_fixture INT NOT NULL,
    f_goal_local INT,
    f_goal_away INT,
    pts INT,
    id_user INT UNSIGNED,
    CONSTRAINT fk_user FOREIGN KEY(id_user) REFERENCES users(id),
    CONSTRAINT UC_forecasts UNIQUE (id, id_user)
);

ALTER TABLE forecasts DROP COLUMN pts;

-- GROUPS TABLE
CREATE TABLE `groups` (
    id VARCHAR(100) PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    user_creator INT UNSIGNED,
    CONSTRAINT fk_user_creator FOREIGN KEY(user_creator) REFERENCES users(id)
);

-- INTERMEDIATE TABLE USERS - GROUPS
CREATE TABLE users_groups (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_user INT UNSIGNED,
    id_group VARCHAR(100),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_group) REFERENCES `groups`(id)
);
