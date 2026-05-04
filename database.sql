CREATE DATABASE IF NOT EXISTS todo_app;

USE todo_app;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (text, completed)
VALUES
  ('Min forsta todo fran databasen', false),
  ('Plugga Next.js App Router', false),
  ('Forsta Client Components', false),
  ('Koppla todo-appen till MySQL', true);
