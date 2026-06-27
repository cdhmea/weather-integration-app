DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL
);

INSERT INTO users (username, password) VALUES ('maksim', '123');

INSERT INTO cities (name, user_id) VALUES
('Ростов-на-Дону', (SELECT id FROM users WHERE username = 'maksim')),
('Москва', (SELECT id FROM users WHERE username = 'maksim'));