-- SQL Seed Script for Portal Curso Técnico Balbina
-- Use this script in the SQL tab of phpMyAdmin to insert initial test data.
-- Make sure you have already run schema.sql to create the tables.

-- 1. Create a test student user
-- NOTE: In a real application, passwords should be securely hashed.
INSERT INTO `users` (`email`, `password`) VALUES
('aluno.teste@email.com', 'senha123');

-- Get the ID of the user we just created
SET @last_user_id = LAST_INSERT_ID();

-- 2. Create a profile for the test student
INSERT INTO `profiles` (`user_id`, `full_name`, `student_registration`) VALUES
(@last_user_id, 'Aluno de Teste', '2025001');

-- 3. Assign the 'student' role to the user
INSERT INTO `user_roles` (`user_id`, `role`) VALUES
(@last_user_id, 'student');

-- 4. Create a test subject
INSERT INTO `subjects` (`name`, `description`, `schedule`) VALUES
('Lógica de Programação', 'Fundamentos da programação e algoritmos.', 'Seg/Qua - 19:00-21:00');

-- Get the ID of the subject we just created
SET @last_subject_id = LAST_INSERT_ID();

-- 5. Enroll the test student in the test subject
INSERT INTO `enrollments` (`student_id`, `subject_id`) VALUES
(@last_user_id, @last_subject_id);

-- You can add more data following the same pattern.
-- For example, creating a teacher:
-- INSERT INTO `users` (`email`, `password`) VALUES ('professor.teste@email.com', 'senha456');
-- SET @last_teacher_id = LAST_INSERT_ID();
-- INSERT INTO `profiles` (`user_id`, `full_name`) VALUES (@last_teacher_id, 'Professor de Teste');
-- INSERT INTO `user_roles` (`user_id`, `role`) VALUES (@last_teacher_id, 'teacher');
-- UPDATE `subjects` SET `teacher_id` = @last_teacher_id WHERE `id` = @last_subject_id;
