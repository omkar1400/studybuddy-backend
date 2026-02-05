-- StudyBuddy PostgreSQL Database Schema
-- Created for PROG2500 Full Stack Development
-- Author: Omkar Singh (8781929)
-- Converted from MySQL to PostgreSQL for Render deployment

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS StudySessions CASCADE;
DROP TABLE IF EXISTS Subjects CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- Table 1: Users
-- Stores user account information for authentication
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON Users(email);

-- Table 2: Subjects
-- Stores subjects/topics that users want to study
CREATE TABLE Subjects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_subjects_user_id ON Subjects(user_id);

-- Table 3: StudySessions
-- Stores individual study sessions with timing and status
-- Define custom ENUM type for status
CREATE TYPE session_status AS ENUM ('pending', 'completed', 'cancelled');

CREATE TABLE StudySessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status session_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_sessions_user_id ON StudySessions(user_id);
CREATE INDEX idx_sessions_subject_id ON StudySessions(subject_id);
CREATE INDEX idx_sessions_status ON StudySessions(status);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_studysessions_updated_at 
    BEFORE UPDATE ON StudySessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

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
