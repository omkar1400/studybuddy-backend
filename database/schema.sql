-- StudyBuddy Database Schema
-- Created for PROG2500 Full Stack Development
-- Author: Omkar Singh (8781929)

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS studybuddy;
USE studybuddy;

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS StudySessions;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Users;

-- Table 1: Users
-- Stores user account information for authentication
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Table 2: Subjects
-- Stores subjects/topics that users want to study
CREATE TABLE Subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Table 3: StudySessions
-- Stores individual study sessions with timing and status
CREATE TABLE StudySessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_subject_id (subject_id),
    INDEX idx_status (status)
);

-- Insert sample data for testing (optional)
-- Sample User (password is 'password123' hashed with bcrypt)
INSERT INTO Users (name, email, password) VALUES 
('Test User', 'test@example.com', '$2a$10$XZPqOq.VbN5kZ8qxJGJqYOKnL5xDMVQYWjQQ8VxVvZN8oVqKqKqKq');

-- Sample Subjects
INSERT INTO Subjects (user_id, name, description) VALUES 
(1, 'Mathematics', 'Calculus and Linear Algebra'),
(1, 'Computer Science', 'Data Structures and Algorithms'),
(1, 'Physics', 'Mechanics and Thermodynamics');

-- Sample Study Sessions
INSERT INTO StudySessions (user_id, subject_id, title, description, start_time, end_time, status) VALUES 
(1, 1, 'Calculus Review', 'Review derivatives and integrals', '2026-02-05 14:00:00', '2026-02-05 16:00:00', 'pending'),
(1, 2, 'Algorithm Practice', 'Practice sorting algorithms', '2026-02-05 10:00:00', '2026-02-05 12:00:00', 'completed'),
(1, 3, 'Physics Lab', 'Complete lab assignment', '2026-02-06 09:00:00', '2026-02-06 11:00:00', 'pending');
